import { Test, TestingModule } from '@nestjs/testing'
import { INestApplication } from '@nestjs/common'
import * as request from 'supertest'
import { TickerModule } from './../src/domain/ticker/ticker.module'

describe('TickerController (e2e)', () => {
  let app: INestApplication

  beforeEach(async () => {
    const moduleFixture: TestingModule = await Test.createTestingModule({
      imports: [TickerModule],
    }).compile()

    app = moduleFixture.createNestApplication()
    await app.init()
  })

  for (let test_symbol of ['BTCBRL', 'BTCUSDT']) {
    it(`ticker?symbol=${test_symbol} (GET)`, () => {
      return request(app.getHttpServer())
        .get(`/ticker?symbol=${test_symbol}`)
        .expect(200)
        .expect((res) => {
          let data = res.body

          if (data.symbol != test_symbol)
            throw Error(`got ${data.symbol} instead of ${test_symbol}`)
        })
    })
  }

  it('ticker?symbol=INVALID (GET)', () => {
    return request(app.getHttpServer()).get('/ticker?symbol=INVALID').expect(500)
  })
})
