<template>
  <div class="container" v-loading.fullscreen="loading">
    <template v-if="!loading">
      <h3>{{index + 1}}. {{title}}</h3>
      <el-row type="flex">
        <draggable
          :animation="200"
          :list="curAnswer"
          tag="ul"
          class="option answer"
          :class="{empty}"
          group="answer"
        >
          <li v-for="item in curAnswer" :key="item.label">{{item.label}}</li>
        </draggable>
        <img src="@/assets/arrow.svg" />
      </el-row>
      <p v-if="cloneOtions.length">标签:</p>
      <div>
        <draggable tag="ul" :list="cloneOtions" :sort="false" class="option" group="answer">
          <li v-for="item in cloneOtions" :key="item.label">{{item.label}}</li>
        </draggable>
      </div>
      <el-button
        type="primary"
        class="submit"
        :disabled="disabled"
        @click="onSubmit"
      >{{last ? '完成测试': '下一题'}}</el-button>
    </template>
  </div>
</template>
<script lang="ts">
// @ts-ignore
import draggable from "vuedraggable";
import { Vue, Component } from "vue-property-decorator";
import { axios } from "@/plugins/axios";
@Component({
  components: {
    draggable
  }
})
export default class extends Vue {
  get total() {
    return Object.keys(this.config).length;
  }

  get title() {
    return Object.keys(this.config)[this.index];
  }

  get cloneOtions() {
    return [...this.config[this.title]];
  }

  get options() {
    return this.config[this.title];
  }

  get curAnswer() {
    return this.answer[this.index];
  }

  get empty() {
    return !this.curAnswer || !this.curAnswer.length;
  }

  get disabled() {
    return !this.curAnswer || this.curAnswer.length < this.options.length;
  }

  get last() {
    return this.index === this.total - 1;
  }
  answer: any[] = [];
  config: any = {};

  loading = true;
  index = 0;

  async onSubmit() {
    if (!this.last) {
      this.index++;
    } else {
      const result: any = {};
      this.answer.forEach(answer => {
        answer.forEach((item: any, i: number) => {
          if (!result.hasOwnProperty(item.type)) {
            result[item.type] = 0;
          }
          result[item.type] += answer.length - i;
        });
      });
      await axios.post("/api/complete", {
        name: this.$route.query.name,
        ...result
      });
      this.$router.push({
        path: "/result",
        query: result
      });
    }
  }

  async created() {
    try {
      const { data } = await axios.get("/api/question", {
        params: this.$route.query
      });
      this.config = data;
      for (let i = 0; i < this.total; i++) {
        this.answer.push([]);
      }
      this.loading = false;
    } catch (e) {
      await this.$alert("请重新扫描二维码", "信息请求失败");
      this.$router.back();
    }
  }

  mounted() {}
}
</script>
<style lang="scss" scoped>
.placeholder {
  display: block;
  text-align: center;
  color: #bcbcbc;
  position: absolute;
  top: 50%;
  width: 100%;
  transform: translateY(-50%);
}
.option {
  list-style: none;
  padding: 0;
  li {
    padding: 12px;
    border: 1px solid #efefef;
    background: #fff;
  }
  li + li {
    border-top: 0;
  }
}
.answer {
  flex: 1;
  min-height: 300px;

  position: relative;
  background-color: #f7f7f7;
  margin-right: 20px;
  &.empty::after {
    content: "将下方标签拖入此区域";
    color: #bcbcbc;
    position: absolute;
    width: 100%;
    top: 50%;
    transform: translateY(-50%);
    text-align: center;
  }
}
.flip-list-move {
  transition: transform 0.5s;
}
</style>