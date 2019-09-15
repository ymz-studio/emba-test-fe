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
    <div class="chart" v-if="chartVisible">
      <chart legend class="chart-instance" :data="chartData"></chart>
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

import Chart from "@/components/Chart.vue";

@Component({
  layout: "empty",
  components: {
    Chart
  }
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
    sse.addEventListener("error", async e => {
      await this.$alert("事件已断开, 请刷新重试");
      location.reload(true);
    });
    this.sse = sse;
  }
  @Watch("data") onDataChange(val: any) {
    this.chartData = this.handleData(val);
  }

  token = "";
  loading = 0;
  chartVisible = false;
  stop = false;
  chart: any = null;
  data: any[] = [];
  qrcodeUrl = "";
  sse: EventSource | null = null;
  chartData: any = [];
  async created() {
    await this.getToken();
    await this.getData();
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
      x: parseInt(item.AE) - parseInt(item.RO),
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
  width: 560px;
  max-width: 100%;
}
.chart-instance {
  margin-bottom: 20px;
}
</style>