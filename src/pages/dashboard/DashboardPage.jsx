import React, { useEffect } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { fetchDashboardData } from '../../features/dashboard/dashboardSlice';
import Loader from '../../components/common/Loader';
import { 
  AreaChart, Area, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer
} from 'recharts';
import { ShoppingBag, Users, Package, IndianRupee } from 'lucide-react';

const DashboardPage = () => {
  const dispatch = useDispatch();
  const { user } = useSelector((state) => state.auth);
  const { stats, salesData, recentOrders, recentCustomers, isLoading } = useSelector((state) => state.dashboard);

  useEffect(() => {
    dispatch(fetchDashboardData());
  }, [dispatch]);

  if (isLoading) {
    return <Loader fullPage={true} />;
  }

  const statCards = [
    { label: 'Total Revenue', value: `₹${stats.totalRevenue.toLocaleString()}`, icon: IndianRupee, color: 'text-emerald-600', bg: 'bg-emerald-50' },
    { label: 'Total Orders', value: stats.totalOrders, icon: ShoppingBag, color: 'text-blue-600', bg: 'bg-blue-50' },
    { label: 'Total Customers', value: stats.totalCustomers, icon: Users, color: 'text-purple-600', bg: 'bg-purple-50' },
    { label: 'Total Products', value: stats.totalProducts, icon: Package, color: 'text-orange-600', bg: 'bg-orange-50' },
  ];

  return (
    <div className="p-8 max-w-7xl mx-auto space-y-8 text-sm">
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <h1 className="text-3xl font-bold text-gray-900 tracking-tight">Analytics Dashboard</h1>
          <p className="text-gray-500 mt-1">Real-time overview of your e-commerce performance</p>
        </div>
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
        {statCards.map((stat, idx) => (
          <div key={idx} className="bg-white p-6 rounded-2xl border border-gray-100 shadow-sm hover:shadow-md transition-shadow duration-300">
            <div className="flex items-center justify-between mb-4">
              <div className={`p-3 rounded-xl ${stat.bg} ${stat.color}`}>
                <stat.icon className="h-6 w-6" />
              </div>
            </div>
            <p className="text-gray-500 font-medium mb-1">{stat.label}</p>
            <h3 className="text-2xl font-bold text-gray-900">{stat.value}</h3>
          </div>
        ))}
      </div>

      <div className="bg-white p-8 rounded-2xl border border-gray-100 shadow-sm">
        <div className="flex items-center justify-between mb-8">
          <div>
            <h2 className="text-lg font-bold text-gray-900">Revenue Overview</h2>
            <p className="text-xs text-gray-400 mt-1">Daily sales performance for the last 7 days</p>
          </div>
        </div>
        <div className="h-[350px] w-full">
          <ResponsiveContainer width="100%" height="100%">
            <AreaChart data={salesData} margin={{ top: 10, right: 10, left: 0, bottom: 0 }}>
              <defs>
                <linearGradient id="colorSales" x1="0" y1="0" x2="0" y2="1">
                  <stop offset="5%" stopColor="#0ea5e9" stopOpacity={0.1}/>
                  <stop offset="95%" stopColor="#0ea5e9" stopOpacity={0}/>
                </linearGradient>
              </defs>
              <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#f1f5f9" />
              <XAxis dataKey="name" axisLine={false} tickLine={false} tick={{ fill: '#94a3b8', fontSize: 12 }} dy={10} />
              <YAxis axisLine={false} tickLine={false} tick={{ fill: '#94a3b8', fontSize: 12 }} tickFormatter={(v) => `₹${v/1000}k`} />
              <Tooltip 
                contentStyle={{ borderRadius: '12px', border: 'none', boxShadow: '0 10px 15px -3px rgb(0 0 0 / 0.1)' }}
                formatter={(value) => [`₹${value.toLocaleString()}`, 'Revenue']}
              />
              <Area type="monotone" dataKey="sales" stroke="#0ea5e9" strokeWidth={3} fillOpacity={1} fill="url(#colorSales)" />
            </AreaChart>
          </ResponsiveContainer>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
        <div className="bg-white p-8 rounded-2xl border border-gray-100 shadow-sm">
          <h2 className="text-lg font-bold text-gray-900 mb-6">Recent Orders</h2>
          <div className="space-y-4">
            {recentOrders.map((order, idx) => (
              <div key={idx} className="flex items-center justify-between p-4 rounded-xl border border-gray-50 bg-gray-50/30 hover:bg-gray-50 transition-colors">
                <div className="flex items-center gap-4">
                  <div className="h-10 w-10 rounded-lg bg-white border border-gray-100 flex items-center justify-center">
                    <ShoppingBag className="h-5 w-5 text-gray-400" />
                  </div>
                  <div>
                    <p className="font-bold text-gray-900">#{order.id.slice(-6).toUpperCase()}</p>
                    <p className="text-xs text-gray-500">{order.customerName}</p>
                  </div>
                </div>
                <div className="text-right">
                  <p className="font-bold text-gray-900">₹{order.totalAmount.toLocaleString()}</p>
                  <p className="text-[10px] font-bold text-primary-600 uppercase tracking-tighter">{order.paymentStatus}</p>
                </div>
              </div>
            ))}
          </div>
        </div>

        <div className="bg-white p-8 rounded-2xl border border-gray-100 shadow-sm">
          <h2 className="text-lg font-bold text-gray-900 mb-6">New Customers</h2>
          <div className="space-y-4">
            {recentCustomers.map((customer, idx) => (
                <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 p-4 rounded-xl border border-gray-50 bg-gray-50/30 hover:bg-gray-50 transition-colors">
                  <div className="flex items-center gap-4 min-w-0">
                    <div className="h-10 w-10 rounded-full bg-primary-50 flex-shrink-0 flex items-center justify-center text-primary-600 font-bold">
                      {customer.name?.charAt(0) || '?'}
                    </div>
                    <div className="min-w-0">
                      <p className="font-bold text-gray-900 truncate">{customer.name}</p>
                      <p className="text-xs text-gray-500 truncate">{customer.email}</p>
                    </div>
                  </div>
                  <div className="text-[10px] sm:text-xs text-gray-400 font-bold uppercase tracking-widest sm:whitespace-nowrap pl-14 sm:pl-0">
                    {customer.createdAt ? new Date(customer.createdAt).toLocaleDateString('en-IN', { month: 'short', day: 'numeric', year: 'numeric' }) : '-'}
                  </div>
                </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
};

export default DashboardPage;
