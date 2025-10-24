interface WidgetPreviewProps {
  tenantName: string;
  sampleMessage: string;
}

export const WidgetPreview = ({ tenantName, sampleMessage }: WidgetPreviewProps) => (
  <div style={{ background: '#111827', color: '#fff', borderRadius: 16, padding: 20, maxWidth: 320 }}>
    <p style={{ fontWeight: 600 }}>{tenantName}</p>
    <div style={{ background: '#1f2937', padding: 12, borderRadius: 12, marginTop: 12 }}>
      <p style={{ margin: 0 }}>{sampleMessage}</p>
    </div>
  </div>
);
