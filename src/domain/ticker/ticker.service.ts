import { Injectable } from '@nestjs/common'
import { TickerRequestDto, TickerResponseDto } from './dto'
import { TickersResponseDto } from './dto/tickers-response.dto'
import { ITickerRepository } from './interfaces/ticker-repository.interface'

import { BinanceRepository } from './repositories'
import { BitfinexRepository } from './repositories'
import { BitgetRepository } from './repositories'
import { BitstampRepository } from './repositories'
import { CoinbaseRepository } from './repositories'
import { GateIORepository } from './repositories'
import { KrakenRepository } from './repositories'
import { KuCoinRepository } from './repositories'
import { MercadoBitcoinRepository } from './repositories'
import { OKXRepository } from './repositories'

@Injectable()
export class TickerService {
  repositories: Array<ITickerRepository>

  constructor(
    private readonly binanceRepository: BinanceRepository,
    private readonly bitfinexRepository: BitfinexRepository,
    private readonly bitgetRepository: BitgetRepository,
    private readonly bitstampRepository: BitstampRepository,
    private readonly coinbaseRepository: CoinbaseRepository,
    private readonly gateioRepository: GateIORepository,
    private readonly krakenRepository: KrakenRepository,
    private readonly kucoinRepository: KuCoinRepository,
    private readonly mercadoBitcoinRepository: MercadoBitcoinRepository,
    private readonly okxRepository: OKXRepository,
  ) {
    this.repositories = [
      this.binanceRepository,

      this.bitfinexRepository, // No BRL data
      this.bitstampRepository, // No BRL data
      this.gateioRepository, // No BRL data
      this.okxRepository, // No BRL data

      this.coinbaseRepository, // No 24 change data
      this.kucoinRepository, // No 24 change data
      this.bitgetRepository, // No 24 change data

      this.krakenRepository, // No BRL data, no 24 change data
      this.mercadoBitcoinRepository, // No USD data, no 24 change data
    ]
  }

  async getTicker(params: TickerRequestDto): Promise<TickerResponseDto> {
    for (let repository of this.repositories) {
      try {
        const data = await repository.getTicker(params)
        if (data) return data
      } catch {}
    }

    throw new Error()
  }

  async getTickers(params: TickerRequestDto): Promise<TickersResponseDto> {
    const promises = this.repositories.map(
      async (repository: ITickerRepository): Promise<TickerResponseDto> => {
        return await repository.getTicker(params)
      },
    )

    const tickers = (await Promise.all(promises)).filter((ticker) => ticker != null)

    return { tickers }
  }
}
