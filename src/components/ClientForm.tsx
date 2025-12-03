import { useState, useEffect } from 'react';
import { useForm, useWatch } from 'react-hook-form';

interface ClientFormProps {
  onSubmit: (data: any) => void;
  onChange?: (values: Partial<FormData>) => void;
}

interface FormData {
  clientName: string;
  companyName: string;
  mobileNumber: string;
  employeePaymentName:string;
  paymentReceivedDate: string;
  amount: number;
  gstNumber: string;
  email: string;
  serviceName: string;
  paymentStage?: 'token' | 'first' | 'second' | 'third' | 'final';
  serviceType: 'new sale' | 'upsale';
  paymentType: 'companyscanner' | 'phonepay' | 'gateway' | 'banktransfer';
}

interface ServicePackage {
  id: string;
  name: string;
  emailSubject: string;
  emailBody: string;
}

const servicePackages: ServicePackage[] = [
  {
    id: 'seo',
    name: 'Our SEO Package',
    emailSubject: 'Our SEO Package',
    emailBody: `<p>Hi {{name}},</p><p>Welcome to our SEO Package! We are excited to help you improve your online visibility, boost search rankings, and grow your digital presence. Our team will work closely with you to ensure your website achieves better performance and long-term organic success.</p><p>Regards,<br/>Team</p>`,
  },
  {
    id: 'standard',
    name: 'Our Standard Package',
    emailSubject: 'Invoice for Your Recent Service',
    emailBody: `<p>Hi {{name}},</p><p>Please find attached the invoice for the recent service under our Standard Package. The total payable amount is: {{amount}}. If you have any questions or need clarification, feel free to reach out.</p><p>Regards,<br/>Accounting</p>`,
  },
  {
    id: 'advanced',
    name: 'Our Advanced Package',
    emailSubject: 'Quick Follow Up',
    emailBody: `<p>Hi {{name}},</p><p>Just following up on our previous conversation regarding our Advanced Package. If you have any questions or need more details about the features, benefits, or setup process, feel free to reach out—we're here to assist you.</p><p>Thanks,<br/>Team</p>`,
  },
  {
    id: 'googlevirtualtool',
    name: 'Google Virtual Tool',
    emailSubject: 'Quick Follow Up',
    emailBody: `<p>Hi {{name}},</p><p>Just following up on our previous conversation regarding the Google Virtual Tool. If you have any questions about setup, features, or how to get started, feel free to let us know—we're here to help.</p><p>Thanks,<br/>Team</p>`,
  },
];

