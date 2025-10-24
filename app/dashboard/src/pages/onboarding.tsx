import { Sidebar } from '../components/Sidebar';
import { Navbar } from '../components/Navbar';

const OnboardingPage = () => (
  <div>
    <Sidebar />
    <Navbar title="Onboarding" />
    <main style={{ marginLeft: 220, padding: 24, display: 'grid', gap: 16 }}>
      <section style={{ background: '#fff', padding: 24, borderRadius: 12 }}>
        <h3>Business Intake</h3>
        <ol>
          <li>Provide website URL</li>
          <li>Upload FAQs and policies</li>
          <li>Connect CRM/POS integrations</li>
          <li>Configure tone and call-to-action</li>
        </ol>
      </section>
      <section style={{ background: '#fff', padding: 24, borderRadius: 12 }}>
        <h3>Automation Checklist</h3>
        <ul>
          <li>Website scraping scheduled</li>
          <li>Document ingestion queued</li>
          <li>Initial prompt seeded</li>
          <li>Widget embedded</li>
        </ul>
      </section>
    </main>
  </div>
);

export default OnboardingPage;
