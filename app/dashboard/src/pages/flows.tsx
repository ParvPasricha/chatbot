import { Sidebar } from '../components/Sidebar';
import { Navbar } from '../components/Navbar';

const flows = [
  { name: 'Booking Flow', status: 'Active', steps: 5 },
  { name: 'Refund Escalation', status: 'Requires review', steps: 3 },
  { name: 'Lead Qualification', status: 'Active', steps: 4 },
];

const FlowsPage = () => (
  <div>
    <Sidebar />
    <Navbar title="Conversation Flows" />
    <main style={{ marginLeft: 220, padding: 24, display: 'grid', gap: 16 }}>
      {flows.map((flow) => (
        <div key={flow.name} style={{ background: '#fff', padding: 24, borderRadius: 12 }}>
          <h3>{flow.name}</h3>
          <p>Status: {flow.status}</p>
          <p>Steps: {flow.steps}</p>
        </div>
      ))}
    </main>
  </div>
);

export default FlowsPage;
