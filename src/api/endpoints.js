const ENDPOINTS = {
  AUTH: {
    LOGIN: ':signInWithPassword',
    RESET_PASSWORD: ':sendOobCode'
  },
  FIRESTORE: {
    PRODUCTS: '/products',
    CATEGORIES: '/categories',
    ORDERS: '/orders',
    CUSTOMERS: '/customers',
    ADMINS: '/admins'
  }
};

export default ENDPOINTS;
