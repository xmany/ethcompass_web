```bash
curl --request GET \
     --url 'https://api.coingecko.com/api/v3/coins/ethereum/market_chart?vs_currency=usd&days=5&interval=daily&precision=2' \
     --header 'accept: application/json' \
     --header 'x-cg-demo-api-key: CG-wUqAGq2SzqznuCmKkaMqHP7J'
```

```json
{
  "prices": [
    [
      1755993600000,
      4773.88
    ],
    [
      1756080000000,
      4778.11
    ],
    [
      1756166400000,
      4381.63
    ],
    [
      1756252800000,
      4602.37
    ],
    [
      1756339200000,
      4500.15
    ],
    [
      1756375706000,
      4592.82
    ]
  ],
  "market_caps": [
    [
      1755993600000,
      576242312916.0488
    ],
    [
      1756080000000,
      577227233251.8729
    ],
    [
      1756166400000,
      529509245849.7141
    ],
    [
      1756252800000,
      555061696726.733
    ],
    [
      1756339200000,
      543608856125.4653
    ],
    [
      1756375706000,
      553274432791.947
    ]
  ],
  "total_volumes": [
    [
      1755993600000,
      27814037595.094646
    ],
    [
      1756080000000,
      41157770217.98017
    ],
    [
      1756166400000,
      48217069690.885376
    ],
    [
      1756252800000,
      35263906282.176544
    ],
    [
      1756339200000,
      35898825608.295586
    ],
    [
      1756375706000,
      33243026369.556183
    ]
  ]
}
```

# Notes

- You may leave the interval as empty for automatic granularity:
  - 1 day from current time = 5-minutely data
  - 2 - 90 days from current time = hourly data
  - above 90 days from current time = daily data (00:00 UTC)
- Cache / Update Frequency:
  - Every 30 seconds for all the API plans (for last data point).
  - The last completed UTC day (00:00) data is now available 10 minutes after midnight on the next UTC day (00:10).
- Access to historical data via the Public API (Demo plan) is restricted to the past 365 days only. To access the complete range of historical data, please subscribe to one of our paid plans to obtain a Pro-API key.