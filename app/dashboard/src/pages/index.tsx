import { Sidebar } from '../components/Sidebar';
import { Navbar } from '../components/Navbar';
import { Chart } from '../components/Chart';
import { WidgetPreview } from '../components/WidgetPreview';

const DashboardPage = () => (
  <div>
    <Sidebar />
    <Navbar title="Overview" />
    <main style={{ marginLeft: 220, padding: 24, display: 'flex', flexDirection: 'column', gap: 24 }}>
      <section style={{ display: 'flex', gap: 16 }}>
        <Chart title="Conversations" value={4321} delta={12} />
        <Chart title="Containment" value={78} delta={4} />
        <Chart title="CSAT" value={92} delta={2} />
      </section>
      <section style={{ display: 'flex', gap: 16 }}>
        <WidgetPreview tenantName="Acme Coffee" sampleMessage="Hi Jamie! We're open until 6pm today." />
      </section>
    </main>
  </div>
);

export default DashboardPage;
