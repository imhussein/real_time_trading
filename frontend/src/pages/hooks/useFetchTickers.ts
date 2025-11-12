import { useQuery } from "@tanstack/react-query";
import { useEffect } from "react";
import { useAppDispatch } from "../../hooks/appHooks";
import { marketApi } from "../../http/marketApi";
import { setTickers } from "../../store/reducers/marketSlice";

export function useFetchTickers() {
  const dispatch = useAppDispatch();

  const { data, isLoading, error } = useQuery({
    queryKey: ["tickers"],
    queryFn: marketApi.getTickers,
  });

  useEffect(() => {
    if (data) dispatch(setTickers(data));
  }, [data, dispatch]);

  return { data, isLoading, error };
}
