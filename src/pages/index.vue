<template>
  <div class="container">
    <h3>欢迎进入</h3>
    <h2>学习风格测试</h2>
    <p>
      本测试共有
      <strong>12</strong>
      个问题
    </p>
    <p>
      请
      <strong>拖拽</strong> 每个问题下的
      <strong>4</strong> 个选项, 按照最像你至最不像你的顺序进行排序
    </p>
    <p>
      请完善您的信息
      <el-select class="input" v-model="group" placeholder="请选择你的组别">
        <el-option v-for="item in 8" :key="item" :value="item" :label="`第 ${item} 组`"></el-option>
      </el-select>
      <el-input class="input" v-model="name" placeholder="请输入你的姓名"></el-input>
    </p>
    <p class="tip">
      <i>*</i> 港科大EMBA中英双语课程办公室不对外透露您的信息资料，请放心作答
    </p>
    <el-button type="primary" class="submit" @click="onSubmit" :disabled="!name || !group">进入测试</el-button>
  </div>
</template>
<script lang="ts">
import { Vue, Component } from "vue-property-decorator";
@Component
export default class extends Vue {
  name: string = "";
  group: string = "";

  async onSubmit() {
    this.$router.push({
      name: "question",
      query: {
        name: this.name,
        group: this.group,
        token: this.$route.query.token
      }
    });
  }
}
</script>
<style lang="scss" scoped>
strong {
  color: #e6a23c;
}

h2 {
  color: #409eff;
  text-align: center;
  margin-top: 20px;
}

p + p {
  margin-top: 0;
}

.input {
  margin-top: 10px;
  display: block;
}
.tip {
  margin-top: 20px;
  font-size: 14px;
  i {
    color: red;
  }
}
</style>