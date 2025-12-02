import { useState, useEffect } from 'react';
import { useAuth } from '../context/AuthContext';
import axios from 'axios';
import { toast } from 'react-toastify';
import { Plus, FileCheck, FileX, Clock } from 'lucide-react';
import ClientForm, { servicePackages } from '../components/ClientForm';
import ClientList from '../components/ClientList';
import EmailTemplatePanel from '../components/EmailTemplatePanel';

interface Client {
  _id: string;
  employeePaymentName:string;
  clientName: string;
  companyName: string;
  serviceName: string;
  amount: number;
  status: 'pending' | 'approved' | 'rejected';
  createdAt: string;
}

const EmployeeDashboard = () => {
  const { user } = useAuth();
  const [clients, setClients] = useState<Client[]>([]);
  const [loading, setLoading] = useState(true);
  const [showForm, setShowForm] = useState(false);
  const [showEmailPanel, setShowEmailPanel] = useState(false);
  const [formValues, setFormValues] = useState<any | null>(null);
  const [stats, setStats] = useState({
    total: 0,
    pending: 0,
    approved: 0,
    rejected: 0,
  });

  const fetchClients = async () => {
    try {
      setLoading(true);
      const { data } = await axios.get('/clients/my-submissions');
      
      if (data.success) {
        setClients(data.data);
        
        // Calculate stats
        const total = data.data.length;
        const pending = data.data.filter((client: Client) => client.status === 'pending').length;
        const approved = data.data.filter((client: Client) => client.status === 'approved').length;
        const rejected = data.data.filter((client: Client) => client.status === 'rejected').length;
        
        setStats({ total, pending, approved, rejected });
      }
    } catch (error) {
      toast.error('Failed to fetch submissions');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchClients();
  }, []);

  const handleFormSubmit = async (formData: any) => {
    try {
      const { data } = await axios.post('/clients', formData);
      
      if (data.success) {
        toast.success('Client submission successful');
        setShowForm(false);
        fetchClients();
      }
    } catch (error) {
      toast.error('Failed to submit client data');
    }
  };

  return (
    <div className="space-y-8">
      <div className="flex flex-col md:flex-row justify-between items-start md:items-center">
        <div>
          <h1 className="text-3xl font-bold text-gray-800">Employee Dashboard</h1>
          <p className="text-gray-600 mt-1">Welcome back, {user?.name}</p>
        </div>
        
        <button
          onClick={() => setShowForm(!showForm)}
          className="mt-4 md:mt-0 flex items-center px-4 py-2 bg-blue-700 text-white rounded-md hover:bg-blue-800 transition-colors"
        >
          {showForm ? 'Cancel' : (
            <>
              <Plus size={18} className="mr-1" />
              New Submission
            </>
          )}
        </button>
        <button
          onClick={() => setShowEmailPanel(!showEmailPanel)}
          className="mt-4 md:mt-0 ml-2 flex items-center px-4 py-2 bg-green-700 text-white rounded-md hover:bg-green-800 transition-colors"
        >
          {showEmailPanel ? 'Close Email' : 'Email Templates'}
        </button>
      </div>
      
      {showForm ? (
        <div className="bg-white rounded-lg shadow-md p-6">
          <h2 className="text-xl font-semibold text-gray-800 mb-4">New Client Submission</h2>
          <ClientForm onSubmit={handleFormSubmit} onChange={(vals) => setFormValues(vals)} />
          {/* Show email template below the form based on selected service package */}
          <div className="mt-6">
            <EmailTemplatePanel selectedClient={formValues as any} lockToFormEmail={true} servicePackages={servicePackages} selectedPackage={formValues?.serviceName} />
          </div>
        </div>
      ) : (
        <>
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
            <div className="bg-white rounded-lg shadow-md p-6">
              <div className="flex items-center">
                <div className="bg-blue-100 p-3 rounded-full">
                  <FileCheck className="h-6 w-6 text-blue-700" />
                </div>
                <div className="ml-4">
                  <h3 className="text-sm font-medium text-gray-500">Total Submissions</h3>
                  <p className="text-2xl font-semibold text-gray-800">{stats.total}</p>
                </div>
              </div>
            </div>
            
            <div className="bg-white rounded-lg shadow-md p-6">
              <div className="flex items-center">
                <div className="bg-yellow-100 p-3 rounded-full">
                  <Clock className="h-6 w-6 text-yellow-700" />
                </div>
                <div className="ml-4">
                  <h3 className="text-sm font-medium text-gray-500">Pending</h3>
                  <p className="text-2xl font-semibold text-gray-800">{stats.pending}</p>
                </div>
              </div>
            </div>
            
            <div className="bg-white rounded-lg shadow-md p-6">
              <div className="flex items-center">
                <div className="bg-green-100 p-3 rounded-full">
                  <FileCheck className="h-6 w-6 text-green-700" />
                </div>
                <div className="ml-4">
                  <h3 className="text-sm font-medium text-gray-500">Approved</h3>
                  <p className="text-2xl font-semibold text-gray-800">{stats.approved}</p>
                </div>
              </div>
            </div>
            
            <div className="bg-white rounded-lg shadow-md p-6">
              <div className="flex items-center">
                <div className="bg-red-100 p-3 rounded-full">
                  <FileX className="h-6 w-6 text-red-700" />
                </div>
                <div className="ml-4">
                  <h3 className="text-sm font-medium text-gray-500">Rejected</h3>
                  <p className="text-2xl font-semibold text-gray-800">{stats.rejected}</p>
                </div>
              </div>
            </div>
          </div>
          
          <div className="bg-white rounded-lg shadow-md">
            <div className="p-6 border-b">
              <h2 className="text-xl font-semibold text-gray-800">Your Submissions</h2>
            </div>
            
            <ClientList
              clients={clients as any}
              loading={loading}
              isAdmin={false}
              onStatusUpdate={() => {}}
              emptyMessage="You haven't submitted any client data yet."
            />
          </div>
        </>
      )}
    </div>
  );
};

export default EmployeeDashboard;