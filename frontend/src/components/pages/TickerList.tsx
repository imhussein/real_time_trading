import { useAppDispatch, useAppSelector } from "../../hooks/appHooks";
import { selectTicker } from "../../store/reducers/marketSlice";

export default function TickerList() {
  const dispatch = useAppDispatch();
  const { tickers, prices, selected } = useAppSelector((s) => s.market);

  return (
    <div className="w-full sm:w-64 bg-white border-r border-gray-200 p-4 tickers-sidebar">
      <h2 className="text-lg font-semibold mb-4 text-gray-800">Tickers List</h2>
      <ul className="space-y-1">
        {tickers.map((eachTicker) => {
          const active = selected === eachTicker;
          const price = prices[eachTicker]?.price?.toFixed(2) ?? "--";
          return (
            <li
              key={eachTicker}
              onClick={() => dispatch(selectTicker(eachTicker))}
              className={`flex justify-between items-center p-2 rounded-lg cursor-pointer transition 
                ${
                  active
                    ? "bg-blue-600 text-white"
                    : "hover:bg-gray-100 text-gray-800"
                }`}
            >
              <span className="font-medium">{eachTicker}</span>
              <span className="text-sm">{price}</span>
            </li>
          );
        })}
      </ul>
    </div>
  );
}
