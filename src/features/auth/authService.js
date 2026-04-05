import { authApi } from '../../api/axiosInstance';
import ENDPOINTS from '../../api/endpoints';

const loginUser = async (email, password) => {
  const response = await authApi.post(ENDPOINTS.AUTH.LOGIN, {
    email,
    password,
    returnSecureToken: true,
  });

  const { idToken, localId, displayName } = response.data;
  const user = {
    uid: localId,
    email,
    displayName: displayName || email.split('@')[0],
  };

  localStorage.setItem('token', idToken);
  localStorage.setItem('user', JSON.stringify(user));

  return { token: idToken, user };
};

const resetPassword = async (email) => {
  await authApi.post(ENDPOINTS.AUTH.RESET_PASSWORD, {
    requestType: 'PASSWORD_RESET',
    email,
  });
};

export { loginUser, resetPassword };
