<template>
  <div class="container">
    <h3>信息完善</h3>
    <el-input v-model="name" placeholder="请输入你的姓名"></el-input>
    <el-button type="primary" class="submit" @click="onSubmit" :disabled="!name">进入答题</el-button>
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
</style>