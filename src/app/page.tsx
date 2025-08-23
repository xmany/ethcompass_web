import Header from '@/components/Header';
import DataDashboard from '@/components/dashboard/DataDashboard';
import UnifiedFeed from '@/components/feed/UnifiedFeed';
import TreasuryTable from '@/components/treasury/TreasuryTable';
import InfluencerFeed from '@/components/influencer/InfluencerFeed';

export default function Home() {
  return (
    <div className="min-h-screen">
      <Header />
      
      <main className="max-w-7xl mx-auto p-4 lg:p-6">
        <div className="flex flex-col lg:grid lg:grid-cols-3 lg:gap-8">
          
          {/* Main content column (order-2 on mobile, order-1 on desktop) */}
          <div className="lg:col-span-2 order-2 lg:order-1">
            {/* Unified Feed Section */}
            <UnifiedFeed />
            
            {/* Influencers Section */}
            <InfluencerFeed />
          </div>
          
          {/* Sidebar column (order-1 on mobile, order-2 on desktop) */}
          <div className="lg:col-span-1 space-y-8 order-1 lg:order-2">
            {/* Data Dashboard Section */}
            <DataDashboard />
            
            {/* Treasury Tracking Section */}
            <TreasuryTable />
          </div>
        </div>
      </main>
    </div>
  );
}
