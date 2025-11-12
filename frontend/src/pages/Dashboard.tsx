import { useEffect } from "react";
import DashboardLayout from "../components/layouts/DashboardLayout";
import PriceChart from "../components/pages/PriceChart";
import TickerList from "../components/pages/TickerList";
import { useMarketSocket } from "../market-gateway/useMarketSocket";
import { useFetchTickers } from "./hooks/useFetchTickers";

export default function Dashboard() {
  useFetchTickers();
  useMarketSocket(); // This is initlaized here so that we can listen to market price emits from websocket backend

  useEffect(() => {
    document.title = "Trading Dashboard";
  }, []);

  return <DashboardLayout sidebar={<TickerList />} main={<PriceChart />} />;
}
