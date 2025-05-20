import { CheckCircle, XCircle, CheckCircle2, XCircle as XCircle2 } from 'lucide-react';
import { format } from 'date-fns';

interface Client {
  _id: string;
  employeePaymentName:string;
  clientName: string;
  companyName: string;
  serviceName: string;
  email:string;
  mobileNumber:string;
  employeeName?: string;
  amount: number;
  status: 'pending' | 'approved' | 'rejected';
  createdAt: string;
}

interface ClientListProps {
  clients: Client[];
  loading: boolean;
  isAdmin: boolean;
  onStatusUpdate: (id: string, status: 'approved' | 'rejected') => void;
  emptyMessage: string;
}

const ClientList = ({ clients, loading, isAdmin, onStatusUpdate, emptyMessage }: ClientListProps) => {
  if (loading) {
    return (
      <div className="p-6 text-center">
        <div className="inline-block animate-spin rounded-full h-8 w-8 border-t-2 border-b-2 border-blue-700 mb-2"></div>
        <p className="text-gray-600">Loading submissions...</p>
      </div>
    );
  }

  if (clients.length === 0) {
    return (
      <div className="p-12 text-center">
        <p className="text-gray-500">{emptyMessage}</p>
      </div>
    );
  }

  const formatDate = (dateString: string) => {
    try {
      return format(new Date(dateString), 'MMM dd, yyyy');
    } catch (error) {
      return 'Invalid date';
    }
  };

  const getStatusBadgeClass = (status: string) => {
    switch (status) {
      case 'pending':
        return 'bg-yellow-100 text-yellow-800';
      case 'approved':
        return 'bg-green-100 text-green-800';
      case 'rejected':
        return 'bg-red-100 text-red-800';
      default:
        return 'bg-gray-100 text-gray-800';
    }
  };

  return (
    <div className="overflow-x-auto">
      <table className="min-w-full divide-y divide-gray-200">
        <thead className="bg-gray-50">
          <tr>
            {isAdmin && (
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                Employee
              </th>
            )}
            <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
              Client/Company
            </th><th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
              Client E-mail
            </th><th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
              Client Number
            </th>
            <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
              Service
            </th>
            <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
              Amount
            </th>
            <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
              Client By
            </th>
            <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
              Date
            </th>
            <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
              Status
            </th>
            {isAdmin && (
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                Actions
              </th>
            )}
          </tr>
        </thead>
        <tbody className="bg-white divide-y divide-gray-200">
          {clients.map((client) => (
            <tr key={client._id} className="hover:bg-gray-50 transition-colors">
              {isAdmin && (
                <td className="px-6 py-4 whitespace-nowrap">
                  <div className="text-sm font-medium text-gray-900">{client.employeeName}</div>
                </td>
              )}
              <td className="px-6 py-4">
                <div className="text-sm font-medium text-gray-900">{client.clientName}</div>
                <div className="text-sm text-gray-500">{client.companyName}</div>
              </td>
              <td className="px-6 py-4">
                <div className="text-sm text-gray-500">{client.email}</div>
              </td>
              <td className="px-6 py-4">
                <div className="text-sm text-gray-500">{client.mobileNumber}</div>
              </td>
              <td className="px-6 py-4 whitespace-nowrap">
                <div className="text-sm text-gray-900">{client.serviceName}</div>
              </td>
              <td className="px-6 py-4 whitespace-nowrap">
                <div className="text-sm text-gray-900">₹{client.amount.toFixed(2)}</div>
              </td>
              <td className="px-6 py-4 whitespace-nowrap">
                <div className="text-sm font-medium text-gray-900">{client.clientName}</div>
                <div className="text-sm font-medium text-gray-900">{console.log('EmployeePaymentName:', client.employeePaymentName)}</div>
              </td>
              <td className="px-6 py-4 whitespace-nowrap">
                <div className="text-sm text-gray-500">{formatDate(client.createdAt)}</div>
              </td>
              <td className="px-6 py-4 whitespace-nowrap">
                <span className={`px-2 inline-flex text-xs leading-5 font-semibold rounded-full ${getStatusBadgeClass(client.status)}`}>
                  {client.status.charAt(0).toUpperCase() + client.status.slice(1)}
                </span>
              </td>
              {isAdmin && (
                <td className="px-6 py-4 whitespace-nowrap text-right text-sm font-medium">
                  {client.status === 'pending' ? (
                    <div className="flex space-x-3">
                      <button
                        onClick={() => onStatusUpdate(client._id, 'approved')}
                        className="text-green-600 hover:text-green-800 transition-colors flex items-center"
                      >
                        <CheckCircle size={18} className="mr-1" />
                        Approve
                      </button>
                      <button
                        onClick={() => onStatusUpdate(client._id, 'rejected')}
                        className="text-red-600 hover:text-red-800 transition-colors flex items-center"
                      >
                        <XCircle size={18} className="mr-1" />
                        Reject
                      </button>
                    </div>
                  ) : (
                    <span className="text-gray-500">
                      {client.status === 'approved' ? (
                        <div className="flex items-center">
                          <CheckCircle2 size={18} className="mr-1 text-green-600" />
                          Approved
                        </div>
                      ) : (
                        <div className="flex items-center">
                          <XCircle2 size={18} className="mr-1 text-red-600" />
                          Rejected
                        </div>
                      )}
                    </span>
                  )}
                </td>
              )}
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
};

export default ClientList;