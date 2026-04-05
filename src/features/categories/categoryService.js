import { firestoreApi } from '../../api/axiosInstance';
import ENDPOINTS from '../../api/endpoints';

const mapFirestoreDoc = (doc) => ({
  id: doc.name.split('/').pop(),
  name: doc.fields?.name?.stringValue || '',
  imageUrl: doc.fields?.imageUrl?.stringValue || '',
  description: doc.fields?.description?.stringValue || '',
  subcategories: doc.fields?.subcategories?.arrayValue?.values?.map(v => v.stringValue) || [],
});

const getCategories = async (pageSize = 100, pageToken = '') => {
  const url = `${ENDPOINTS.FIRESTORE.CATEGORIES}?pageSize=${pageSize}${pageToken ? `&pageToken=${pageToken}` : ''}`;
  const response = await firestoreApi.get(url);
  return {
    items: response.data.documents?.map(mapFirestoreDoc) || [],
    nextPageToken: response.data.nextPageToken,
  };
};

const getCategoryById = async (id) => {
  const response = await firestoreApi.get(`${ENDPOINTS.FIRESTORE.CATEGORIES}/${id}`);
  return mapFirestoreDoc(response.data);
};

const createCategory = async (data) => {
  const payload = {
    fields: {
      name: { stringValue: data.name },
      imageUrl: { stringValue: data.imageUrl || '' },
      description: { stringValue: data.description || '' },
      subcategories: {
        arrayValue: {
          values: data.subcategories?.map(sub => ({ stringValue: sub })) || []
        }
      }
    },
  };
  const response = await firestoreApi.post(ENDPOINTS.FIRESTORE.CATEGORIES, payload);
  return mapFirestoreDoc(response.data);
};

const updateCategory = async (id, data) => {
  const payload = {
    fields: {
      name: { stringValue: data.name },
      imageUrl: { stringValue: data.imageUrl || '' },
      description: { stringValue: data.description || '' },
      subcategories: {
        arrayValue: {
          values: data.subcategories?.map(sub => ({ stringValue: sub })) || []
        }
      }
    },
  };
  const updateMask = 'updateMask.fieldPaths=name&updateMask.fieldPaths=imageUrl&updateMask.fieldPaths=description&updateMask.fieldPaths=subcategories';
  const response = await firestoreApi.patch(`${ENDPOINTS.FIRESTORE.CATEGORIES}/${id}?${updateMask}`, payload);
  return mapFirestoreDoc(response.data);
};

const deleteCategory = async (id) => {
  await firestoreApi.delete(`${ENDPOINTS.FIRESTORE.CATEGORIES}/${id}`);
  return id;
};

export { getCategories, getCategoryById, createCategory, updateCategory, deleteCategory };
