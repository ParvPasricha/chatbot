import { Sidebar } from '../components/Sidebar';
import { Navbar } from '../components/Navbar';

const SettingsPage = () => (
  <div>
    <Sidebar />
    <Navbar title="Settings" />
    <main style={{ marginLeft: 220, padding: 24, display: 'grid', gap: 16 }}>
      <section style={{ background: '#fff', padding: 24, borderRadius: 12 }}>
        <h3>Brand Voice</h3>
        <p>Configure tone, emoji usage, and handoff policies for the assistant.</p>
      </section>
      <section style={{ background: '#fff', padding: 24, borderRadius: 12 }}>
        <h3>Integrations</h3>
        <p>Manage CRM, POS, and messaging channels. Toggle auto-refresh for data ingestion.</p>
      </section>
    </main>
  </div>
);

export default SettingsPage;
