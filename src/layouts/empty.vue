<template>
  <div class="body">
    <h1>EMBA TEST</h1>
    <router-view></router-view>
  </div>
</template>
<style lang="scss" scoped>
.body {
  background: linear-gradient(90deg, #3250c7, #1e38a3);
  height: 100vh;
  overflow: hidden;
  padding: 20px;
  box-sizing: border-box;
}
h1 {
  color: #fff;
  font-weight: 300;
  text-align: center;
  margin: 60px 0;
}
</style>
