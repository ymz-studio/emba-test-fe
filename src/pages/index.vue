<template>
  <div class="container">
    <h3>测试说明</h3>
    <p>本测试共有 <strong>12</strong> 个问题, 你需要根据标签与你的 <strong>相似程度</strong> 进行排序</p>
    <img src="@/assets/sort.svg">
    <p><strong>拖拽</strong> 标签即可进行排序, 请在下面输入你的姓名进入测试</p>
    <el-input v-model="name" placeholder="请输入你的姓名"></el-input>
    <el-button type="primary" class="submit" @click="onSubmit" :disabled="!name">进入测试</el-button>
  </div>
</template>
<script lang="ts">
import { Vue, Component } from "vue-property-decorator";
@Component
export default class extends Vue {
  name: string = "";
  async onSubmit() {
    this.$router.push({
      name: "question",
      query: {
        name: this.name,
        token: this.$route.query.token
      }
    });
  }
}
</script>
<style lang="scss" scoped>
strong {
  color: #E6A23C;
}
</style>