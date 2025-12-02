import { useState, useEffect } from 'react';
import emailjs from '@emailjs/browser';
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
        name: 'Our Seo Package',
        subject: 'Our Seo Package',
        body: `<p>Hi {{name}},</p>

<p>Welcome to our SEO Package! We are excited to help you improve your online visibility, boost search rankings, and grow your digital presence. Our team will work closely with you to ensure your website achieves better performance and long-term organic success.</p>

<p>Regards,<br/>Team</p>`,
    },
    {
        id: 'invoice',
        name: 'Our Standard Package',
        subject: 'Our Standard Package',
        body: `<p>Hi {{name}},</p>

<p>Please find attached the invoice for the recent service under our Standard Package. The total payable amount is: {{amount}}. If you have any questions or need clarification, feel free to reach out.</p>

<p>Regards,<br/>Accounting</p>`,
    },
    {
        id: 'followup',
        name: 'Our Advanced Package',
        subject: 'Our Advanced Package',
        body: `<p>Hi {{name}},</p>

<p>Just following up on our previous conversation regarding our Advanced Package. If you have any questions or need more details about the features, benefits, or setup process, feel free to reach out—we’re here to assist you.</p>

<p>Thanks,<br/>Team</p>`,
    },
    {
        id: 'googlevirtualtool',
        name: 'Google Virtual Tool',
        subject: 'Google Virtual Tool',
        body: `<p>Hi {{name}},</p>
<p>Just following up on our previous conversation regarding the Google Virtual Tool. If you have any questions about setup, features, or how to get started, feel free to let us know—we’re here to help.</p>
<p>Thanks,<br/>Team</p>`,
    },
];

interface ServicePackage {
    id: string;
    name: string;
    emailSubject: string;
    emailBody: string;
}

interface EmailTemplatePanelProps {
    selectedClient?: {
        email?: string;
        clientName?: string;
        amount?: number | string;
    } | null;
    lockToFormEmail?: boolean;
    servicePackages?: ServicePackage[];
    selectedPackage?: string;
}

const EmailTemplatePanel = ({ selectedClient, lockToFormEmail, servicePackages, selectedPackage }: EmailTemplatePanelProps) => {
    const [selectedId, setSelectedId] = useState<string>(templates[0].id);
    const [to, setTo] = useState('');
    const [recipientName, setRecipientName] = useState('');
    const [amount, setAmount] = useState('');
    const [subject, setSubject] = useState(templates[0].subject);
    const [body, setBody] = useState(templates[0].body);
    const [sending, setSending] = useState(false);

    // When using service packages and one is selected, use its email content
    useEffect(() => {
        if (lockToFormEmail && servicePackages && selectedPackage) {
            const pkg = servicePackages.find(p => p.name === selectedPackage);
            if (pkg) {
                setSubject(pkg.emailSubject);
                setBody(pkg.emailBody);
            }
        }
    }, [selectedPackage, lockToFormEmail, servicePackages]);

    // Prefill when selectedClient prop changes
    useEffect(() => {
        if (selectedClient) {
            if (selectedClient.email) setTo(selectedClient.email);
            if (selectedClient.clientName) setRecipientName(selectedClient.clientName);
            if (selectedClient.amount) setAmount(String(selectedClient.amount));
        }
    }, [selectedClient]);

    const handleSelect = (id: string) => {
        const t = templates.find((x) => x.id === id)!;
        setSelectedId(id);
        setSubject(t.subject);
        setBody(t.body);
    };

    const handleSend = async () => {
        if (!to) return toast.error('Please provide recipient email');
        setSending(true);

        // EmailJS requires you to set Vite env vars:
        // VITE_EMAILJS_SERVICE_ID, VITE_EMAILJS_TEMPLATE_ID, VITE_EMAILJS_PUBLIC_KEY
        const serviceId = import.meta.env.VITE_EMAILJS_SERVICE_ID;
        const templateId = import.meta.env.VITE_EMAILJS_TEMPLATE_ID;
        const publicKey = import.meta.env.VITE_EMAILJS_PUBLIC_KEY;

        if (!serviceId || !templateId || !publicKey) {
            toast.error('EmailJS not configured. Set VITE_EMAILJS_SERVICE_ID, VITE_EMAILJS_TEMPLATE_ID, VITE_EMAILJS_PUBLIC_KEY');
            setSending(false);
            return;
        }

        try {
            const templateParams = {
                to_email: to,
                subject,
                    message: body,
                    name: recipientName,
                    amount,
                // optional: from_name or other template variables
            };

            const result = await emailjs.send(serviceId, templateId, templateParams, publicKey);
            // result.status === 200 on success
            console.log('EmailJS send result:', result);
            toast.success(`EmailJS sent (status ${result.status})`);
            // show detailed info for debugging
            toast.info(JSON.stringify(result.text || result), { autoClose: 4000 });
            if (!lockToFormEmail) setTo('');
        } catch (err: any) {
            console.error('EmailJS send error:', err);
            const msg = err?.text || err?.status || err?.message || JSON.stringify(err);
            toast.error(`EmailJS error: ${msg}`);
        } finally {
            setSending(false);
        }
    };

    return (
        <div className="bg-white rounded-lg shadow-md p-6 mt-6">
            <h2 className="text-xl font-semibold text-gray-800 mb-4">Email Package</h2>

            <div>
                    {!lockToFormEmail && (
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
                    )}

                    {!lockToFormEmail && (
                        <div className="mb-3 grid grid-cols-1 sm:grid-cols-2 gap-3">
                            <div>
                                <label className="block text-sm font-medium text-gray-700">Name (for template)</label>
                                <input
                                    type="text"
                                    value={recipientName}
                                    onChange={(e) => setRecipientName(e.target.value)}
                                    className="mt-1 block w-full border rounded-md px-3 py-2"
                                    placeholder="Client name (optional)"
                                />
                            </div>

                            <div>
                                <label className="block text-sm font-medium text-gray-700">Amount (optional)</label>
                                <input
                                    type="text"
                                    value={amount}
                                    onChange={(e) => setAmount(e.target.value)}
                                    className="mt-1 block w-full border rounded-md px-3 py-2"
                                    placeholder="e.g. $199"
                                />
                            </div>
                        </div>
                    )}

                    <div className="mb-3">
                        <label className="block text-sm font-medium text-gray-700">Subject</label>
                        <input
                            type="text"
                            value={subject}
                            onChange={(e) => !lockToFormEmail && setSubject(e.target.value)}
                            disabled={lockToFormEmail}
                            className={`mt-1 block w-full border rounded-md px-3 py-2 ${
                                lockToFormEmail ? 'bg-gray-50 text-gray-600 cursor-not-allowed' : ''
                            }`}
                        />
                    </div>

                    <div className="mb-3">
                        <label className="block text-sm font-medium text-gray-700">Body (HTML)</label>
                        <textarea
                            value={body}
                            onChange={(e) => !lockToFormEmail && setBody(e.target.value)}
                            disabled={lockToFormEmail}
                            className={`mt-1 block w-full border rounded-md px-3 py-2 h-40 ${
                                lockToFormEmail ? 'bg-gray-50 text-gray-600 cursor-not-allowed' : ''
                            }`}
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
    );
};

export default EmailTemplatePanel;
