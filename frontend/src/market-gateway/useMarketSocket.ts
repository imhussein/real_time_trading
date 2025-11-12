import { useEffect, useRef } from "react";
import { io, Socket } from "socket.io-client";
import { config } from "../config/config";
import { useAppDispatch, useAppSelector } from "../hooks/appHooks";
import { updatePrices } from "../store/reducers/marketSlice";

export function useMarketSocket() {
  const dispatch = useAppDispatch();
  const { selected } = useAppSelector((s) => s.market);
  const socketRef = useRef<Socket | null>(null);

  useEffect(() => {
    if (!socketRef.current) {
      const socket = io(config.socketURL, {
        transports: ["websocket"],
        reconnection: true,
      });
      socketRef.current = socket;

      socket.on("connect", () => {
        console.log("WS connected:", socket.id);
      });

      socket.on("disconnect", () => console.warn("WS disconnected"));

      socket.on("price.update", (payload) => {
        dispatch(updatePrices(payload));
      });

      socket.on("price.snapshot", (snapshot) => {
        dispatch(updatePrices(snapshot));
      });
    }

    const socket = socketRef.current;
    if (socket && selected) {
      socket.emit("subscribe", { symbols: [selected] });
      console.log("subscribed to", selected);
    }

    return () => {
      if (socket && selected) {
        socket.emit("unsubscribe", { symbols: [selected] });
        console.log("unsubscribed from", selected);
      }
    };
  }, [selected, dispatch]);
}
