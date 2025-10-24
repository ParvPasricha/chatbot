import { Sidebar } from '../components/Sidebar';
import { Navbar } from '../components/Navbar';

const metrics = [
  { name: 'Average Response Time', value: '1.4s' },
  { name: 'Containment Rate', value: '73%' },
  { name: 'Lead Conversions', value: '128' },
  { name: 'Escalations', value: '14' },
];

const AnalyticsPage = () => (
  <div>
    <Sidebar />
    <Navbar title="Analytics" />
    <main style={{ marginLeft: 220, padding: 24, display: 'grid', gap: 16 }}>
      {metrics.map((metric) => (
        <div key={metric.name} style={{ background: '#fff', padding: 24, borderRadius: 12 }}>
          <h3>{metric.name}</h3>
          <p style={{ fontSize: 28, margin: '12px 0' }}>{metric.value}</p>
        </div>
      ))}
    </main>
  </div>
);

export default AnalyticsPage;
