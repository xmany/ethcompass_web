export interface CandlestickData {
  x: number;
  o: number;
  h: number;
  l: number;
  c: number;
  v: number;
}

export const generateCandlestickData = (count: number = 30): CandlestickData[] => {
  const date = new Date();
  date.setDate(date.getDate() - count);
  const data: CandlestickData[] = [];
  let price = 3000;
  
  for (let i = 0; i < count; i++) {
    date.setDate(date.getDate() + 1);
    const open = price + (Math.random() - 0.5) * 100;
    const close = open + (Math.random() - 0.5) * 150;
    const high = Math.max(open, close) + Math.random() * 50;
    const low = Math.min(open, close) - Math.random() * 50;
    price = close;
    data.push({ 
      x: date.getTime(), 
      o: open, 
      h: high, 
      l: low, 
      c: close, 
      v: Math.random() * 10000000 
    });
  }
  return data;
};

export const generateLineData = (count: number, startValue: number, volatility: number): number[] => {
  const data: number[] = [];
  let value = startValue;
  
  for (let i = 0; i < count; i++) {
    data.push(value);
    value += (Math.random() - 0.5) * volatility;
  }
  return data;
};

export const generateBarData = (count: number, max: number): number[] => {
  const data: number[] = [];
  for (let i = 0; i < count; i++) {
    data.push(Math.random() * max - max / 2);
  }
  return data;
};

export const generateTimeLabels = (count: number): string[] => {
  const labels: string[] = [];
  const date = new Date();
  date.setDate(1);
  date.setMonth(date.getMonth() - count + 1);
  
  for (let i = 0; i < count; i++) {
    labels.push(date.toLocaleString('default', { month: 'short', year: '2-digit' }));
    date.setMonth(date.getMonth() + 1);
  }
  return labels;
};

export const generateDailyLabels = (count: number): string[] => {
  const labels: string[] = [];
  const date = new Date();
  
  for (let i = count - 1; i >= 0; i--) {
    const d = new Date(date);
    d.setDate(d.getDate() - i);
    labels.push(d.toLocaleDateString('zh-CN', { month: 'numeric', day: 'numeric' }));
  }
  return labels;
};

// Treasury company mock data
export interface TreasuryCompany {
  name: string;
  ticker: string;
  ethHoldings: number;
  valueUSD: string;
  stockPrice: string;
  marketCap: string;
  mNav: string;
  percentOfSupply: string;
}

export const mockTreasuryCompanies: TreasuryCompany[] = [
  {
    name: "Bitmine Immersion",
    ticker: "MNEE",
    ethHoldings: 1070000,
    valueUSD: "$4.96B",
    stockPrice: "$12.50",
    marketCap: "$1.2B",
    mNav: "413%",
    percentOfSupply: "0.89%"
  },
  {
    name: "SharpLink Gaming",
    ticker: "SBET",
    ethHoldings: 143593,
    valueUSD: "$667M",
    stockPrice: "$0.88",
    marketCap: "$15M",
    mNav: "4446%",
    percentOfSupply: "0.12%"
  },
  {
    name: "Metaplanet",
    ticker: "JPX: 3350",
    ethHoldings: 15555,
    valueUSD: "$72M",
    stockPrice: "¥92",
    marketCap: "$60M",
    mNav: "120%",
    percentOfSupply: "0.013%"
  }
];

// ETF mock data
export const mockETFData = {
  dailyFlow: "+$150.3M",
  totalAUM: "$15.2B",
  isPositive: true
};

// Gas fee mock data
export const mockGasData = {
  gwei: 12,
  type: "标准交易"
};

// Burn rate mock data
export const mockBurnData = {
  burned24h: "2,850",
  burned7d: "21,540"
};

// L2 mock data
export const mockL2Data = {
  totalTVL: "$25.5B",
  dailyFees: "$1.2M",
  distribution: [
    { name: "Arbitrum", value: 45, color: "#2D8EFF" },
    { name: "Optimism", value: 25, color: "#FF0420" },
    { name: "Base", value: 15, color: "#0052FF" },
    { name: "Others", value: 15, color: "#4B5563" }
  ]
};

// Exchange balance mock data
export const mockExchangeData = {
  totalBalance: "12.8M ETH",
  netFlow7d: "-50,430 ETH",
  isOutflow: true
};

// Staking mock data
export const mockStakingData = {
  totalStaked: "31.8M ETH",
  stakingRatio: "26.5%",
  apr: "3.45%"
};

// Market cap distribution
export const mockMarketCapData = [
  { name: "Ethereum", value: 18.5, color: "#6366F1" },
  { name: "Bitcoin", value: 45.2, color: "#F59E0B" },
  { name: "Others", value: 36.3, color: "#4B5563" }
];

// Stablecoin distribution
export const mockStablecoinData = [
  { name: "Ethereum Based", value: 52, color: "#6366F1" },
  { name: "Other Networks", value: 48, color: "#4B5563" }
];
