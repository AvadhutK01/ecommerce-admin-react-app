import { firestoreApi } from '../../api/axiosInstance';
import ENDPOINTS from '../../api/endpoints';

const getAdminProfile = async (uid) => {
  try {
    const response = await firestoreApi.get(`${ENDPOINTS.FIRESTORE.ADMINS}/${uid}`);
    const fields = response.data.fields;
    return {
      name: fields?.name?.stringValue || '',
    };
  } catch (error) {
    if (error.response?.status === 404) {
      return null;
    }
    throw error;
  }
};

const updateAdminProfile = async (uid, name) => {
  const data = {
    fields: {
      name: { stringValue: name },
    },
  };
  const response = await firestoreApi.patch(`${ENDPOINTS.FIRESTORE.ADMINS}/${uid}?updateMask.fieldPaths=name`, data);
  return response.data;
};

export { getAdminProfile, updateAdminProfile };
