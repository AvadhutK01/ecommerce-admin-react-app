import { Routes, Route } from 'react-router-dom';
import ProtectedRoute from './ProtectedRoute';
import AdminLayout from '../components/layout/AdminLayout';

import LoginPage from '../pages/auth/LoginPage';
import ForgotPasswordPage from '../pages/auth/ForgotPasswordPage';
import DashboardPage from '../pages/dashboard/DashboardPage';
import ProfilePage from '../pages/profile/ProfilePage';
import CategoriesPage from '../pages/categories/CategoriesPage';
import ProductsPage from '../pages/products/ProductsPage';
import ProductFormPage from '../pages/products/ProductFormPage';
import OrdersPage from '../pages/orders/OrdersPage';
import OrderDetailsPage from '../pages/orders/OrderDetailsPage';
import CustomersPage from '../pages/customers/CustomersPage';
import CustomerDetailsPage from '../pages/customers/CustomerDetailsPage';
import NotFoundPage from '../pages/NotFoundPage';

const AppRoutes = () => {
  return (
    <Routes>
      <Route path="/login" element={<LoginPage />} />
      <Route path="/forgot-password" element={<ForgotPasswordPage />} />

      <Route element={<ProtectedRoute />}>
        <Route element={<AdminLayout />}>
          <Route path="/" element={<DashboardPage />} />
          <Route path="/profile" element={<ProfilePage />} />
          <Route path="/categories" element={<CategoriesPage />} />
          <Route path="/products" element={<ProductsPage />} />
          <Route path="/products/add" element={<ProductFormPage />} />
          <Route path="/products/edit/:id" element={<ProductFormPage />} />
          <Route path="/products/view/:id" element={<ProductFormPage isViewOnly={true} />} />
          <Route path="/orders" element={<OrdersPage />} />
          <Route path="/orders/view/:id" element={<OrderDetailsPage />} />
          <Route path="/customers" element={<CustomersPage />} />
          <Route path="/customers/view/:id" element={<CustomerDetailsPage />} />
        </Route>
      </Route>

      <Route path="*" element={<NotFoundPage />} />
    </Routes>
  );
};

export default AppRoutes;
