interface ChartProps {
  title: string;
  value: number;
  delta: number;
}

export const Chart = ({ title, value, delta }: ChartProps) => (
  <div style={{ background: '#fff', padding: 16, borderRadius: 12, minWidth: 220 }}>
    <h3>{title}</h3>
    <p style={{ fontSize: 32, margin: '12px 0' }}>{value.toLocaleString()}</p>
    <p style={{ color: delta >= 0 ? '#16a34a' : '#dc2626' }}>{delta >= 0 ? '+' : ''}{delta}%</p>
  </div>
);
