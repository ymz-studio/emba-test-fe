<template>
  <div class="container" v-loading.fullscreen="loading">
    <template v-if="!loading">
      <h3>{{title}} ({{index + 1}}/{{total}})</h3>
      <p class="tip success">
        <i class="el-icon-top"></i>最像我
      </p>
      <el-row type="flex">
        <draggable :animation="200" :list="curAnswer" tag="ul" class="option answer">
          <li v-for="item in curAnswer" :key="item.label">
            <span>{{item.label}}</span>
            <img height="20" src="@/assets/drag.svg" />
          </li>
        </draggable>
      </el-row>
      <p class="tip danger">
        <i class="el-icon-bottom"></i>最不像我
      </p>
      <el-button class="submit" plain :disabled="first" @click="index--">上一题</el-button>
      <el-button type="primary" @click="onSubmit">{{last ? '完成测试': '下一题'}}</el-button>
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

  get last() {
    return this.index === this.total - 1;
  }
  get first() {
    return this.index === 0;
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
      await axios.post(
        "/api/complete",
        {
          name: this.$route.query.name,
          group: this.$route.query.group,
          ...result
        },
        {
          params: {
            token: this.$route.query.token
          }
        }
      );
      this.$router.push({
        path: "/result",
        query: {
          ...result,
          name: this.$route.query.name
        }
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
        this.answer.push(this.config[Object.keys(this.config)[i]]);
      }
      this.loading = false;
    } catch (e) {
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
  margin: 5px 0;
  li {
    padding: 12px;
    border: 1px solid #efefef;
    background: #fff;
    display: flex;
    span {
      flex: 1;
    }
    align-items: center;
  }
  li + li {
    border-top: 0;
  }
}
.answer {
  flex: 1;
}
.flip-list-move {
  transition: transform 0.5s;
}
.tip {
  margin: 0;
  text-align: center;
  font-size: 12px;
  &.success {
    color: #67c23a;
  }
  &.danger {
    color: #f56c6c;
    margin-bottom: 20px;
  }
}
.el-button {
  margin-left: 0;
  margin-right: 0;
  & + & {
    margin-top: 16px;
  }
}
</style>