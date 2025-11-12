import axiosClient from "./axiosClient";

export const authApi = {
  login: () =>
    axiosClient.post("/auth/login", {
      username: "root",
      password: "123456",
    }),
};
