import { useState } from 'react';
import axios from 'axios';
import { toast } from 'react-toastify';

interface Template {
  id: string;
  name: string;
  subject: string;
  body: string;
}

const templates: Template[] = [
  {
    id: 'welcome',
    name: 'Welcome Client',
    subject: 'Welcome to Our Service',
    body: `<p>Hi {{name}},</p><p>Welcome to our service. We are excited to work with you.</p><p>Regards,<br/>Team</p>`,
  },
  {
    id: 'invoice',
    name: 'Invoice Notification',
    subject: 'Invoice for Your Recent Service',
    body: `<p>Hi {{name}},</p><p>Please find attached the invoice for the recent service. Amount: {{amount}}</p><p>Regards,<br/>Accounting</p>`,
  },
  {
    id: 'followup',
    name: 'Follow Up',
    subject: 'Quick Follow Up',
    body: `<p>Hi {{name}},</p><p>Just following up on our previous conversation. Let me know if you have any questions.</p><p>Thanks,<br/>Team</p>`,
  },
];

const EmailTemplatePanel = () => {
  const [selectedId, setSelectedId] = useState<string>(templates[0].id);
  const [to, setTo] = useState('');
  const [subject, setSubject] = useState(templates[0].subject);
  const [body, setBody] = useState(templates[0].body);
  const [sending, setSending] = useState(false);

  const handleSelect = (id: string) => {
    const t = templates.find((x) => x.id === id)!;
    setSelectedId(id);
    setSubject(t.subject);
    setBody(t.body);
  };

  const handleSend = async () => {
    if (!to) return toast.error('Please provide recipient email');
    setSending(true);
    try {
      await axios.post('/email/send', {
        to,
        subject,
        html: body,
      });
      toast.success('Email sent successfully');
      setTo('');
    } catch (err: any) {
      const msg = err?.response?.data?.message || err.message || 'Failed to send email';
      toast.error(msg);
    } finally {
      setSending(false);
    }
  };

  return (
    <div className="bg-white rounded-lg shadow-md p-6 mt-6">
      <h2 className="text-xl font-semibold text-gray-800 mb-4">Email Templates</h2>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        <div>
          <h3 className="font-medium mb-2">Templates</h3>
          <div className="space-y-2">
            {templates.map((t) => (
              <label key={t.id} className="flex items-center space-x-2">
                <input
                  type="radio"
                  name="template"
                  checked={selectedId === t.id}
                  onChange={() => handleSelect(t.id)}
                />
                <span>{t.name}</span>
              </label>
            ))}
          </div>
        </div>

        <div className="md:col-span-2">
          <div className="mb-3">
            <label className="block text-sm font-medium text-gray-700">To</label>
            <input
              type="email"
              value={to}
              onChange={(e) => setTo(e.target.value)}
              className="mt-1 block w-full border rounded-md px-3 py-2"
              placeholder="recipient@example.com"
            />
          </div>

          <div className="mb-3">
            <label className="block text-sm font-medium text-gray-700">Subject</label>
            <input
              type="text"
              value={subject}
              onChange={(e) => setSubject(e.target.value)}
              className="mt-1 block w-full border rounded-md px-3 py-2"
            />
          </div>

          <div className="mb-3">
            <label className="block text-sm font-medium text-gray-700">Body (HTML)</label>
            <textarea
              value={body}
              onChange={(e) => setBody(e.target.value)}
              className="mt-1 block w-full border rounded-md px-3 py-2 h-40"
            />
          </div>

          <div className="flex justify-end">
            <button
              onClick={handleSend}
              disabled={sending}
              className="px-4 py-2 bg-blue-700 text-white rounded-md hover:bg-blue-800 disabled:opacity-60"
            >
              {sending ? 'Sending...' : 'Send Email'}
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default EmailTemplatePanel;
