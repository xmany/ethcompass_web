import Header from '@/components/Header';
import TreasuryTable from '@/components/treasury/TreasuryTable';

// Chart components
import {
  PriceVolumeChart,
  TotalSupplyChart,
  EthBtcRatioChart,
  StakingData,
  MarketCapCharts,
  StablecoinCharts
} from '@/components/charts';

// Stats components
import {
  ETFDisplay,
  GasFeeDisplay,
  BurnRateDisplay,
  L2Snapshot,
  ExchangeBalances
} from '@/components/stats';

export default function Home() {
  return (
    <div className="min-h-screen">
      <Header />
      
      <main className="max-w-7xl mx-auto p-4 lg:p-6">
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          
          {/* Main Column */}
          <div className="lg:col-span-2 space-y-6">
            {/* 1. Price & Volume */}
            <PriceVolumeChart />
            
            {/* 3. Total Supply & Market Cap */}
            <TotalSupplyChart />
            
            {/* 4. ETH/BTC Ratios */}
            <EthBtcRatioChart />
            
            {/* 6. Staking Data */}
            <StakingData />
            
            {/* 2. Market Cap */}
            <MarketCapCharts />
            
            {/* 8. Stablecoin Data */}
            <StablecoinCharts />
            
            {/* ETF Section */}
            <ETFDisplay />
            
            {/* 9. Treasury Companies */}
            <TreasuryTable />
          </div>
          
          {/* Sidebar Column */}
          <div className="lg:col-span-1 space-y-6">
            {/* 5. Gas Fee */}
            <GasFeeDisplay />
            
            {/* 7. ETH Burn Rate */}
            <BurnRateDisplay />
            
            {/* L2 Snapshot */}
            <L2Snapshot />
            
            {/* Exchange Balances */}
            <ExchangeBalances />
          </div>
        </div>
      </main>
    </div>
  );
}
