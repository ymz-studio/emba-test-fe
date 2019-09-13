<template>
  <div>
    <h2>你的学习风格方式</h2>
    <chart :data="chartData"></chart>
    <h1 class="type">{{type}}</h1>
    <p>你的数据点离方格中心越近，说明你的学习风格越平衡。如果你的数据点落在方格角落的无阴影区域，则表示你倾向于依赖那种学习风格。</p>
    <p>如果你的数据点落在阴影区域，则说明你的学习风格是两种风格的结合。如果你的数据点落在阴影区域的中间，那么你在体验、思考、反映和行动间能取得平衡。</p>
    <h2 class="mt">{{config[type].title}}</h2>
    <p>{{config[type].description}}</p>
    <h2 class="mt">你的优势</h2>
    <el-tag v-for="item in config[type].advantage" :key="item">{{item}}</el-tag>
     <h2 class="mt">你与人相处的秘诀</h2>
      <el-tag type='success' v-for="item in config[type].secret" :key="item">{{item}}</el-tag>
  </div>
</template>
<script lang="ts">
import { Vue, Component } from "vue-property-decorator";
import Chart from "@/components/Chart.vue";

@Component({
  components: {
    Chart
  }
})
export default class extends Vue {
  get x() {
    const { AE, RO } = this.$route.query;
    // @ts-ignore
    return parseInt(RO) - parseInt(AE) + 6;
  }

  get y() {
    const { AC, CE } = this.$route.query;
    // @ts-ignore
    return parseInt(AC) - parseInt(CE) + 6;
  }

  get config() {
    return require("../result-config.json");
  }

  get type() {
    if (this.x > 0 && this.y > 0) {
      return "散发型:经验观察型";
    } else if (this.x < 0 && this.y > 0) {
      return "适应型:经验实干型";
    } else if (this.x < 0 && this.y < 0) {
      return "归纳型:推论实干型";
    } else if (this.x > 0 && this.y < 0) {
      return "消化型:推论观察型";
    }
  }

  get chartData() {
    const data = [];
    for (let k in this.$route.query) {
      data.push({
        name: k,
        // @ts-ignore
        value: parseInt(this.$route.query[k])
      });
    }
    return data;
  }
}
</script>
<style lang="scss" scoped>
.type {
  text-align: center;
  color: #409eff;
}
.mt {
  margin-top: 30px;
}
.el-tag {
  margin-right: 10px;
  margin-bottom: 10px;
}
p {
  line-height: 1.65;
}
</style>