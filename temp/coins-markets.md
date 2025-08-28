```bash
curl --request GET \
     --url 'https://api.coingecko.com/api/v3/coins/markets?vs_currency=usd&ids=bitcoin%2Cethereum&names=Bitcoin%2CEthereum&symbols=btc%2Ceth&include_tokens=top' \
     --header 'accept: application/json' \
     --header 'x-cg-demo-api-key: CG-wUqAGq2SzqznuCmKkaMqHP7J'
```

```json
[
  {
    "id": "bitcoin",
    "symbol": "btc",
    "name": "Bitcoin",
    "image": "https://coin-images.coingecko.com/coins/images/1/large/bitcoin.png?1696501400",
    "current_price": 112972,
    "market_cap": 2250556070397,
    "market_cap_rank": 1,
    "fully_diluted_valuation": 2250558895932,
    "total_volume": 37860787640,
    "high_24h": 113329,
    "low_24h": 110975,
    "price_change_24h": 1881.79,
    "price_change_percentage_24h": 1.69393,
    "market_cap_change_24h": 39118653954,
    "market_cap_change_percentage_24h": 1.76892,
    "circulating_supply": 19912650,
    "total_supply": 19912675,
    "max_supply": 21000000,
    "ath": 124128,
    "ath_change_percentage": -9.08253,
    "ath_date": "2025-08-14T00:37:02.582Z",
    "atl": 67.81,
    "atl_change_percentage": 166329.3496,
    "atl_date": "2013-07-06T00:00:00.000Z",
    "roi": null,
    "last_updated": "2025-08-28T10:19:12.432Z"
  },
  {
    "id": "ethereum",
    "symbol": "eth",
    "name": "Ethereum",
    "image": "https://coin-images.coingecko.com/coins/images/279/large/ethereum.png?1696501628",
    "current_price": 4594.03,
    "market_cap": 555017507225,
    "market_cap_rank": 2,
    "fully_diluted_valuation": 555017507225,
    "total_volume": 33357390983,
    "high_24h": 4657.28,
    "low_24h": 4473,
    "price_change_24h": -13.679895113571547,
    "price_change_percentage_24h": -0.29689,
    "market_cap_change_24h": -943617994.0914307,
    "market_cap_change_percentage_24h": -0.16973,
    "circulating_supply": 120706789.038858,
    "total_supply": 120706789.038858,
    "max_supply": null,
    "ath": 4946.05,
    "ath_change_percentage": -7.28147,
    "ath_date": "2025-08-24T19:21:03.333Z",
    "atl": 0.432979,
    "atl_change_percentage": 1059051.82363,
    "atl_date": "2015-10-20T00:00:00.000Z",
    "roi": {
      "times": 53.37245004199035,
      "currency": "btc",
      "percentage": 5337.245004199035
    },
    "last_updated": "2025-08-28T10:19:02.702Z"
  }
]
```