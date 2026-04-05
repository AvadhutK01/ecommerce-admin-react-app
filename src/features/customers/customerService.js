import { firestoreApi } from '../../api/axiosInstance';
import ENDPOINTS from '../../api/endpoints';
import { getOrdersByCustomer } from '../orders/orderService';

const transformDoc = (doc) => {
  const fields = doc.fields;
  const id = doc.name.split('/').pop();
  return {
    id,
    name: fields?.name?.stringValue || '',
    email: fields?.email?.stringValue || '',
    phone: fields?.phone?.stringValue || '',
    totalOrders: Number(fields?.totalOrders?.integerValue || 0),
    totalSpent: Number(fields?.totalSpent?.doubleValue || fields?.totalSpent?.integerValue || 0),
    status: fields?.status?.stringValue || 'active',
    createdAt: fields?.createdAt?.stringValue || fields?.createdAt?.timestampValue || ''
  };
};

const augmentCustomerStats = async (customer) => {
  try {
    const orders = await getOrdersByCustomer(customer.id);
    const validOrders = orders.filter(o => 
      !['rejected', 'cancelled'].includes(o.status?.toLowerCase() || '') && 
      !['failed', 'pending', 'refunded'].includes(o.paymentStatus?.toLowerCase() || '')
    );
    customer.totalOrders = orders.length;
    customer.totalSpent = validOrders.reduce((sum, o) => sum + o.totalAmount, 0);
  } catch (error) {
    console.error(`Failed to aggregate stats for customer ${customer.id}`, error);
  }
  return customer;
};

const getCustomers = async (pageSize = 10, pageToken = '') => {
  try {
    const params = { pageSize };
    if (pageToken) params.pageToken = pageToken;
    const response = await firestoreApi.get(ENDPOINTS.FIRESTORE.CUSTOMERS, { params });
    
    let documents = response.data.documents?.map(transformDoc) || [];
    documents = await Promise.all(documents.map(augmentCustomerStats));

    return {
      documents,
      nextPageToken: response.data.nextPageToken || null
    };
  } catch (error) {
    if (error.response?.status === 404) return { documents: [], nextPageToken: null };
    throw error;
  }
};

const getCustomerById = async (id) => {
  const response = await firestoreApi.get(`${ENDPOINTS.FIRESTORE.CUSTOMERS}/${id}`);
  const customer = transformDoc(response.data);
  return await augmentCustomerStats(customer);
};

export { getCustomers, getCustomerById };