const ClientForm = ({ onSubmit, onChange }: ClientFormProps) => {
  const [isSubmitting, setIsSubmitting] = useState(false);
  
  const {
    register,
    handleSubmit,
    formState: { errors },
    reset,
    control,
  } = useForm<FormData>();

  const watched = useWatch({ control });

  useEffect(() => {
    if (onChange) onChange(watched || {});
  }, [watched, onChange]);
  
  const onFormSubmit = async (data: FormData) => {
    setIsSubmitting(true);
    try {
      await onSubmit(data);
      reset();
    } finally {
      setIsSubmitting(false);

    }
  };

  return (
    <form onSubmit={handleSubmit(onFormSubmit)} className="space-y-6">
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <div>
          <label htmlFor="employeePaymentName" className="block text-sm font-medium text-gray-700 mb-1">
            Employee Name <span className="text-red-500">*</span>
          </label>
          <input
            id="employeePaymentName"
            type="text"
            {...register('employeePaymentName', { required: 'Employee name is required' })}
            className={`w-full px-4 py-2 border ${
              errors.employeePaymentName? 'border-red-500' : 'border-gray-300'
            } rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500`}
          />
          {errors.employeePaymentName && (
            <p className="mt-1 text-sm text-red-600">{errors.employeePaymentName.message}</p>
          )}
        </div>
        <div>
          <label htmlFor="clientName" className="block text-sm font-medium text-gray-700 mb-1">
            Client Name <span className="text-red-500">*</span>
          </label>
          <input
            id="clientName"
            type="text"
            {...register('clientName', { required: 'Client name is required' })}
            className={`w-full px-4 py-2 border ${
              errors.clientName ? 'border-red-500' : 'border-gray-300'
            } rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500`}
          />
          {errors.clientName && (
            <p className="mt-1 text-sm text-red-600">{errors.clientName.message}</p>
          )}
        </div>
        <div>
          <label htmlFor="companyName" className="block text-sm font-medium text-gray-700 mb-1">
            Company Name <span className="text-red-500">*</span>
          </label>
          <input
            id="companyName"
            type="text"
            {...register('companyName', { required: 'Company name is required' })}
            className={`w-full px-4 py-2 border ${
              errors.companyName ? 'border-red-500' : 'border-gray-300'
            } rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500`}
          />
          {errors.companyName && (
            <p className="mt-1 text-sm text-red-600">{errors.companyName.message}</p>
          )}
        </div>
        
        <div>
          <label htmlFor="mobileNumber" className="block text-sm font-medium text-gray-700 mb-1">
            Mobile Number <span className="text-red-500">*</span>
          </label>
          <input
            id="mobileNumber"
            type="text"
            {...register('mobileNumber', { 
              required: 'Mobile number is required',
              pattern: {
                value: /^[0-9]{10}$/,
                message: 'Please enter a valid 10-digit mobile number'
              }
            })}
            className={`w-full px-4 py-2 border ${
              errors.mobileNumber ? 'border-red-500' : 'border-gray-300'
            } rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500`}
          />
          {errors.mobileNumber && (
            <p className="mt-1 text-sm text-red-600">{errors.mobileNumber.message}</p>
          )}
        </div>
        
        <div>
          <label htmlFor="email" className="block text-sm font-medium text-gray-700 mb-1">
            Email
          </label>
          <input
            id="email"
            type="email"
            {...register('email', {
              pattern: {
                value: /^[A-Z0-9._%+-]+@[A-Z0-9.-]+\.[A-Z]{2,}$/i,
                message: 'Please enter a valid email address'
              }
            })}
            className={`w-full px-4 py-2 border ${
              errors.email ? 'border-red-500' : 'border-gray-300'
            } rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500`}
          />
          {errors.email && (
            <p className="mt-1 text-sm text-red-600">{errors.email.message}</p>
          )}
        </div>
        
        <div>
          <label htmlFor="paymentReceivedDate" className="block text-sm font-medium text-gray-700 mb-1">
            Payment Received Date <span className="text-red-500">*</span>
          </label>
          <input
            id="paymentReceivedDate"
            type="date"
            {...register('paymentReceivedDate', { required: 'Payment received date is required' })}
            className={`w-full px-4 py-2 border ${
              errors.paymentReceivedDate ? 'border-red-500' : 'border-gray-300'
            } rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500`}
          />
          {errors.paymentReceivedDate && (
            <p className="mt-1 text-sm text-red-600">{errors.paymentReceivedDate.message}</p>
          )}
        </div>
        
        <div>
          <label htmlFor="amount" className="block text-sm font-medium text-gray-700 mb-1">
            Amount <span className="text-red-500">*</span>
          </label>
          <input
            id="amount"
            type="number"
            step="0.01"
            min="0"
            {...register('amount', { 
              required: 'Amount is required',
              valueAsNumber: true,
              min: {
                value: 0,
                message: 'Amount must be greater than 0'
              }
            })}
            className={`w-full px-4 py-2 border ${
              errors.amount ? 'border-red-500' : 'border-gray-300'
            } rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500`}
          />
          {errors.amount && (
            <p className="mt-1 text-sm text-red-600">{errors.amount.message}</p>
          )}
        </div>
        
        <div>
          <label htmlFor="gstNumber" className="block text-sm font-medium text-gray-700 mb-1">
            GST Number
          </label>
          <input
            id="gstNumber"
            type="text"
            {...register('gstNumber')}
            className="w-full px-4 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
          />
        </div>
        
        <div>
          <label htmlFor="serviceName" className="block text-sm font-medium text-gray-700 mb-1">
            Service Package <span className="text-red-500">*</span>
          </label>
          <select
            id="serviceName"
            {...register('serviceName', { required: 'Service package is required' })}
            className={`w-full px-4 py-2 border ${
              errors.serviceName ? 'border-red-500' : 'border-gray-300'
            } rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500`}
          >
            <option value="">Select a package</option>
            {servicePackages.map((pkg) => (
              <option key={pkg.id} value={pkg.name}>{pkg.name}</option>
            ))}
          </select>
          {errors.serviceName && (
            <p className="mt-1 text-sm text-red-600">{errors.serviceName.message}</p>
          )}
        </div>
        
        <div>
          <label htmlFor="serviceType" className="block text-sm font-medium text-gray-700 mb-1">
            Service Type <span className="text-red-500">*</span>
          </label>
          <select
            id="serviceType"
            {...register('serviceType', { required: 'Service type is required' })}
            className={`w-full px-4 py-2 border ${
              errors.serviceType ? 'border-red-500' : 'border-gray-300'
            } rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500`}
          >
            <option value="">Select service type</option>
            <option value="new sale">New Sale</option>
            <option value="upsale">Upsale</option>
          </select>
          {errors.serviceType && (
            <p className="mt-1 text-sm text-red-600">{errors.serviceType.message}</p>
          )}
        </div>
        <div>
          <label htmlFor="paymentType" className="block text-sm font-medium text-gray-700 mb-1">
            Payment Type <span className="text-red-500">*</span>
          </label>
          <select
            id="paymentType"
            {...register('paymentType', { required: 'Payment type is required' })}
            className={`w-full px-4 py-2 border ${
              errors.paymentType ? 'border-red-500' : 'border-gray-300'
            } rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500`}
          >
            <option value="">Select payment way</option>
            <option value="companyscanner">Company scanner</option>
            <option value="phonepay">Phone pay</option>
            <option value="gateway">Website gateway</option>
            <option value="banktransfer">Bank transfer</option>
          </select>
          {errors.serviceType && (
            <p className="mt-1 text-sm text-red-600">{errors.serviceType.message}</p>
          )}
        </div>
        
        <div>
          <label htmlFor="paymentStage" className="block text-sm font-medium text-gray-700 mb-1">
            Payment Stage
          </label>
          <select
            id="paymentStage"
            {...register('paymentStage')}
            className={`w-full px-4 py-2 border ${
              errors.paymentStage ? 'border-red-500' : 'border-gray-300'
            } rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500`}
          >
            <option value="">Select stage</option>
            <option value="token">Token Amount</option>
            <option value="first">First Settlement</option>
            <option value="second">Second Settlement</option>
            <option value="third">Third Settlement</option>
            <option value="final">Final Settlement</option>
          </select>
        </div>
      </div>
      
      <div className="flex justify-end">
        <button
          type="submit"
          disabled={isSubmitting}
          className={`px-6 py-2 bg-blue-700 text-white rounded-md hover:bg-blue-800 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2 transition-colors ${
            isSubmitting ? 'opacity-75 cursor-not-allowed' : ''
          }`}
        >
          {isSubmitting ? (
            <span className="flex items-center">
              <svg className="animate-spin -ml-1 mr-2 h-4 w-4 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
              </svg>
              Submitting...
            </span>
          ) : (
            'Submit'
          )}
        </button>
      </div>
    </form>
  );
};

export { servicePackages };
export default ClientForm;