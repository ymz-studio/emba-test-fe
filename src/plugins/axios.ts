import Axios, { AxiosResponse } from "axios";
import { MessageBox } from "element-ui";
import router from "@/router";
export const axios = Axios.create();

axios.interceptors.response.use(undefined, async err => {
  const response = err.response as AxiosResponse;
  if (response.status === 403) {
    router.push("/login");
    await MessageBox.alert("您的登录状态已失效, 请重新登录");
  } else if (response.status === 401) {
    await MessageBox.alert("测试还未开始, 请重试");
  }

  return Promise.reject(err);
});
