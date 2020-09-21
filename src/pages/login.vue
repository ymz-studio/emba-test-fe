<template>
  <div>
    <h1>学习风格测试</h1>
    <el-card>
      <el-form :model="form">
        <el-form-item label="Username" prop="username">
          <el-input v-model="form.username" placeholder="请输入您的用户名"></el-input>
        </el-form-item>
        <el-form-item label="Password" prop="password">
          <el-input type="password" v-model="form.password" placeholder="请输入您密码"></el-input>
        </el-form-item>
        <el-button type="primary" class="submit" @click="onSubmit" :disabled="submitDisabled">Log In</el-button>
      </el-form>
    </el-card>
  </div>
</template>
<script lang="ts">
import { Vue, Component } from "vue-property-decorator";
import { axios } from "@/plugins/axios";
@Component({
  layout: "empty"
})
export default class extends Vue {
  form = {
    username: "",
    password: ""
  };

  loading = 0;

  get submitDisabled() {
    return !this.form.username || !this.form.password;
  }

  async onSubmit() {
    this.loading++;
    try {
      await axios.post("/api/auth", this.form);
      this.$router.replace("/admin");
    } catch (error) {
      this.$alert("用户名或密码错误", "登录失败");
    } finally {
      this.loading--;
    }
  }
}
</script>
<style lang="scss" scoped>
.el-card {
  max-width: 460px;
  margin: 0 auto;
}
.submit {
  width: 100%;
  height: 50px;
}
h1 {
  text-align: center;
  color: #fff;
  font-weight: 400;
}
</style>