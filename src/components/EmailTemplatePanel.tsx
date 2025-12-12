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

<p>We are pleased to confirm that your subscription with <strong>GlobalB2BMart.com</strong> has been successfully activated. As per our records, you have enrolled for the <strong>S.E.O Package</strong>, effective from <strong>01/01/24</strong>, with a tenure of <strong>1yr</strong>. Your account has now been initiated in our system, and our onboarding team will begin setting up your company profile, uploading your product catalogue, and enabling all features included in your selected package to ensure maximum visibility and complete business support throughout your subscription period.</p>

<p>For any assistance during your tenure, you may contact our support team at <strong>011-41029790</strong> or write to us at <strong>webwavebusinesspvtltd@gmail.com </strong>. We are committed to providing prompt and reliable service at all times.</p>

<p>For future payments, kindly ensure that all transactions are made only to the official company bank account, payment gateway, or UPI ID shared below. Any payment made to any other bank account, number, or UPI ID will not be considered valid, and GlobalB2BMart.com / Webwave Business Pvt. Ltd. will not be liable for such transactions. Our official payment details are as follows:</p>

<p><strong>Axis Bank</strong><br/>
Account Name: Webwave Business Pvt Ltd<br/>
Account Number: 923020060598477<br/>
IFSC: UTIB0004098<br/>
Branch: Ajay Enclave<br/>
Address: Ground Floor, Property No.26/1, Ajay Enclave, New Ajanta Cinema, New Delhi – 110026</p>

<p>Thank you for choosing <strong>GlobalB2BMart.com</strong> as your trusted B2B growth partner. We look forward to supporting your business and helping you connect with verified global buyers effectively.</p>

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

<p>We are pleased to confirm that your subscription with <strong>GlobalB2BMart.com</strong> has been successfully activated. As per our records, you have enrolled for the <strong>Google Virtual Tool</strong>, effective from <strong>01/01/2025</strong>, with a tenure of <strong>1yr</strong>. Your account has now been initiated in our system, and our onboarding team will begin setting up your company profile, uploading your product catalogue, and enabling all features included in your selected package to ensure maximum visibility and complete business support throughout your subscription period.</p>

<p>For any assistance during your tenure, you may contact our support team at <strong>011-41029790</strong> or write to us at <strong>webwavebusinesspvtltd@gmail.com </strong>. We are committed to providing prompt and reliable service at all times.</p>

<p>For future payments, kindly ensure that all transactions are made only to the official company bank account, payment gateway, or UPI ID shared below. Any payment made to any other bank account, number, or UPI ID will not be considered valid, and GlobalB2BMart.com / Webwave Business Pvt. Ltd. will not be liable for such transactions. Our official payment details are as follows:</p>

<p><strong>Axis Bank</strong><br/>
Account Name: Webwave Business Pvt Ltd<br/>
Account Number: 923020060598477<br/>
IFSC: UTIB0004098<br/>
Branch: Ajay Enclave<br/>
Address: Ground Floor, Property No.26/1, Ajay Enclave, New Ajanta Cinema, New Delhi – 110026</p>

<p>Thank you for choosing <strong>GlobalB2BMart.com</strong> as your trusted B2B growth partner. We look forward to supporting your business and helping you connect with verified global buyers effectively.</p>

<p>Regards,<br/>Team</p>`,
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
                        className={`mt-1 block w-full border rounded-md px-3 py-2 ${lockToFormEmail ? 'bg-gray-50 text-gray-600 cursor-not-allowed' : ''
                            }`}
                    />
                </div>

                <div className="mb-3">
                    <label className="block text-sm font-medium text-gray-700">Body (HTML)</label>
                    <textarea
                        value={body}
                        onChange={(e) => !lockToFormEmail && setBody(e.target.value)}
                        disabled={lockToFormEmail}
                        className={`mt-1 block w-full border rounded-md px-3 py-2 h-40 ${lockToFormEmail ? 'bg-gray-50 text-gray-600 cursor-not-allowed' : ''
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
