<template>
  <div class="chart-container" ref="container">
    <canvas :id="name"></canvas>
  </div>
</template>
<script lang="ts">
import { Vue, Component, Prop, Watch } from "vue-property-decorator";
//@ts-ignore
import F2 from "@antv/f2/lib/core";
import "@antv/f2/lib/geom/point";
import "@antv/f2/lib/component/guide/line";
import "@antv/f2/lib/component/guide/text";
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

  @Prop({
    type: String,
    default: Math.random()
      .toString(36)
      .slice(-8)
  })
  name!: string;

  @Watch("data")
  onDataChange(val: any) {
    if (this.chart) {
      this.chart.changeData(this.handleData(val));
    }
  }

  handleData(data: any) {
    console.log(data);
    return data.map((item: any) => ({
      name: item.name,
      x: -item.x,
      y: -item.y
    }));
  }

  mounted() {
    const container = this.$refs.container as Element;

    const chart = new F2.Chart({
      id: this.name,
      pixelRatio: window.devicePixelRatio,
      width: container.clientWidth,
      height: container.clientWidth,
      plugins: [Guide, Legend],
      appendPadding: 0,
      padding: [
        this.legend
          ? container.clientWidth * 0.05 + 60
          : container.clientWidth * 0.06,
        container.clientWidth * 0.06,
        container.clientWidth * 0.06,
        container.clientWidth * 0.06
      ]
    });
    chart.source(this.handleData(this.data), {
      x: {
        min: -48,
        max: 36
      },
      y: {
        min: -48,
        max: 36
      }
    });
    chart.axis("x", false);
    chart.axis("y", false);
    chart.legend(
      "name",
      this.legend && {
        align: "left",
        itemWidth: null, // 图例项按照实际宽度渲染,
        nameStyle: {
          fontSize: container.clientWidth * 0.05
        },
        marker: {
          radius: container.clientWidth * 0.01
        }
      }
    );
    chart
      .point()
      .position("x*y")
      .color("name")
      .size(container.clientWidth * 0.01)
      .animate({
        appear: {
          delay: 300
        }
      });
    chart.guide().line({
      start: ["min", -6],
      end: ["max", -6],
      style: {
        lineDash: [5, 10]
      }
    });
    chart.guide().line({
      start: ["min", -6],
      end: ["max", -6],
      style: {
        lineWidth: 12,
        opacity: 0.2
      }
    });

    chart.guide().line({
      start: [-6, "min"],
      end: [-6, "max"],
      style: {
        lineDash: [5, 10]
      }
    });
    chart.guide().line({
      start: [-6, "min"],
      end: [-6, "max"],
      style: {
        lineWidth: 12,
        opacity: 0.2
      }
    });
    chart.guide().text({
      top: false,
      position: ["max", -6],
      content: "静思\n观察",
      style: {
        fill: "#000",
        fontSize: container.clientWidth * 0.05
      },
      limitInPlot: true
    });
    chart.guide().text({
      top: false,
      position: [-6, "min"],
      content: "抽象\n概念",
      style: {
        fill: "#000",
        fontSize: container.clientWidth * 0.05
      },
      limitInPlot: true
    });
    chart.guide().text({
      top: false,
      position: ["min", -6],
      content: "主动\n体验",
      style: {
        fill: "#000",
        fontSize: container.clientWidth * 0.05
      }
    });
    chart.guide().text({
      top: false,
      position: [-6, "max"],
      content: "具体\n经验",
      style: {
        fill: "#000",
        fontSize: container.clientWidth * 0.05
      }
    });
    // 四象限文字
    chart.guide().text({
      top: false,
      position: [-32, "min"],
      content: "归纳型:推论实干型",
      style: {
        fill: "#4d73be",
        fontSize: container.clientWidth * 0.04
      }
    });
    chart.guide().text({
      top: false,
      position: [-32, "max"],
      content: "适应型:经验实干型",
      style: {
        fill: "#4d73be",
        fontSize: container.clientWidth * 0.04
      }
    });
    chart.guide().text({
      top: false,
      position: [20, "max"],
      content: "散发型:经验观察型",
      style: {
        fill: "#4d73be",
        fontSize: container.clientWidth * 0.04
      }
    });
    chart.guide().text({
      top: false,
      position: [20, "min"],
      content: "消化型:推论观察型",
      style: {
        fill: "#4d73be",
        fontSize: container.clientWidth * 0.04
      }
    });
    this.chart = chart;
    chart.render();
  }
}
</script>