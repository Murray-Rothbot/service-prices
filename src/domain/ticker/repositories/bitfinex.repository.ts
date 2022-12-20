import { HttpService } from '@nestjs/axios'
import { AxiosResponse } from 'axios'
import { Injectable } from '@nestjs/common'
import { catchError, lastValueFrom, map } from 'rxjs'
import { TickerRequestDto, TickerResponseDto } from '../dto'
import { IBitfinexTicker } from '../interfaces'
import { ITickerRepository } from '../interfaces/ticker-repository.interface'

@Injectable()
export class BitfinexRepository implements ITickerRepository {
  source = 'Bitfinex'
  baseUrl = 'https://api-pub.bitfinex.com/v2'

  tickers = {
    BTCUSD: 'tBTCUSD',
  }

  constructor(private readonly httpService: HttpService) {}

  getTicker({ symbol }: TickerRequestDto): Promise<TickerResponseDto> {
    const ticker = this.tickers[symbol.toUpperCase()] || symbol
    const url = `${this.baseUrl}/ticker/${ticker}`

    return lastValueFrom(
      this.httpService.get(url).pipe(
        map((response: AxiosResponse<IBitfinexTicker>): TickerResponseDto => {
          const price = `${response.data[9].toFixed(2)}`
          const change24h = `${(response.data[5] * 100).toFixed(2)}`
          return { price, symbol, source: this.source, change24h }
        }),
        catchError(async () => {
          return null
        }),
      ),
    )
  }
}
