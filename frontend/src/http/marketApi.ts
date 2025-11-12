import axiosClient from "./axiosClient";

export const marketApi = {
  getTickers: () =>
    axiosClient
      .get("/tickers")
      .then((r) => r.data)
      .catch((err) => {
        if (err.status === 401) {
          window.location.href = "/login";
        }
      }),
  getPrice: (symbol: string) =>
    axiosClient.get(`/price/${symbol}`).then((r) => r.data),
  getHistorical: (symbol: string, limit = 50) =>
    axiosClient.get(`/historical/${symbol}?limit=${limit}`).then((r) => r.data),
  getAlerts: () => axiosClient.get("/alerts").then((r) => r.data),
};
