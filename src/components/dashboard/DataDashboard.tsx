import DataCard from './DataCard';

export default function DataDashboard() {
  return (
    <section id="data-dashboard">
      <h2 className="text-lg font-semibold mb-3" style={{ color: 'var(--text-title)' }}>关键数据看板</h2>
      <div className="grid grid-cols-2 gap-3">
        <DataCard
          label="ETH/USD 价格"
          value="$4,642.23"
          change="+10.04%"
          changeColor="green"
        />
        <DataCard
          label="ETH/BTC 汇率"
          value="0.040"
          change="-1.2%"
          changeColor="red"
        />
        <DataCard
          label="24小时交易量"
          value="$53.66B"
          suffix="占总额 26.73%"
        />
        <DataCard
          label="主网 Gas 费"
          value="12"
          suffix="Gwei"
        />
      </div>
    </section>
  );
}
