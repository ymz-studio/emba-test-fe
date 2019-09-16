<template>
  <div class="container">
    <div ref="card" class="card" v-loading="loading">
      <div class="start" @click="onStart" v-if="!token">
        <img src="@/assets/qrcode.svg" />
        <h2>点击开始测试</h2>
      </div>
      <div v-else>
        <h1>
          学习风格测试结果 共完成
          <strong> {{data.length}} </strong>人
        </h1>
        <el-row type="flex" justify="space-around">
          <div class="qrcode">
            <canvas id="qrcode"></canvas>
            <p>{{qrcodeUrl}}</p>
            <el-button v-if="stop" type="text" @click="onStart">重新发起测试</el-button>
            <el-button v-else type="text" @click="onStop">停止测试</el-button>
            <el-button type="text" @click="onExport">导出EXCEL</el-button>
          </div>
          <div class="chart" v-if='chartData && chartData.length'>
            <chart :data="chartData" name='chart'></chart>
          </div>
        </el-row>
      </div>
    </div>
    <div class="card" v-if='data.length'>
      <el-row :gutter="50" type="flex" class="group-row">
        <el-col :span="8" v-for="(item , k) in groupData" :key="k" class="group-col">
          <h1>{{k}}</h1>
          <chart :data="item" legend :name="k"></chart>
        </el-col>
      </el-row>
    </div>
  </div>
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
          width: window.innerWidth > 600 ? 460 : 260
        });
        this.qrcodeUrl = qrcodeUrl;
      }
      this.listen();
    });
  }

  token = "";
  loading = 0;
  stop = false;
  chart: any = null;
  data: any[] = [];
  qrcodeUrl = "";
  sse: EventSource | null = null;

  get groupData() {
    let map: any = {};
    this.data.forEach(item => {
      if (!map[item.group]) {
        map[item.group] = [];
      }
      map[item.group].push({
        name: item.name,
        group: item.group,
        x: parseInt(item.AE) - parseInt(item.RO),
        y: parseInt(item.AC) - parseInt(item.CE)
      });
    });
    return map;
  }

  get chartData() {
    return this.handleData(this.data);
  }

  async created() {
    await this.getToken();
    await this.getData();
  }

  async listen() {
    const sse = new EventSource("/api/admin/data/sse");
    sse.addEventListener("message", e => {
      this.data = JSON.parse(e.data);
    });
    sse.addEventListener("error", async e => {
      sse.close();
      this.listen();
    });
    this.sse = sse;
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
    this.data = []
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
.container {
  background: #fff;
  overflow: auto;
}
.card {
  min-height: 100vh;
  background: #fff;
  box-sizing: border-box;
  text-align: center;
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
  width: 740px;
  max-width: 100%;
}
.chart-instance {
  margin-bottom: 20px;
}
h1 {
  font-weight: 400;
  strong {
    color: #e6a23c;
  }
  text-align: center;
}
.group-col {
  border: 1px solid #bcbcbc;
}
.group-row {
  flex-wrap: wrap;
  max-width: 100%;
  padding-left: 50px;
}
</style>