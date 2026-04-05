import { firestoreApi } from '../../api/axiosInstance';
import ENDPOINTS from '../../api/endpoints';

const mapOrderDoc = (doc) => {
  const fields = doc.fields || {};
  return {
    id: doc.name.split('/').pop(),
    totalAmount: Number(fields.totalAmount?.doubleValue || fields.totalAmount?.integerValue || 0),
    status: fields.status?.stringValue || 'pending',
    paymentStatus: fields.paymentStatus?.stringValue || 'pending',
    createdAt: fields.createdAt?.stringValue || fields.createdAt?.timestampValue || '',
    customerName: fields.customerName?.stringValue || '',
  };
};

const mapCustomerDoc = (doc) => {
  const fields = doc.fields || {};
  return {
    id: doc.name.split('/').pop(),
    name: fields.name?.stringValue || '',
    email: fields.email?.stringValue || '',
    createdAt: fields.createdAt?.stringValue || fields.createdAt?.timestampValue || '',
  };
};

const getDashboardData = async () => {
  const [ordersRes, productsRes, customersRes] = await Promise.all([
    firestoreApi.get(`${ENDPOINTS.FIRESTORE.ORDERS}?pageSize=1000`),
    firestoreApi.get(`${ENDPOINTS.FIRESTORE.PRODUCTS}?pageSize=1000`),
    firestoreApi.get(`${ENDPOINTS.FIRESTORE.CUSTOMERS}?pageSize=1000`)
  ]);

  const orders = ordersRes.data.documents?.map(mapOrderDoc) || [];
  const customers = customersRes.data.documents?.map(mapCustomerDoc) || [];
  const totalProducts = productsRes.data.documents?.length || 0;

  const validOrders = orders.filter(o => !['rejected', 'cancelled'].includes(o.status.toLowerCase()));
  const paidOrders = validOrders.filter(o => ['paid', 'success'].includes(o.paymentStatus.toLowerCase()));

  const totalRevenue = paidOrders.reduce((sum, order) => sum + order.totalAmount, 0);

  const last7Days = [...Array(7)].map((_, i) => {
    const d = new Date();
    d.setDate(d.getDate() - i);
    return d.toISOString().split('T')[0];
  }).reverse();

  const salesData = last7Days.map(date => {
    const dailyPaidOrders = paidOrders.filter(o => o.createdAt?.startsWith(date));
    const amount = dailyPaidOrders.reduce((sum, o) => sum + o.totalAmount, 0);
    return {
      name: new Date(date).toLocaleDateString('en-IN', { weekday: 'short' }),
      sales: amount
    };
  });

  const recentOrders = [...orders]
    .sort((a, b) => new Date(b.createdAt) - new Date(a.createdAt))
    .slice(0, 5);

  const recentCustomers = [...customers]
    .sort((a, b) => new Date(b.createdAt) - new Date(a.createdAt))
    .slice(0, 5);

  return {
    stats: {
      totalRevenue,
      totalOrders: orders.length,
      totalCustomers: customers.length,
      totalProducts
    },
    salesData,
    recentOrders,
    recentCustomers
  };
};

export { getDashboardData };
