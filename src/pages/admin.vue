<template>
  <el-card ref="card" class="card" v-loading="loading">
    <div class="start" @click="onStart" v-if="!token">
      <img src="@/assets/qrcode.svg" />
      <h2>点击开始测试</h2>
    </div>
    <div class="qrcode" v-if="token" v-show="!chartVisible">
      <h2>扫描二维码开始测试</h2>
      <canvas id="qrcode"></canvas>
      <p>{{qrcodeUrl}}</p>
      <el-button type="text" @click="chartVisible = true">切换至统计界面</el-button>
    </div>
    <div class="chart" v-show="chartVisible">
      <canvas id="admin-chart"></canvas>
      <el-button v-if="!stop" type="text" @click="chartVisible = false">查看二维码</el-button>
      <el-button v-if="stop" type="text" @click="onStart">重新发起测试</el-button>
      <el-button v-else type="text" @click="onStop">停止测试</el-button>
      <el-button type="text" @click="onExport">导出EXCEL</el-button>
    </div>
  </el-card>
</template>
<script lang="ts">
import { Vue, Component, Watch } from "vue-property-decorator";
import { axios } from "@/plugins/axios";
//@ts-ignore
import F2 from "@antv/f2";

//@ts-ignore
import Qrcode from "qrcode/build/qrcode";
@Component({
  layout: "empty"
})
export default class extends Vue {
  @Watch("token", { immediate: true }) async onTokenChange(val: string) {
    this.$nextTick(() => {
      if (val) {
        const qrcodeUrl = location.origin + "/#/" + "?token=" + val;
        Qrcode.toCanvas(document.getElementById("qrcode"), qrcodeUrl, {
          width: window.innerWidth > 600 ? 360 : 260
        });
        this.qrcodeUrl = qrcodeUrl;
      }
    });
    const sse = new EventSource("/api/admin/data/sse");
    sse.addEventListener("message", e => {
      this.data = JSON.parse(e.data);
    });
    this.sse = sse;
  }

  @Watch("data") onDataChange(data: any) {
    this.chart && this.chart.changeData(this.handleData(data));
  }
  token = "";
  loading = 0;
  chartVisible = false;
  stop = false;
  chart: any = null;
  data: any[] = [];
  qrcodeUrl = "";
  sse: EventSource | null = null;

  created() {
    this.getToken();
    this.getData();
  }

  mounted() {
    const chart = new F2.Chart({
      id: "admin-chart",
      pixelRatio: window.devicePixelRatio,
      width: window.innerWidth > 600 ? 560 : 260,
      height: 400
    });
    chart
      .point({
        startOnZero: true
      })
      .position("x*y")
      .color("name")
      .style({
        fillOpacity: 0.65
      });
    chart.render();
    this.chart = chart;
  }

  async getToken() {
    this.loading++;
    const { data } = await axios.get("/api/admin/token");
    this.token = data;
    this.loading--;
  }

  async getData() {
    const { data } = await axios.get("/api/admin/data");
    this.data = data;
  }

  async onStart() {
    await axios.post("/api/admin/start");
    await this.getToken();
    if (this.stop) {
      this.chart.changeData([]);
      this.chartVisible = false;
    }
    this.stop = false;
  }

  async onStop() {
    const confirm = await this.$confirm(
      "停止后无法将继续本次测试",
      "确定停止吗?"
    );
    await axios.post("/api/admin/stop");
    this.stop = true;
  }

  async onExport() {
    const a = document.createElement("a");
    a.href = "/api/admin/export";
    a.click();
  }

  handleData(data: any[]) {
    return data.map((item: any) => ({
      name: item.name,
      x: parseInt(item.RO) - parseInt(item.AE),
      y: parseInt(item.AC) - parseInt(item.CE)
    }));
  }

  beforeDestroy() {
    this.sse && this.sse.close();
  }
}
</script>
<style lang="scss" scoped>
.card {
  max-width: min-content;
  margin: 0 auto;
}
h2 {
  text-align: center;
  font-weight: 400;
  margin-bottom: 0;
}
.start {
  cursor: pointer;
}
.qrcode {
  text-align: center;
}
.chart {
  text-align: center;
}
</style>