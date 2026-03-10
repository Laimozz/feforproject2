export const API_BASE_URL = import.meta.env.VITE_API_BASE_URL || "http://localhost:8080/api";

export const ENDPOINTS = {
  // Auth
  REGISTER: "/auth/register",
  LOGIN: "/auth/login",
  REFRESH_TOKEN: "/auth/refresh-token",
  LOGOUT: "/auth/logout",

  // User
  PROFILE: "/user/profile",
  USERS: "/users",
  CHANGE_PASSWORD: "/user/change-password",

  // Product
  PRODUCTS: "/products",
  PRODUCT_BY_ID: (id) => `/products/${id}`,
  PRODUCTS_BY_CATEGORY: (categoryId) => `/products/category/${categoryId}`,
  PRODUCTS_BY_KEYWORD: "/products/search",

  // Category
  CATEGORIES: "/categories",
  CATEGORY_BY_ID: (id) => `/categories/${id}`,

  // Cart
  CART: "/cart",
  CART_ITEM: "/cart/items",

  // Order
  ORDERS: "/orders",
  ORDER_BY_ID: (id) => `/orders/${id}`,
  CHECKOUT: "/orders/checkout",

  // Payment
  PAYMENT: "/payment/pay",

  // Upload
  UPLOAD: "/admin/upload",

  // Admin
  ADMIN_USERS: "/admin/users",
  ADMIN_USER_BY_ID: (id) => `/admin/users/${id}`,

  //Admin Category
  ADMIN_CATEGORIES: "/admin/categories",
  ADMIN_CATEGORY_BY_ID: (id) => `/admin/categories/${id}`,

  //Admin Product
  ADMIN_PRODUCTS: "/admin/products",
  ADMIN_PRODUCT_BY_ID: (id) => `/admin/products/${id}`,


  //Admin Product
  ADMIN_PRODUCTS: "/admin/products",
  ADMIN_PRODUCT_BY_ID: (id) => `/admin/products/${id}`,

  // Admin Order
  ADMIN_ORDERS: "/admin/orders",
  ADMIN_ORDER_BY_ID: (id) => `/admin/orders/${id}`,
  ADMIN_ORDER_STATUS: (id) => `/admin/orders/${id}/status`,

};