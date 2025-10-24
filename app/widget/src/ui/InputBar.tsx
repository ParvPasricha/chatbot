import { FormEvent, useState } from 'react';

interface InputBarProps {
  onSend: (message: string) => Promise<void>;
  disabled?: boolean;
}

export const InputBar = ({ onSend, disabled }: InputBarProps) => {
  const [value, setValue] = useState('');

  const handleSubmit = async (event: FormEvent) => {
    event.preventDefault();
    if (!value.trim()) return;
    await onSend(value);
    setValue('');
  };

  return (
    <form onSubmit={handleSubmit} style={{ display: 'flex', borderTop: '1px solid #e5e7eb' }}>
      <input
        value={value}
        onChange={(event) => setValue(event.target.value)}
        placeholder="Ask anything..."
        style={{ flex: 1, border: 'none', padding: 12 }}
        disabled={disabled}
      />
      <button type="submit" disabled={disabled || !value.trim()} style={{ border: 'none', padding: '0 18px', background: '#2563eb', color: '#fff' }}>
        Send
      </button>
    </form>
  );
};
