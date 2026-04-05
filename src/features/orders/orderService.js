import { firestoreApi } from '../../api/axiosInstance';
import ENDPOINTS from '../../api/endpoints';

const transformDoc = (doc) => {
  const fields = doc.fields;
  const id = doc.name.split('/').pop();
  return {
    id,
    orderNumber: fields?.orderNumber?.stringValue || '',
    customerId: fields?.customerId?.stringValue || fields?.userId?.stringValue || '',
    customerName: fields?.customerName?.stringValue || '',
    customerEmail: fields?.customerEmail?.stringValue || '',
    totalAmount: Number(fields?.totalAmount?.doubleValue || fields?.totalAmount?.integerValue || 0),
    status: fields?.status?.stringValue || 'pending',
    paymentStatus: fields?.paymentStatus?.stringValue || 'pending',
    paymentMethod: fields?.paymentMethod?.stringValue || '',
    paymentId: fields?.paymentId?.stringValue || '',
    createdAt: fields?.createdAt?.stringValue || fields?.createdAt?.timestampValue || '',
    items: fields?.items?.arrayValue?.values?.map(v => {
      const f = v.mapValue.fields;
      return {
        productId: f.id?.stringValue || '',
        name: f.name?.stringValue || '',
        price: Number(f.price?.doubleValue || f.price?.integerValue || 0),
        quantity: Number(f.quantity?.doubleValue || f.quantity?.integerValue || 0),
        thumbnail: f.thumbnail?.stringValue || ''
      };
    }) || [],
    shippingAddress: {
      name: fields?.shippingAddress?.mapValue?.fields?.name?.stringValue || '',
      street: fields?.shippingAddress?.mapValue?.fields?.street?.stringValue || '',
      city: fields?.shippingAddress?.mapValue?.fields?.city?.stringValue || '',
      state: fields?.shippingAddress?.mapValue?.fields?.state?.stringValue || '',
      zip: fields?.shippingAddress?.mapValue?.fields?.zip?.stringValue || '',
      phone: fields?.shippingAddress?.mapValue?.fields?.phone?.stringValue || ''
    }
  };
};

const getOrders = async (pageSize = 10, pageToken = '') => {
  try {
    const params = {
      pageSize,
      orderBy: 'createdAt desc'
    };
    if (pageToken) params.pageToken = pageToken;
    const response = await firestoreApi.get(ENDPOINTS.FIRESTORE.ORDERS, { params });
    return {
      documents: response.data.documents?.map(transformDoc) || [],
      nextPageToken: response.data.nextPageToken || null
    };
  } catch (error) {
    if (error.response?.status === 404) return { documents: [], nextPageToken: null };
    throw error;
  }
};

const getOrderById = async (id) => {
  const response = await firestoreApi.get(`${ENDPOINTS.FIRESTORE.ORDERS}/${id}`);
  return transformDoc(response.data);
};

const getOrdersByCustomer = async (customerId) => {
  const query = {
    structuredQuery: {
      from: [{ collectionId: 'orders' }],
      where: {
        fieldFilter: {
          field: { fieldPath: 'userId' },
          op: 'EQUAL',
          value: { stringValue: customerId }
        }
      }
    }
  };
  try {
    const response = await firestoreApi.post(':runQuery', query);
    const results = response.data
      .filter(item => item.document)
      .map(item => transformDoc(item.document));
    return results.sort((a, b) => new Date(b.createdAt) - new Date(a.createdAt));
  } catch (error) {
    console.error("Query by userId failed, attempting customerId fallback", error);
    query.structuredQuery.where.fieldFilter.field.fieldPath = 'customerId';
    const response2 = await firestoreApi.post(':runQuery', query);
    const results2 = response2.data
      .filter(item => item.document)
      .map(item => transformDoc(item.document));
    return results2.sort((a, b) => new Date(b.createdAt) - new Date(a.createdAt));
  }
};

const updateOrderStatus = async (id, status) => {
  const payload = {
    fields: {
      status: { stringValue: status }
    }
  };
  const response = await firestoreApi.patch(`${ENDPOINTS.FIRESTORE.ORDERS}/${id}?updateMask.fieldPaths=status`, payload);
  return transformDoc(response.data);
};

const updatePaymentStatus = async (id, status) => {
  const payload = {
    fields: {
      paymentStatus: { stringValue: status }
    }
  };
  const response = await firestoreApi.patch(`${ENDPOINTS.FIRESTORE.ORDERS}/${id}?updateMask.fieldPaths=paymentStatus`, payload);
  return transformDoc(response.data);
};

export { getOrders, getOrderById, getOrdersByCustomer, updateOrderStatus, updatePaymentStatus };
