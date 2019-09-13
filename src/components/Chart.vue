<template>
  <div ref="container">
    <canvas id="chart"></canvas>
  </div>
</template>
<script lang="ts">
import { Vue, Component, Prop } from "vue-property-decorator";
//@ts-ignore
import F2 from "@antv/f2";

@Component
export default class extends Vue {
  @Prop() data: any;

  mounted() {
    const container = this.$refs.container as Element;
    const chart = new F2.Chart({
      id: "chart",
      pixelRatio: window.devicePixelRatio,
      width: container.clientWidth,
      height: 300
    });
    chart.source(this.data, {
      value: {
        min: 0,
        max: 48
      }
    });
    chart.scale("name", {
      formatter(val: string) {
        switch (val) {
          case "CE":
            return "具体经验";
          case "AE":
            return "主动经验";
          case "RO":
            return "静思观察";
          case "AC":
            return "抽象概念";
        }
      }
    });
    chart.coord("polar");
    chart.tooltip(false);
    chart.axis("value", {
      grid: {
        lineDash: null
      },
      label: null,
      line: null
    });
    chart.axis("name", {
      grid: {
        lineDash: null
      }
    });
    chart
      .area()
      .position("name*value")
      .color("#409eff")
      .style({
        fillOpacity: 0.2
      })
      .animate({
        appear: {
          animation: "groupWaveIn"
        }
      });
    chart
      .line()
      .position("name*value")
      .color("#409eff")
      .size(1)
      .animate({
        appear: {
          animation: "groupWaveIn"
        }
      });
    chart
      .point()
      .position("name*value")
      .color("#409eff")
      .animate({
        appear: {
          delay: 300
        }
      });
    chart.render();
  }
}
</script>
<style lang="scss" scoped>
</style>