import { useState, useEffect, useRef } from 'react';
import { useAuth } from '../context/AuthContext';
import axios from 'axios';
import { toast } from 'react-toastify';
import { Search, FileCheck, FileX, Clock, Users, ChevronDown } from 'lucide-react';
import ClientList from '../components/ClientList';

interface Client {
  _id: string;
  employeePaymentName: string;
  clientName: string;
  companyName: string;
  serviceName: string;
  employeeName: string;
  mobileNumber: number;
  email: string;
  amount: number;
  status: 'pending' | 'approved' | 'rejected';
  paymentType: 'companyscanner' | 'phonepay' | 'gateway' | 'banktransfer';
  saleType: 'new' | 'upsale';
  createdAt: string;
}

const AdminDashboard = () => {
  const [startDate, setStartDate] = useState<string>('');
  const [endDate, setEndDate] = useState<string>('');
  const { user } = useAuth();
  const [clients, setClients] = useState<Client[]>([]);
  const [filteredClients, setFilteredClients] = useState<Client[]>([]);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState('');
  const [activeFilter, setActiveFilter] = useState('all');
  const [saleTypeFilter, setSaleTypeFilter] = useState<'all' | 'new' | 'upsale'>('all');
  const [stats, setStats] = useState({
    total: 0,
    pending: 0,
    approved: 0,
    rejected: 0,
  });
  const tableContainerRef = useRef<HTMLDivElement>(null);
  const [isDropdownOpen, setIsDropdownOpen] = useState(false);

  // Fetch client submissions
  const fetchClients = async () => {
    try {
      setLoading(true);
      const { data } = await axios.get('/clients');

      if (data.success) {
        setClients(data.data);
        setFilteredClients(data.data);

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

  // Filter by status and email
  const filterClients = () => {
    let filtered = clients;

    if (activeFilter !== 'all') {
      filtered = filtered.filter(client => client.status === activeFilter);
    }

    if (saleTypeFilter !== 'all') {
      filtered = filtered.filter(client => client.saleType === saleTypeFilter);
    }

    if (searchTerm.trim() !== '') {
      const search = searchTerm.toLowerCase();
      filtered = filtered.filter(client =>
        client.email.toLowerCase().includes(search) ||
        client.employeeName.toLowerCase().includes(search) ||
        client.employeePaymentName.toLowerCase().includes(search)
      );
    }
    // Apply date range filter if both dates are provided
    if (startDate && endDate) {
      const start = new Date(startDate);
      const end = new Date(endDate);
      end.setHours(23, 59, 59, 999); // Include the entire end day

      filtered = filtered.filter(client => {
        const clientDate = new Date(client.createdAt);
        return clientDate >= start && clientDate <= end;
      });
    }

    setFilteredClients(filtered);
  };

  useEffect(() => {
    filterClients();
  }, [searchTerm, activeFilter, clients, startDate, endDate, saleTypeFilter]);

  // Handle approve/reject
  const handleStatusUpdate = async (id: string, status: 'approved' | 'rejected') => {
    try {
      const { data } = await axios.patch(`/clients/${id}/status`, { status });

      if (data.success) {
        toast.success(`Submission ${status} successfully`);

        setClients(prevClients =>
          prevClients.map(client =>
            client._id === id ? { ...client, status } : client
          )
        );
      }
    } catch (error) {
      toast.error(`Failed to update status`);
    }
  };

  // Handle mouse down for horizontal scrolling
  const handleMouseDown = (e: React.MouseEvent) => {
    if (!tableContainerRef.current) return;
    
    const container = tableContainerRef.current;
    const startX = e.clientX;
    const scrollLeft = container.scrollLeft;
    container.style.cursor = 'grabbing';
    container.style.userSelect = 'none';

    const handleMouseMove = (e: MouseEvent) => {
      if (!tableContainerRef.current) return;
      const x = e.clientX - startX;
      tableContainerRef.current.scrollLeft = scrollLeft - x;
    };

    const handleMouseUp = () => {
      if (!tableContainerRef.current) return;
      tableContainerRef.current.style.cursor = 'grab';
      tableContainerRef.current.style.removeProperty('user-select');
      
      document.removeEventListener('mousemove', handleMouseMove);
      document.removeEventListener('mouseup', handleMouseUp);
    };

    document.addEventListener('mousemove', handleMouseMove);
    document.addEventListener('mouseup', handleMouseUp);
  };

  return (
    <div className="space-y-8">
      <div>
        <h1 className="text-3xl font-bold text-gray-800">Admin Dashboard</h1>
        <p className="text-gray-600 mt-1">Welcome back, {user?.name}</p>
      </div>

      {/* Status Summary Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        <div
          className="bg-white rounded-lg shadow-md p-6 cursor-pointer hover:bg-gray-50 transition-colors"
          onClick={() => setActiveFilter('all')}
        >
          <div className="flex items-center">
            <div className="bg-blue-100 p-3 rounded-full">
              <Users className="h-6 w-6 text-blue-700" />
            </div>
            <div className="ml-4">
              <h3 className="text-sm font-medium text-gray-500">Total Submissions</h3>
              <p className="text-2xl font-semibold text-gray-800">{stats.total}</p>
            </div>
          </div>
        </div>

        <div
          className="bg-white rounded-lg shadow-md p-6 cursor-pointer hover:bg-gray-50 transition-colors"
          onClick={() => setActiveFilter('pending')}
        >
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

        <div
          className="bg-white rounded-lg shadow-md p-6 cursor-pointer hover:bg-gray-50 transition-colors"
          onClick={() => setActiveFilter('approved')}
        >
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

        <div
          className="bg-white rounded-lg shadow-md p-6 cursor-pointer hover:bg-gray-50 transition-colors"
          onClick={() => setActiveFilter('rejected')}
        >
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

      {/* Client List & Search */}
      <div className="bg-white rounded-lg shadow-md">
        <div className="p-6 border-b flex flex-col md:flex-row justify-between items-start md:items-center gap-4">
          <h2 className="text-xl font-semibold text-gray-800">
            {activeFilter === 'all'
              ? 'All Submissions'
              : activeFilter === 'pending'
                ? 'Pending Submissions'
                : activeFilter === 'approved'
                  ? 'Approved Submissions'
                  : 'Rejected Submissions'}
            {saleTypeFilter !== 'all' && (
              <span className="text-sm font-normal ml-2">
                ({saleTypeFilter === 'new' ? 'New Sales' : 'Upsales'})
              </span>
            )}
          </h2>
          
          <div className="flex flex-col md:flex-row gap-4 w-full md:w-auto items-end md:items-center">
            <div className="flex flex-col md:flex-row gap-2 w-full md:w-auto">
              <div className="relative">
                <input
                  type="date"
                  value={startDate}
                  onChange={(e) => setStartDate(e.target.value)}
                  className="block w-full pl-3 pr-3 py-2 border border-gray-300 rounded-md leading-5 bg-white placeholder-gray-500 focus:outline-none focus:ring-blue-500 focus:border-blue-500 sm:text-sm"
                  placeholder="Start date"
                />
              </div>
              <span className="hidden md:flex items-center">to</span>
              <div className="relative">
                <input
                  type="date"
                  value={endDate}
                  onChange={(e) => setEndDate(e.target.value)}
                  className="block w-full pl-3 pr-3 py-2 border border-gray-300 rounded-md leading-5 bg-white placeholder-gray-500 focus:outline-none focus:ring-blue-500 focus:border-blue-500 sm:text-sm"
                  placeholder="End date"
                />
              </div>
            </div>

            {/* Sale Type Dropdown */}
            <div className="relative w-full md:w-48">
              <button
                type="button"
                className="inline-flex justify-between w-full rounded-md border border-gray-300 shadow-sm px-4 py-2 bg-white text-sm font-medium text-gray-700 hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-blue-500"
                onClick={() => setIsDropdownOpen(!isDropdownOpen)}
              >
                {saleTypeFilter === 'all' ? 'All Sales' : saleTypeFilter === 'new' ? 'New Sales' : 'Upsales'}
                <ChevronDown className="-mr-1 ml-2 h-5 w-5" />
              </button>

              {isDropdownOpen && (
                <div className="origin-top-right absolute right-0 mt-2 w-full rounded-md shadow-lg bg-white ring-1 ring-black ring-opacity-5 z-10">
                  <div className="py-1" role="menu" aria-orientation="vertical">
                    <button
                      onClick={() => {
                        setSaleTypeFilter('all');
                        setIsDropdownOpen(false);
                      }}
                      className={`block px-4 py-2 text-sm w-full text-left ${saleTypeFilter === 'all' ? 'bg-gray-100 text-gray-900' : 'text-gray-700'}`}
                    >
                      All Sales
                    </button>
                    <button
                      onClick={() => {
                        setSaleTypeFilter('new');
                        setIsDropdownOpen(false);
                      }}
                      className={`block px-4 py-2 text-sm w-full text-left ${saleTypeFilter === 'new' ? 'bg-gray-100 text-gray-900' : 'text-gray-700'}`}
                    >
                      New Sales
                    </button>
                    <button
                      onClick={() => {
                        setSaleTypeFilter('upsale');
                        setIsDropdownOpen(false);
                      }}
                      className={`block px-4 py-2 text-sm w-full text-left ${saleTypeFilter === 'upsale' ? 'bg-gray-100 text-gray-900' : 'text-gray-700'}`}
                    >
                      Upsales
                    </button>
                  </div>
                </div>
              )}
            </div>

            <div className="w-full md:w-64 relative">
              <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                <Search size={18} className="text-gray-400" />
              </div>
              <input
                type="text"
                placeholder="Search by email..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="block w-full pl-10 pr-3 py-2 border border-gray-300 rounded-md leading-5 bg-white placeholder-gray-500 focus:outline-none focus:ring-blue-500 focus:border-blue-500 sm:text-sm"
              />
            </div>
          </div>
        </div>

        <div
          ref={tableContainerRef}
          className="overflow-x-auto cursor-grab active:cursor-grabbing"
          onMouseDown={handleMouseDown}
          style={{ 
            scrollbarWidth: 'none',
            WebkitOverflowScrolling: 'touch',
            msOverflowStyle: 'none',
          }}
        >
          <div style={{ minWidth: '100%', width: 'max-content' }}>
            <ClientList
              clients={filteredClients}
              loading={loading}
              isAdmin={true}
              onStatusUpdate={handleStatusUpdate}
              emptyMessage={searchTerm ? "No results found for your search." : "No submissions to display."}
            />
          </div>
        </div>
      </div>
    </div>
  );
};

export default AdminDashboard;