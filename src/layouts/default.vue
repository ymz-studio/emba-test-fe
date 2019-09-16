<template>
  <div class="content">
    <el-card class="card">
      <router-view />
    </el-card>
  </div>
</template>
<style lang="scss" scoped>
.content {
  box-sizing: border-box;
  display: flex;
  flex-direction: column;
}
.card {
  flex: 1;
  display: flex;
  flex-direction: column;
  box-shadow: none;
  border: none;
}
.card /deep/ .el-card__body {
  flex: 1;
  display: flex;
  flex-direction: column;
}
.card /deep/ .container {
  flex: 1;
  display: flex;
  flex-direction: column;
}
</style>