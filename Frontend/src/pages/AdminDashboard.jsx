import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { adminAPI } from '../utils/api';
import { 
  FaCar, FaUsers, FaClipboardList, FaStar, 
  FaSignOutAlt, FaPlus, FaEdit, FaTrash, 
  FaTimes, FaBars, FaSyncAlt, FaChartLine,
  FaRupeeSign, FaCheckCircle, FaTimesCircle, FaClock
} from 'react-icons/fa';
import { 
  AreaChart, Area, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer,
  PieChart, Pie, Cell, BarChart, Bar, Legend
} from 'recharts';
import toast from 'react-hot-toast';

// ═══════════════════════════════════════════════════════════════
// MAIN DASHBOARD COMPONENT
// ═══════════════════════════════════════════════════════════════
const AdminDashboard = () => {
  const navigate = useNavigate();
  const [activeView, setActiveView] = useState('dashboard');
  const [sidebarOpen, setSidebarOpen] = useState(false);
  
  // Data states
  const [stats, setStats] = useState(null);
  const [cars, setCars] = useState([]);
  const [bookings, setBookings] = useState([]);
  const [users, setUsers] = useState([]);
  const [reviews, setReviews] = useState([]);
  
  // UI states
  const [loading, setLoading] = useState(true);
  const [refreshing, setRefreshing] = useState(false);
  const [modalOpen, setModalOpen] = useState(false);
  const [editingCar, setEditingCar] = useState(null);
  const [carForm, setCarForm] = useState({
    name: '', type: '', price: '', image: '', seats: '', fuel: '', mileage: '', transmission: 'Automatic',
  });

  useEffect(() => {
    fetchDashboard();
    fetchCars();
    fetchBookings();
  }, []);

  useEffect(() => {
    if (activeView === 'users' && users.length === 0) fetchUsers();
    if (activeView === 'reviews' && reviews.length === 0) fetchReviews();
  }, [activeView]);

  const fetchDashboard = async () => {
    try {
      setLoading(true);
      const data = await adminAPI.getDashboard();
      setStats(data.stats);
    } catch (err) {
      console.error('Dashboard error:', err);
      if (err.message.includes('authentication') || err.message.includes('session')) {
        navigate('/admin/login');
      }
    } finally {
      setLoading(false);
    }
  };

  const handleRefresh = async () => {
    setRefreshing(true);
    if (activeView === 'dashboard') await fetchDashboard();
    if (activeView === 'cars') await fetchCars();
    if (activeView === 'bookings') await fetchBookings();
    if (activeView === 'users') await fetchUsers();
    if (activeView === 'reviews') await fetchReviews();
    setTimeout(() => setRefreshing(false), 500);
  };

  const fetchCars = async () => {
    try {
      const data = await adminAPI.getAllCars();
      setCars(data.cars || []);
    } catch (err) { console.error('Cars error:', err); }
  };

  const fetchBookings = async () => {
    try {
      const data = await adminAPI.getAllBookings();
      setBookings(data.bookings || []);
    } catch (err) { console.error('Bookings error:', err); }
  };

  const fetchUsers = async () => {
    try {
      const data = await adminAPI.getAllUsers();
      setUsers(data.users || []);
    } catch (err) { console.error('Users error:', err); }
  };

  const fetchReviews = async () => {
    try {
      const data = await adminAPI.getAllReviews();
      setReviews(data.reviews || []);
    } catch (err) { console.error('Reviews error:', err); }
  };

  const handleLogout = () => {
    localStorage.removeItem('adminToken');
    localStorage.removeItem('adminUser');
    navigate('/admin/login');
  };

  const handleCarSubmit = async (e) => {
    e.preventDefault();
    try {
      const payload = { ...carForm, price: Number(carForm.price), seats: Number(carForm.seats) };
      if (editingCar) {
        await adminAPI.updateCar(editingCar._id, payload);
      } else {
        await adminAPI.createCar(payload);
      }
      setModalOpen(false);
      setEditingCar(null);
      setCarForm({ name: '', type: '', price: '', image: '', seats: '', fuel: '', mileage: '', transmission: 'Automatic' });
      toast.success(editingCar ? 'Car updated successfully' : 'Car added successfully');
      fetchCars();
      fetchDashboard();
    } catch (err) {
      toast.error(err.message);
    }
  };

  const handleEditCar = (car) => {
    setEditingCar(car);
    setCarForm({
      name: car.name,
      type: car.type,
      price: car.price.toString(),
      image: car.image,
      seats: car.seats.toString(),
      fuel: car.fuel,
      mileage: car.mileage,
      transmission: car.transmission,
    });
    setModalOpen(true);
  };

  const handleDeleteCar = async (carId) => {
    if (!confirm('Are you sure you want to delete this car?')) return;
    try {
      await adminAPI.deleteCar(carId);
      toast.success('Car deleted successfully');
      fetchCars();
      fetchDashboard();
    } catch (err) { toast.error(err.message); }
  };

  const handleBookingStatus = async (bookingId, status) => {
    try {
      await adminAPI.updateBookingStatus(bookingId, status);
      toast.success('Booking status updated');
      fetchBookings();
      fetchDashboard();
    } catch (err) { toast.error(err.message); }
  };

  const handleDeleteUser = async (userId) => {
    if (!confirm('Are you sure you want to delete this user?')) return;
    try {
      await adminAPI.deleteUser(userId);
      toast.success('User deleted successfully');
      fetchUsers();
      fetchDashboard();
    } catch (err) { toast.error(err.message); }
  };

  const handleDeleteReview = async (reviewId) => {
    if (!confirm('Are you sure you want to delete this review?')) return;
    try {
      await adminAPI.deleteReview(reviewId);
      toast.success('Review deleted successfully');
      fetchReviews();
      fetchDashboard();
    } catch (err) { toast.error(err.message); }
  };

  const navItems = [
    { key: 'dashboard', label: 'Dashboard', icon: <FaChartLine className="text-xl" /> },
    { key: 'cars', label: 'Fleet Management', icon: <FaCar className="text-xl" /> },
    { key: 'bookings', label: 'Bookings', icon: <FaClipboardList className="text-xl" /> },
    { key: 'users', label: 'User Directory', icon: <FaUsers className="text-xl" /> },
    { key: 'reviews', label: 'Customer Reviews', icon: <FaStar className="text-xl" /> },
  ];

  return (
    <div className="flex h-screen bg-[#0a0a0a] text-gray-200 font-sans overflow-hidden">
      
      {/* Mobile Sidebar Overlay */}
      {sidebarOpen && (
        <div 
          className="fixed inset-0 bg-black/60 backdrop-blur-sm z-40 lg:hidden transition-opacity duration-300"
          onClick={() => setSidebarOpen(false)}
        />
      )}

      {/* Sidebar */}
      <aside className={`
        fixed lg:static inset-y-0 left-0 z-50 w-64 bg-gray-900/80 backdrop-blur-xl border-r border-white/10
        flex flex-col transform transition-transform duration-300 ease-in-out
        ${sidebarOpen ? 'translate-x-0' : '-translate-x-full lg:translate-x-0'}
      `}>
        {/* Brand */}
        <div className="p-6 border-b border-white/5">
          <h2 className="text-2xl font-black tracking-widest text-white">
            KAR<span className="text-transparent bg-clip-text bg-gradient-to-r from-orange-500 to-red-500">ZONE</span>
          </h2>
          <p className="text-[10px] uppercase tracking-[0.2em] text-orange-500/80 font-bold mt-1">
            Control Center
          </p>
        </div>

        {/* Navigation */}
        <nav className="flex-1 px-4 py-6 space-y-2 overflow-y-auto">
          {navItems.map(item => (
            <button
              key={item.key}
              onClick={() => { setActiveView(item.key); setSidebarOpen(false); }}
              className={`
                w-full flex items-center gap-3 px-4 py-3 rounded-xl transition-all duration-300
                ${activeView === item.key 
                  ? 'bg-gradient-to-r from-orange-500/20 to-transparent text-orange-500 shadow-[inset_4px_0_0_#f97316]' 
                  : 'text-gray-400 hover:bg-white/5 hover:text-white'}
              `}
            >
              <span className={`transition-transform duration-300 ${activeView === item.key ? 'scale-110' : ''}`}>
                {item.icon}
              </span>
              <span className="font-semibold text-sm tracking-wide">{item.label}</span>
            </button>
          ))}
        </nav>

        {/* Logout */}
        <div className="p-4 border-t border-white/5">
          <button 
            onClick={handleLogout}
            className="w-full flex items-center justify-center gap-2 px-4 py-3 rounded-xl text-red-400 hover:bg-red-500/10 hover:text-red-300 transition-all duration-300 font-semibold text-sm"
          >
            <FaSignOutAlt />
            Secure Logout
          </button>
        </div>
      </aside>

      {/* Main Content */}
      <main className="flex-1 flex flex-col min-w-0 bg-[radial-gradient(ellipse_at_top,_var(--tw-gradient-stops))] from-gray-900/40 via-[#0a0a0a] to-[#0a0a0a]">
        
        {/* Top Header */}
        <header className="h-20 px-6 flex items-center justify-between bg-black/20 backdrop-blur-md border-b border-white/5 z-30 sticky top-0">
          <div className="flex items-center gap-4">
            <button 
              onClick={() => setSidebarOpen(true)}
              className="lg:hidden p-2 text-gray-400 hover:text-white hover:bg-white/10 rounded-lg transition-colors"
            >
              <FaBars className="text-xl" />
            </button>
            <h1 className="text-2xl font-bold text-white tracking-wide animate-fade-in">
              {navItems.find(n => n.key === activeView)?.label || 'Dashboard'}
            </h1>
          </div>
          
          <button 
            onClick={handleRefresh}
            className={`
              flex items-center gap-2 px-4 py-2 rounded-lg bg-white/5 border border-white/10 
              text-sm font-medium text-gray-300 hover:bg-white/10 hover:text-white transition-all duration-300
              ${refreshing ? 'opacity-50 cursor-not-allowed' : ''}
            `}
          >
            <FaSyncAlt className={`${refreshing ? 'animate-spin text-orange-500' : ''}`} />
            <span className="hidden sm:inline">Refresh Data</span>
          </button>
        </header>

        {/* Dynamic View Area */}
        <div className="flex-1 p-4 sm:p-6 overflow-y-auto custom-scrollbar">
          {loading && activeView === 'dashboard' ? (
            <div className="h-full flex flex-col items-center justify-center space-y-4 animate-pulse">
              <div className="w-16 h-16 border-4 border-orange-500/20 border-t-orange-500 rounded-full animate-spin"></div>
              <p className="text-gray-400 font-medium tracking-wide">Syncing data...</p>
            </div>
          ) : (
            <div className="animate-slide-up-fade">
              {activeView === 'dashboard' && <DashboardView stats={stats} bookings={bookings} cars={cars} />}
              {activeView === 'cars' && (
                <CarsView
                  cars={cars}
                  onAdd={() => { setEditingCar(null); setCarForm({ name: '', type: '', price: '', image: '', seats: '', fuel: '', mileage: '', transmission: 'Automatic' }); setModalOpen(true); }}
                  onEdit={handleEditCar}
                  onDelete={handleDeleteCar}
                />
              )}
              {activeView === 'bookings' && <BookingsView bookings={bookings} onStatusChange={handleBookingStatus} />}
              {activeView === 'users' && <UsersView users={users} onDelete={handleDeleteUser} />}
              {activeView === 'reviews' && <ReviewsView reviews={reviews} onDelete={handleDeleteReview} />}
            </div>
          )}
        </div>
      </main>

      {/* Car Modal */}
      {modalOpen && (
        <div className="fixed inset-0 z-[60] flex items-center justify-center p-4">
          <div className="absolute inset-0 bg-black/80 backdrop-blur-sm" onClick={() => setModalOpen(false)}></div>
          <div className="relative w-full max-w-2xl bg-gray-900 border border-orange-500/30 rounded-2xl shadow-[0_0_50px_rgba(249,115,22,0.1)] overflow-hidden animate-scale-up">
            
            <div className="flex items-center justify-between px-6 py-4 border-b border-white/10 bg-black/40">
              <h3 className="text-xl font-bold text-white flex items-center gap-2">
                <FaCar className="text-orange-500" />
                {editingCar ? 'Update Vehicle' : 'Add New Vehicle'}
              </h3>
              <button 
                onClick={() => setModalOpen(false)}
                className="p-2 text-gray-400 hover:text-white hover:bg-white/10 rounded-lg transition-colors"
              >
                <FaTimes />
              </button>
            </div>

            <form onSubmit={handleCarSubmit} className="p-6 overflow-y-auto max-h-[70vh] custom-scrollbar">
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-5">
                <FormField label="Vehicle Name" value={carForm.name} onChange={v => setCarForm({...carForm, name: v})} placeholder="e.g. Tesla Model S" />
                <FormField label="Category / Type" value={carForm.type} onChange={v => setCarForm({...carForm, type: v})} placeholder="e.g. Luxury Electric" />
                <FormField label="Price per Day (₹)" value={carForm.price} onChange={v => setCarForm({...carForm, price: v})} placeholder="30000" type="number" />
                <FormField label="Seat Capacity" value={carForm.seats} onChange={v => setCarForm({...carForm, seats: v})} placeholder="5" type="number" />
                <FormField label="Fuel Type" value={carForm.fuel} onChange={v => setCarForm({...carForm, fuel: v})} placeholder="Electric / Premium" />
                <FormField label="Mileage" value={carForm.mileage} onChange={v => setCarForm({...carForm, mileage: v})} placeholder="22 MPG / Unlimited" />
                
                <div className="flex flex-col gap-1.5">
                  <label className="text-xs font-bold text-gray-400 uppercase tracking-wider">Transmission</label>
                  <select 
                    value={carForm.transmission} 
                    onChange={e => setCarForm({...carForm, transmission: e.target.value})}
                    className="w-full bg-black/50 border border-white/10 rounded-xl px-4 py-3 text-white focus:outline-none focus:border-orange-500 focus:ring-1 focus:ring-orange-500 transition-all"
                  >
                    <option value="Automatic">Automatic</option>
                    <option value="Manual">Manual</option>
                  </select>
                </div>
              </div>
              
              <div className="mt-5">
                <FormField label="Image URL" value={carForm.image} onChange={v => setCarForm({...carForm, image: v})} placeholder="https://example.com/image.jpg" />
              </div>
              
              {carForm.image && (
                <div className="mt-4 rounded-xl overflow-hidden border border-white/10 relative group h-48 bg-black/50">
                  <img src={carForm.image} alt="Preview" className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-105" onError={e => e.target.style.display = 'none'} />
                  <div className="absolute inset-0 bg-gradient-to-t from-black/80 to-transparent flex items-end p-4 opacity-0 group-hover:opacity-100 transition-opacity duration-300">
                    <p className="text-white text-sm font-medium">Image Preview</p>
                  </div>
                </div>
              )}
              
              <div className="mt-8">
                <button type="submit" className="w-full bg-gradient-to-r from-orange-600 to-red-600 hover:from-orange-500 hover:to-red-500 text-white font-bold py-4 rounded-xl shadow-lg shadow-orange-500/25 transition-all duration-300 hover:shadow-orange-500/40 hover:-translate-y-1">
                  {editingCar ? 'SAVE CHANGES' : 'ADD VEHICLE TO FLEET'}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};

// ═══════════════════════════════════════════════════════════════
// UI COMPONENTS
// ═══════════════════════════════════════════════════════════════

const FormField = ({ label, value, onChange, placeholder, type = 'text' }) => (
  <div className="flex flex-col gap-1.5">
    <label className="text-xs font-bold text-gray-400 uppercase tracking-wider">{label}</label>
    <input 
      type={type} 
      value={value} 
      onChange={e => onChange(e.target.value)} 
      placeholder={placeholder} 
      className="w-full bg-black/50 border border-white/10 rounded-xl px-4 py-3 text-white focus:outline-none focus:border-orange-500 focus:ring-1 focus:ring-orange-500 transition-all placeholder:text-gray-600"
      required 
    />
  </div>
);

const EmptyState = ({ icon, title, message }) => (
  <div className="flex flex-col items-center justify-center py-20 px-4 text-center animate-fade-in">
    <div className="w-24 h-24 mb-6 rounded-full bg-white/5 flex items-center justify-center text-gray-600">
      {icon}
    </div>
    <h3 className="text-xl font-bold text-white mb-2">{title}</h3>
    <p className="text-gray-400 max-w-sm">{message}</p>
  </div>
);

// ═══════════════════════════════════════════════════════════════
// VIEWS
// ═══════════════════════════════════════════════════════════════

const DashboardView = ({ stats, bookings, cars }) => {
  if (!stats) return null;
  const cards = [
    { label: 'Total Revenue', value: `₹${(stats.totalRevenue || 0).toLocaleString()}`, color: 'text-emerald-400', bg: 'bg-emerald-400/10', border: 'border-emerald-400/20', icon: <FaRupeeSign className="text-2xl" /> },
    { label: 'Active Bookings', value: stats.totalBookings, color: 'text-blue-400', bg: 'bg-blue-400/10', border: 'border-blue-400/20', icon: <FaClipboardList className="text-2xl" /> },
    { label: 'Registered Users', value: stats.totalUsers, color: 'text-purple-400', bg: 'bg-purple-400/10', border: 'border-purple-400/20', icon: <FaUsers className="text-2xl" /> },
    { label: 'Fleet Size', value: stats.totalCars, color: 'text-orange-400', bg: 'bg-orange-400/10', border: 'border-orange-400/20', icon: <FaCar className="text-2xl" /> },
  ];

  // Process data for charts
  
  // 1. Revenue over time (last 7 days logic simplified to grouping by date)
  const revenueData = [];
  if (bookings && bookings.length > 0) {
    const datesMap = {};
    // Sort bookings by date
    const sortedBookings = [...bookings].sort((a, b) => new Date(a.createdAt) - new Date(b.createdAt));
    sortedBookings.forEach(b => {
      const date = new Date(b.createdAt).toLocaleDateString('en-US', { month: 'short', day: 'numeric' });
      if (!datesMap[date]) datesMap[date] = { date, revenue: 0, bookings: 0 };
      if (b.status !== 'cancelled') {
        datesMap[date].revenue += b.totalPrice || 0;
      }
      datesMap[date].bookings += 1;
    });
    revenueData.push(...Object.values(datesMap).slice(-15)); // Show last 15 days of activity
  }

  // 2. Booking Status for Donut Chart
  const statusData = [
    { name: 'Confirmed', value: stats.bookingsByStatus?.confirmed || 0, color: '#3b82f6' }, // Blue
    { name: 'Completed', value: stats.bookingsByStatus?.completed || 0, color: '#10b981' }, // Emerald
    { name: 'Cancelled', value: stats.bookingsByStatus?.cancelled || 0, color: '#ef4444' }, // Red
  ].filter(d => d.value > 0);

  // 3. Fleet Composition
  const fleetDataMap = {};
  cars.forEach(car => {
    const type = car.type || 'Uncategorized';
    if (!fleetDataMap[type]) fleetDataMap[type] = 0;
    fleetDataMap[type] += 1;
  });
  const fleetData = Object.keys(fleetDataMap).map(type => ({
    name: type,
    value: fleetDataMap[type]
  }));

  // 4. Top Revenue Vehicles
  const topVehiclesMap = {};
  if (bookings && bookings.length > 0) {
    bookings.forEach(b => {
      if (b.status !== 'cancelled') {
        const carName = b.carName || 'Unknown Car';
        if (!topVehiclesMap[carName]) topVehiclesMap[carName] = 0;
        topVehiclesMap[carName] += (b.totalPrice || 0);
      }
    });
  }
  const topVehiclesData = Object.keys(topVehiclesMap)
    .map(name => ({ name, revenue: topVehiclesMap[name] }))
    .sort((a, b) => b.revenue - a.revenue)
    .slice(0, 5); // Show top 5 vehicles

  const PIE_COLORS = ['#f97316', '#8b5cf6', '#3b82f6', '#10b981', '#f43f5e', '#eab308'];

  return (
    <div className="space-y-8">
      {/* Stat Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
        {cards.map((card, i) => (
          <div key={i} className={`p-6 rounded-2xl bg-white/5 border ${card.border} backdrop-blur-md hover:bg-white/10 transition-all duration-300 hover:-translate-y-1 group`}>
            <div className="flex items-center gap-4">
              <div className={`w-14 h-14 rounded-xl flex items-center justify-center ${card.bg} ${card.color} group-hover:scale-110 transition-transform duration-300`}>
                {card.icon}
              </div>
              <div>
                <p className="text-sm font-medium text-gray-400 mb-1">{card.label}</p>
                <p className={`text-3xl font-black ${card.color}`}>{card.value}</p>
              </div>
            </div>
          </div>
        ))}
      </div>

      {/* Analytics Charts */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        
        {/* Main Revenue Chart */}
        <div className="lg:col-span-2 p-6 rounded-2xl bg-white/5 border border-white/10 backdrop-blur-md">
          <h3 className="text-lg font-bold text-white mb-6 flex items-center gap-2">
            <FaChartLine className="text-orange-500" />
            Revenue & Bookings Trend
          </h3>
          {revenueData.length > 0 ? (
            <div className="h-72">
              <ResponsiveContainer width="100%" height="100%">
                <AreaChart data={revenueData} margin={{ top: 10, right: 10, left: -20, bottom: 0 }}>
                  <defs>
                    <linearGradient id="colorRevenue" x1="0" y1="0" x2="0" y2="1">
                      <stop offset="5%" stopColor="#10b981" stopOpacity={0.3}/>
                      <stop offset="95%" stopColor="#10b981" stopOpacity={0}/>
                    </linearGradient>
                  </defs>
                  <CartesianGrid strokeDasharray="3 3" stroke="#ffffff10" vertical={false} />
                  <XAxis dataKey="date" stroke="#9ca3af" fontSize={12} tickLine={false} axisLine={false} />
                  <YAxis yAxisId="left" stroke="#10b981" fontSize={12} tickLine={false} axisLine={false} tickFormatter={(value) => `₹${value/1000}k`} />
                  <YAxis yAxisId="right" orientation="right" stroke="#3b82f6" fontSize={12} tickLine={false} axisLine={false} />
                  <Tooltip 
                    contentStyle={{ backgroundColor: '#111827', borderColor: '#ffffff20', borderRadius: '8px', color: '#fff' }}
                    itemStyle={{ color: '#fff' }}
                  />
                  <Area yAxisId="left" type="monotone" dataKey="revenue" name="Revenue (₹)" stroke="#10b981" strokeWidth={3} fillOpacity={1} fill="url(#colorRevenue)" />
                  <Area yAxisId="right" type="monotone" dataKey="bookings" name="Bookings" stroke="#3b82f6" strokeWidth={2} fillOpacity={0} />
                </AreaChart>
              </ResponsiveContainer>
            </div>
          ) : (
            <div className="h-72 flex items-center justify-center text-gray-500">Not enough data to display trends.</div>
          )}
        </div>

        {/* Status Donut Chart */}
        <div className="p-6 rounded-2xl bg-white/5 border border-white/10 backdrop-blur-md flex flex-col">
          <h3 className="text-lg font-bold text-white mb-2 flex items-center gap-2">
            <FaClipboardList className="text-blue-500" />
            Booking Status
          </h3>
          {statusData.length > 0 ? (
            <div className="flex-1 min-h-[250px]">
              <ResponsiveContainer width="100%" height="100%">
                <PieChart>
                  <Pie
                    data={statusData}
                    cx="50%"
                    cy="50%"
                    innerRadius={60}
                    outerRadius={80}
                    paddingAngle={5}
                    dataKey="value"
                    stroke="none"
                  >
                    {statusData.map((entry, index) => (
                      <Cell key={`cell-${index}`} fill={entry.color} />
                    ))}
                  </Pie>
                  <Tooltip 
                    contentStyle={{ backgroundColor: '#111827', borderColor: '#ffffff20', borderRadius: '8px', color: '#fff' }}
                    itemStyle={{ color: '#fff' }}
                  />
                  <Legend verticalAlign="bottom" height={36} iconType="circle" />
                </PieChart>
              </ResponsiveContainer>
            </div>
          ) : (
            <div className="flex-1 flex items-center justify-center text-gray-500">No bookings yet.</div>
          )}
        </div>

        {/* Fleet Composition */}
        <div className="p-6 rounded-2xl bg-white/5 border border-white/10 backdrop-blur-md flex flex-col">
          <h3 className="text-lg font-bold text-white mb-2 flex items-center gap-2">
            <FaCar className="text-orange-500" />
            Fleet Composition
          </h3>
          {fleetData.length > 0 ? (
            <div className="flex-1 min-h-[250px]">
              <ResponsiveContainer width="100%" height="100%">
                <PieChart>
                  <Pie
                    data={fleetData}
                    cx="50%"
                    cy="50%"
                    outerRadius={80}
                    dataKey="value"
                    stroke="none"
                  >
                    {fleetData.map((entry, index) => (
                      <Cell key={`cell-${index}`} fill={PIE_COLORS[index % PIE_COLORS.length]} />
                    ))}
                  </Pie>
                  <Tooltip 
                    contentStyle={{ backgroundColor: '#111827', borderColor: '#ffffff20', borderRadius: '8px', color: '#fff' }}
                    itemStyle={{ color: '#fff' }}
                  />
                  <Legend verticalAlign="bottom" height={36} iconType="circle" />
                </PieChart>
              </ResponsiveContainer>
            </div>
          ) : (
            <div className="flex-1 flex items-center justify-center text-gray-500">No cars in fleet.</div>
          )}
        </div>

        {/* Top Vehicles Chart */}
        <div className="lg:col-span-2 p-6 rounded-2xl bg-white/5 border border-white/10 backdrop-blur-md flex flex-col">
          <h3 className="text-lg font-bold text-white mb-2 flex items-center gap-2">
            <FaStar className="text-yellow-500" />
            Top Revenue Generating Vehicles
          </h3>
          {topVehiclesData.length > 0 ? (
            <div className="flex-1 min-h-[250px]">
              <ResponsiveContainer width="100%" height="100%">
                <BarChart data={topVehiclesData} layout="vertical" margin={{ top: 10, right: 30, left: 30, bottom: 0 }}>
                  <CartesianGrid strokeDasharray="3 3" stroke="#ffffff10" horizontal={false} />
                  <XAxis type="number" stroke="#9ca3af" fontSize={12} tickLine={false} axisLine={false} tickFormatter={(value) => `₹${value/1000}k`} />
                  <YAxis dataKey="name" type="category" stroke="#9ca3af" fontSize={12} tickLine={false} axisLine={false} width={120} />
                  <Tooltip 
                    contentStyle={{ backgroundColor: '#111827', borderColor: '#ffffff20', borderRadius: '8px', color: '#fff' }}
                    itemStyle={{ color: '#f97316' }}
                    formatter={(value) => [`₹${value.toLocaleString()}`, 'Revenue']}
                  />
                  <Bar dataKey="revenue" fill="#f97316" radius={[0, 4, 4, 0]}>
                    {topVehiclesData.map((entry, index) => (
                      <Cell key={`cell-${index}`} fill={PIE_COLORS[index % PIE_COLORS.length]} />
                    ))}
                  </Bar>
                </BarChart>
              </ResponsiveContainer>
            </div>
          ) : (
            <div className="flex-1 flex items-center justify-center text-gray-500">No revenue data available yet.</div>
          )}
        </div>
      </div>
    </div>
  );
};

const CarsView = ({ cars, onAdd, onEdit, onDelete }) => (
  <div className="space-y-6">
    <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4 bg-white/5 p-4 rounded-2xl border border-white/10 backdrop-blur-sm">
      <div>
        <h2 className="text-xl font-bold text-white">Fleet Inventory</h2>
        <p className="text-sm text-gray-400 mt-1">{cars.length} vehicles currently available</p>
      </div>
      <button 
        onClick={onAdd} 
        className="flex items-center gap-2 px-5 py-2.5 bg-orange-600 hover:bg-orange-500 text-white text-sm font-bold rounded-xl transition-all duration-300 shadow-[0_0_15px_rgba(249,115,22,0.3)] hover:shadow-[0_0_25px_rgba(249,115,22,0.5)] hover:-translate-y-0.5"
      >
        <FaPlus /> Add Vehicle
      </button>
    </div>

    {cars.length === 0 ? (
      <EmptyState 
        icon={<FaCar className="text-5xl" />}
        title="Your Fleet is Empty"
        message="You haven't added any vehicles yet. Click the 'Add Vehicle' button above to populate your inventory."
      />
    ) : (
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
        {cars.map((car, idx) => (
          <div key={car._id} className="group rounded-2xl bg-white/5 border border-white/10 overflow-hidden hover:border-orange-500/30 transition-all duration-300 hover:bg-white/10 flex flex-col animate-fade-in-up" style={{animationDelay: `${idx * 50}ms`}}>
            <div className="h-48 relative overflow-hidden bg-black">
              <img src={car.image} alt={car.name} className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-110" onError={e => e.target.src = 'https://via.placeholder.com/400x300?text=No+Image'} />
              <div className="absolute inset-0 bg-gradient-to-t from-black/90 via-black/20 to-transparent"></div>
              
              <div className="absolute top-3 right-3 flex gap-2">
                <button onClick={() => onEdit(car)} className="p-2 bg-blue-500/80 hover:bg-blue-500 text-white rounded-lg backdrop-blur-md transition-colors shadow-lg">
                  <FaEdit />
                </button>
                <button onClick={() => onDelete(car._id)} className="p-2 bg-red-500/80 hover:bg-red-500 text-white rounded-lg backdrop-blur-md transition-colors shadow-lg">
                  <FaTrash />
                </button>
              </div>

              <div className="absolute bottom-3 left-3 right-3">
                <span className="px-2.5 py-1 text-[10px] font-bold uppercase tracking-wider bg-orange-500/90 text-white rounded-md backdrop-blur-sm">
                  {car.type}
                </span>
                <h3 className="text-lg font-bold text-white mt-2 truncate">{car.name}</h3>
              </div>
            </div>
            
            <div className="p-4 flex-1 flex flex-col justify-between">
              <div className="grid grid-cols-2 gap-3 mb-4">
                <div className="flex flex-col">
                  <span className="text-[10px] text-gray-500 uppercase font-bold">Price / Day</span>
                  <span className="text-emerald-400 font-bold">₹{car.price.toLocaleString()}</span>
                </div>
                <div className="flex flex-col">
                  <span className="text-[10px] text-gray-500 uppercase font-bold">Seats</span>
                  <span className="text-gray-300 font-medium">{car.seats}</span>
                </div>
                <div className="flex flex-col">
                  <span className="text-[10px] text-gray-500 uppercase font-bold">Fuel</span>
                  <span className="text-gray-300 font-medium">{car.fuel}</span>
                </div>
                <div className="flex flex-col">
                  <span className="text-[10px] text-gray-500 uppercase font-bold">Status</span>
                  <span className={`${car.isActive ? 'text-emerald-400' : 'text-red-400'} font-medium`}>
                    {car.isActive ? 'Active' : 'Inactive'}
                  </span>
                </div>
              </div>
            </div>
          </div>
        ))}
      </div>
    )}
  </div>
);

const BookingsView = ({ bookings, onStatusChange }) => (
  <div className="space-y-6">
    <div className="bg-white/5 p-4 rounded-2xl border border-white/10 backdrop-blur-sm">
      <h2 className="text-xl font-bold text-white">Booking Management</h2>
      <p className="text-sm text-gray-400 mt-1">{bookings.length} total reservations</p>
    </div>

    {bookings.length === 0 ? (
      <EmptyState 
        icon={<FaClipboardList className="text-5xl" />}
        title="No Bookings Yet"
        message="When customers rent your vehicles, their reservations will appear here."
      />
    ) : (
      <div className="bg-white/5 rounded-2xl border border-white/10 overflow-hidden backdrop-blur-md">
        <div className="overflow-x-auto">
          <table className="w-full text-left border-collapse">
            <thead>
              <tr className="bg-black/40 text-xs uppercase tracking-wider text-gray-400 border-b border-white/10">
                <th className="p-4 font-semibold">Customer</th>
                <th className="p-4 font-semibold">Vehicle</th>
                <th className="p-4 font-semibold">Duration</th>
                <th className="p-4 font-semibold">Total</th>
                <th className="p-4 font-semibold">Status</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-white/5">
              {bookings.map((b, i) => (
                <tr key={b._id} className="hover:bg-white/5 transition-colors duration-200 animate-fade-in-up" style={{animationDelay: `${i * 30}ms`}}>
                  <td className="p-4">
                    <div className="font-bold text-white">{b.fullName}</div>
                    <div className="text-xs text-gray-400 mt-1">{b.email}</div>
                  </td>
                  <td className="p-4">
                    <div className="font-bold text-orange-400">{b.carName}</div>
                    <div className="text-[10px] text-gray-500 uppercase mt-1">{b.paymentMethod || 'Card'}</div>
                  </td>
                  <td className="p-4">
                    <div className="text-sm text-gray-300">{new Date(b.pickupDate).toLocaleDateString()}</div>
                    <div className="text-xs text-gray-500 mt-1">to {new Date(b.returnDate).toLocaleDateString()}</div>
                  </td>
                  <td className="p-4 font-bold text-emerald-400">
                    ₹{b.totalPrice?.toLocaleString()}
                  </td>
                  <td className="p-4">
                    <select
                      value={b.status}
                      onChange={e => onStatusChange(b._id, e.target.value)}
                      className={`
                        text-xs font-bold uppercase tracking-wider px-3 py-1.5 rounded-lg border focus:outline-none appearance-none cursor-pointer
                        ${b.status === 'confirmed' ? 'bg-blue-500/10 text-blue-400 border-blue-500/30' : 
                          b.status === 'completed' ? 'bg-emerald-500/10 text-emerald-400 border-emerald-500/30' : 
                          'bg-red-500/10 text-red-400 border-red-500/30'}
                      `}
                    >
                      <option value="confirmed" className="bg-gray-900 text-blue-400">Confirmed</option>
                      <option value="completed" className="bg-gray-900 text-emerald-400">Completed</option>
                      <option value="cancelled" className="bg-gray-900 text-red-400">Cancelled</option>
                    </select>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    )}
  </div>
);

const UsersView = ({ users, onDelete }) => (
  <div className="space-y-6">
    <div className="bg-white/5 p-4 rounded-2xl border border-white/10 backdrop-blur-sm">
      <h2 className="text-xl font-bold text-white">User Directory</h2>
      <p className="text-sm text-gray-400 mt-1">{users.length} registered accounts</p>
    </div>

    {users.length === 0 ? (
      <EmptyState 
        icon={<FaUsers className="text-5xl" />}
        title="No Users Registered"
        message="When customers sign up for an account, they will be listed here."
      />
    ) : (
      <div className="bg-white/5 rounded-2xl border border-white/10 overflow-hidden backdrop-blur-md">
        <div className="overflow-x-auto">
          <table className="w-full text-left border-collapse">
            <thead>
              <tr className="bg-black/40 text-xs uppercase tracking-wider text-gray-400 border-b border-white/10">
                <th className="p-4 font-semibold">User Profile</th>
                <th className="p-4 font-semibold">Email Address</th>
                <th className="p-4 font-semibold">Join Date</th>
                <th className="p-4 font-semibold text-right">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-white/5">
              {users.map((u, i) => (
                <tr key={u._id} className="hover:bg-white/5 transition-colors duration-200 animate-fade-in-up" style={{animationDelay: `${i * 30}ms`}}>
                  <td className="p-4">
                    <div className="flex items-center gap-3">
                      <div className="w-10 h-10 rounded-full bg-gradient-to-br from-orange-500 to-red-500 flex items-center justify-center text-white font-bold text-lg shadow-lg">
                        {u.fullName?.charAt(0)?.toUpperCase()}
                      </div>
                      <span className="font-bold text-white">{u.fullName}</span>
                    </div>
                  </td>
                  <td className="p-4 text-gray-300">{u.email}</td>
                  <td className="p-4 text-gray-400 text-sm">{new Date(u.createdAt).toLocaleDateString()}</td>
                  <td className="p-4 text-right">
                    <button 
                      onClick={() => onDelete(u._id)}
                      className="p-2 text-gray-400 hover:text-red-400 hover:bg-red-400/10 rounded-lg transition-all"
                      title="Delete User"
                    >
                      <FaTrash />
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    )}
  </div>
);

const ReviewsView = ({ reviews, onDelete }) => (
  <div className="space-y-6">
    <div className="bg-white/5 p-4 rounded-2xl border border-white/10 backdrop-blur-sm">
      <h2 className="text-xl font-bold text-white">Customer Feedback</h2>
      <p className="text-sm text-gray-400 mt-1">{reviews.length} total reviews published</p>
    </div>

    {reviews.length === 0 ? (
      <EmptyState 
        icon={<FaStar className="text-5xl" />}
        title="No Reviews Yet"
        message="Customer reviews and ratings for your vehicles will appear here."
      />
    ) : (
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {reviews.map((r, i) => (
          <div key={r._id} className="bg-white/5 border border-white/10 rounded-2xl p-5 hover:bg-white/10 transition-colors animate-fade-in-up flex flex-col" style={{animationDelay: `${i * 40}ms`}}>
            <div className="flex justify-between items-start mb-4">
              <div>
                <h4 className="text-orange-400 font-bold truncate pr-4">{r.carName}</h4>
                <div className="flex items-center gap-1 mt-1 text-yellow-400 text-sm">
                  {Array(r.rating).fill(0).map((_, idx) => <FaStar key={idx} />)}
                  {Array(5 - r.rating).fill(0).map((_, idx) => <FaStar key={idx} className="text-gray-700" />)}
                </div>
              </div>
              <button 
                onClick={() => onDelete(r._id)}
                className="text-gray-500 hover:text-red-400 transition-colors p-1"
                title="Delete Review"
              >
                <FaTrash className="text-sm" />
              </button>
            </div>
            
            <p className="text-gray-300 text-sm italic mb-4 flex-1">"{r.comment}"</p>
            
            <div className="flex items-center justify-between pt-4 border-t border-white/5 mt-auto">
              <span className="text-xs font-bold text-gray-400 uppercase">{r.user?.fullName || 'Anonymous User'}</span>
              <span className="text-xs text-gray-500">{new Date(r.createdAt).toLocaleDateString()}</span>
            </div>
          </div>
        ))}
      </div>
    )}
  </div>
);

// Inject global animation classes
if (typeof document !== 'undefined') {
  const existingStyle = document.getElementById('admin-animations');
  if (!existingStyle) {
    const styleEl = document.createElement('style');
    styleEl.id = 'admin-animations';
    styleEl.textContent = `
      @keyframes fadeInUp {
        from { opacity: 0; transform: translateY(20px); }
        to { opacity: 1; transform: translateY(0); }
      }
      @keyframes fadeIn {
        from { opacity: 0; }
        to { opacity: 1; }
      }
      @keyframes scaleUp {
        from { opacity: 0; transform: scale(0.95); }
        to { opacity: 1; transform: scale(1); }
      }
      .animate-fade-in-up {
        animation: fadeInUp 0.5s cubic-bezier(0.16, 1, 0.3, 1) forwards;
        opacity: 0;
      }
      .animate-fade-in {
        animation: fadeIn 0.4s ease-out forwards;
      }
      .animate-scale-up {
        animation: scaleUp 0.3s cubic-bezier(0.16, 1, 0.3, 1) forwards;
      }
      .custom-scrollbar::-webkit-scrollbar {
        width: 8px;
        height: 8px;
      }
      .custom-scrollbar::-webkit-scrollbar-track {
        background: transparent;
      }
      .custom-scrollbar::-webkit-scrollbar-thumb {
        background: rgba(255, 255, 255, 0.1);
        border-radius: 4px;
      }
      .custom-scrollbar::-webkit-scrollbar-thumb:hover {
        background: rgba(249, 115, 22, 0.5);
      }
    `;
    document.head.appendChild(styleEl);
  }
}

export default AdminDashboard;
