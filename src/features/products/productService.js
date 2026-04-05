import { firestoreApi } from '../../api/axiosInstance';
import ENDPOINTS from '../../api/endpoints';

const PROJECT_ID = import.meta.env.VITE_FIREBASE_PROJECT_ID;

const transformDoc = (doc) => {
  const fields = doc.fields;
  const id = doc.name.split('/').pop();
  return {
    id,
    name: fields?.name?.stringValue || '',
    description: fields?.description?.stringValue || '',
    price: Number(fields?.price?.doubleValue || fields?.price?.integerValue || 0),
    stock: Number(fields?.stock?.integerValue || 0),
    categoryId: fields?.categoryId?.stringValue || '',
    subcategory: fields?.subcategory?.stringValue || '',
    thumbnail: fields?.thumbnail?.stringValue || '',
    images: fields?.images?.arrayValue?.values?.map(v => v.stringValue) || [],
    createdAt: doc.createTime,
    updatedAt: doc.updateTime,
  };
};

const getProductById = async (id) => {
  const response = await firestoreApi.get(`${ENDPOINTS.FIRESTORE.PRODUCTS}/${id}`);
  return transformDoc(response.data);
};

const getProducts = async (pageSize = 10, pageToken = '') => {
  try {
    const params = { pageSize };
    if (pageToken) params.pageToken = pageToken;
    const response = await firestoreApi.get(ENDPOINTS.FIRESTORE.PRODUCTS, { params });
    return {
      documents: response.data.documents?.map(transformDoc) || [],
      nextPageToken: response.data.nextPageToken || null
    };
  } catch (error) {
    if (error.response?.status === 404 || error.message?.includes('404')) {
      return { documents: [], nextPageToken: null };
    }
    throw error;
  }
};

const createProduct = async (data) => {
  const payload = {
    fields: {
      name: { stringValue: data.name },
      description: { stringValue: data.description },
      price: { doubleValue: Number(data.price) },
      stock: { integerValue: Number(data.stock) },
      categoryId: { stringValue: data.categoryId },
      subcategory: { stringValue: data.subcategory },
      thumbnail: { stringValue: data.thumbnail || '' },
      images: {
        arrayValue: {
          values: data.images?.map(img => ({ stringValue: img })) || []
        }
      }
    }
  };
  const response = await firestoreApi.post(ENDPOINTS.FIRESTORE.PRODUCTS, payload);
  return transformDoc(response.data);
};

const updateProduct = async (id, data) => {
  const payload = {
    fields: {
      name: { stringValue: data.name },
      description: { stringValue: data.description },
      price: { doubleValue: Number(data.price) },
      stock: { integerValue: Number(data.stock) },
      categoryId: { stringValue: data.categoryId },
      subcategory: { stringValue: data.subcategory },
      thumbnail: { stringValue: data.thumbnail || '' },
      images: {
        arrayValue: {
          values: data.images?.map(img => ({ stringValue: img })) || []
        }
      }
    }
  };
  const fields = ['name', 'description', 'price', 'stock', 'categoryId', 'subcategory', 'thumbnail', 'images'];
  const updateMask = fields.map(f => `updateMask.fieldPaths=${f}`).join('&');
  const response = await firestoreApi.patch(`${ENDPOINTS.FIRESTORE.PRODUCTS}/${id}?${updateMask}`, payload);
  return transformDoc(response.data);
};

const updateProductStock = async (productId, incrementAmount) => {
  if (!productId || incrementAmount === 0) return;
  const payload = {
    writes: [
      {
        transform: {
          document: `projects/${PROJECT_ID}/databases/(default)/documents/products/${productId}`,
          fieldTransforms: [
            {
              fieldPath: 'stock',
              increment: { integerValue: Number(incrementAmount) }
            }
          ]
        }
      }
    ]
  };
  try {
    await firestoreApi.post(':commit', payload);
  } catch (error) {
    console.error('Failed to update product stock:', error);
  }
};

export { getProductById, getProducts, createProduct, updateProduct, updateProductStock };
