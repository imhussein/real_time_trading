export type SymbolCode = string;

export class Ticker {
  constructor(
    public readonly symbol: SymbolCode,
    public price: number,
    public ts: number,
  ) {}
}
