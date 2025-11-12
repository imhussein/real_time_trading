import { IsNumberString, IsOptional } from 'class-validator';

export class HistoricalQueryDto {
  @IsOptional() @IsNumberString() limit?: number = 200;
}

export class HistoricalResponseDto {
  symbol!: string;
  data!: {
    ts: number;
    open: number;
    high: number;
    low: number;
    close: number;
  }[];
}
