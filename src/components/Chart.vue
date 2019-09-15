<template>
  <div class="chart-container" ref="container">
    <canvas id="chart"></canvas>
  </div>
</template>
<script lang="ts">
import { Vue, Component, Prop, Watch } from "vue-property-decorator";
//@ts-ignore
import F2 from "@antv/f2/lib/core";
import "@antv/f2/lib/geom/point";
import "@antv/f2/lib/component/guide/line";
import "@antv/f2/lib/component/guide/html";
// @ts-ignore
import Guide from "@antv/f2/lib/plugin/guide";
// @ts-ignore
import Legend from "@antv/f2/lib/plugin/legend";
@Component
export default class extends Vue {
  @Prop() data: any;
  chart: any;

  @Prop({
    type: Boolean,
    default: false
  })
  legend!: boolean;

  @Watch("data") onDataChange(val: any) {
    if (this.chart) {
      this.chart.changeData(val);
    }
  }

  mounted() {
    const container = this.$refs.container as Element;

    const chart = new F2.Chart({
      id: "chart",
      pixelRatio: window.devicePixelRatio,
      width: container.clientWidth,
      height: container.clientWidth,
      plugins: [Guide, Legend]
    });
    chart.source(this.data, {
      x: {
        min: -42,
        max: 48
      },
      y: {
        min: -42,
        max: 48
      }
    });
    chart.axis("x", false);
    chart.axis("y", false);
    chart.legend(
      this.legend && {
        align: "left",
        itemWidth: null // 图例项按照实际宽度渲染
      }
    );
    chart
      .point()
      .position("x*y")
      .color("name")
      .size(5)
      .animate({
        appear: {
          delay: 300
        }
      });
    chart.guide().line({
      start: ["min", 6],
      end: ["max", 6],
      style: {
        lineDash: [5, 10]
      }
    });
    chart.guide().line({
      start: ["min", 6],
      end: ["max", 6],
      style: {
        lineWidth: 12,
        opacity: 0.2
      }
    });

    chart.guide().line({
      start: [6, "min"],
      end: [6, "max"],
      style: {
        lineDash: [5, 10]
      }
    });
    chart.guide().line({
      start: [6, "min"],
      end: [6, "max"],
      style: {
        lineWidth: 12,
        opacity: 0.2
      }
    });
    chart.guide().html({
      position: ["max", 6],
      html: '<div class="chart-label">主动<br>体验</div>',
      alignX: "center"
    });
    chart.guide().html({
      position: [6, "min"],
      html: '<div class="chart-label">具体<br>经验</div>',
      alignX: "center"
    });
    chart.guide().html({
      position: ["min", 6],
      html: '<div class="chart-label">静思<br>观察</div>',
      alignX: "center"
    });
    chart.guide().html({
      position: [6, "max"],
      html: '<div class="chart-label">抽象<br>概念</div>',
      alignX: "center"
    });
    // 四象限文字
    chart.guide().html({
      position: [32, 26],
      html: '<div class="placeholder">归纳型:推论实干型</div>',
      alignX: "center"
    });
    chart.guide().html({
      position: [32, -15],
      html: '<div class="placeholder">适应型:经验实干型</div>',
      alignX: "center"
    });
    chart.guide().html({
      position: [-20, -15],
      html: '<div class="placeholder">散发型:经验观察型</div>',
      alignX: "center"
    });
    chart.guide().html({
      position: [-20, 26],
      html: '<div class="placeholder">消化型:推论观察型</div>',
      alignX: "center"
    });
    this.chart = chart;
    chart.render();
  }
}
</script>
<style lang="scss" scoped>
.chart-container /deep/ {
  .chart-label {
    font-size: 12px;
    white-space: nowrap;
    background: #fff;
  }
  .placeholder {
    white-space: nowrap;
    background: #fff;
    color: #f1a312;
  }
}
</style>