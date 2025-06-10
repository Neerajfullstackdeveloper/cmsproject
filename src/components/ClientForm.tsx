import { useState } from 'react';
import { useForm } from 'react-hook-form';

interface ClientFormProps {
  onSubmit: (data: any) => void;
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
  serviceType: 'new sale' | 'upsale';
  paymentType: 'companyscanner' | 'phonepay' | 'gateway' | 'banktransfer';
}

const ClientForm = ({ onSubmit }: ClientFormProps) => {
  const [isSubmitting, setIsSubmitting] = useState(false);
  
  const {
    register,
    handleSubmit,
    formState: { errors },
    reset
  } = useForm<FormData>();
  
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
            Service Name <span className="text-red-500">*</span>
          </label>
          <input
            id="serviceName"
            type="text"
            {...register('serviceName', { required: 'Service name is required' })}
            className={`w-full px-4 py-2 border ${
              errors.serviceName ? 'border-red-500' : 'border-gray-300'
            } rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500`}
          />
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
            <option value="">Select payment type</option>
            <option value="companyscanner">Company scanner</option>
            <option value="phonepay">Phone pay</option>
            <option value="gateway">Website gateway</option>
            <option value="banktransfer">Bank transfer</option>
          </select>
          {errors.serviceType && (
            <p className="mt-1 text-sm text-red-600">{errors.serviceType.message}</p>
          )}
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

export default ClientForm;