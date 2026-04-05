import { useDispatch, useSelector } from 'react-redux';
import { useEffect } from 'react';
import { fetchAdminProfile } from './features/auth/authSlice';
import AppRoutes from './routes/AppRoutes';

function App() {
  const dispatch = useDispatch();
  const { token, user, profile } = useSelector((state) => state.auth);

  useEffect(() => {
    if (token && user?.uid && !profile) {
      dispatch(fetchAdminProfile(user.uid));
    }
  }, [token, user, profile, dispatch]);

  return <AppRoutes />;
}

export default App;
