const API_URL = 'http://localhost:5000/api';

export const loginUser = async (email, password) => {
  const response = await fetch(`${API_URL}/auth/login`, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
    },
    body: JSON.stringify({ email, password }),
  });
  
  const data = await response.json();
  if (!response.ok) {
    throw new Error(data.message || 'Login failed');
  }
  return data;
};

export const registerUser = async (userData) => {
  const response = await fetch(`${API_URL}/auth/register`, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
    },
    body: JSON.stringify(userData), // { name, phone, email, password, shopName }
  });

  const data = await response.json();
  if (!response.ok) {
    throw new Error(data.message || 'Registration failed');
  }
  return data;
};

// Utility to get auth header for protected routes
export const getAuthHeaders = () => {
  const userStr = localStorage.getItem('smilesign_user');
  if (userStr) {
    const user = JSON.parse(userStr);
    if (user.token) {
      return {
        'Content-Type': 'application/json',
        Authorization: `Bearer ${user.token}`,
      };
    }
  }
  return { 'Content-Type': 'application/json' };
};

export const getProducts = async () => {
  const response = await fetch(`${API_URL}/products`, {
    headers: getAuthHeaders(),
  });
  const data = await response.json();
  if (!response.ok) throw new Error(data.message || 'Failed to fetch products');
  return data.data;
};

export const createProduct = async (productData) => {
  const response = await fetch(`${API_URL}/products`, {
    method: 'POST',
    headers: getAuthHeaders(),
    body: JSON.stringify(productData),
  });
  const data = await response.json();
  if (!response.ok) throw new Error(data.message || 'Failed to create product');
  return data.data;
};

export const updateProduct = async (id, productData) => {
  const response = await fetch(`${API_URL}/products/${id}`, {
    method: 'PUT',
    headers: getAuthHeaders(),
    body: JSON.stringify(productData),
  });
  const data = await response.json();
  if (!response.ok) throw new Error(data.message || 'Failed to update product');
  return data.data;
};

export const uploadProductImage = async (id, file) => {
  const userStr = localStorage.getItem('smilesign_user');
  const token = userStr ? JSON.parse(userStr).token : null;
  const formData = new FormData();
  formData.append('image', file);
  const response = await fetch(`${API_URL}/products/${id}/image`, {
    method: 'POST',
    headers: { Authorization: `Bearer ${token}` },
    body: formData,
  });
  const data = await response.json();
  if (!response.ok) throw new Error(data.message || 'Failed to upload image');
  return data.data;
};

// ─── ADMIN USERS ─────────────────────────────────────────────────────────────

export async function getUsers() {
  const res = await fetch(`${API_URL}/users`, {
    headers: getAuthHeaders()
  })
  if (!res.ok) {
    const error = await res.json()
    throw new Error(error.message || 'Failed to fetch users')
  }
  const json = await res.json()
  return json.data
}

export async function updateUser(id, data) {
  const res = await fetch(`${API_URL}/users/${id}`, {
    method: 'PUT',
    headers: { ...getAuthHeaders(), 'Content-Type': 'application/json' },
    body: JSON.stringify(data)
  })
  if (!res.ok) {
    const error = await res.json()
    throw new Error(error.message || 'Failed to update user')
  }
  const json = await res.json()
  return json.data
}

export const getMyOrders = async () => {
  const response = await fetch(`${API_URL}/orders`, {
    headers: getAuthHeaders(),
  });
  const data = await response.json();
  if (!response.ok) throw new Error(data.message || 'Failed to fetch orders');
  return data.data;
};

export const createOrder = async (orderData) => {
  const response = await fetch(`${API_URL}/orders`, {
    method: 'POST',
    headers: getAuthHeaders(),
    body: JSON.stringify(orderData),
  });
  const data = await response.json();
  if (!response.ok) throw new Error(data.message || 'Failed to create order');
  return data.data;
};

export const getProfile = async () => {
  const response = await fetch(`${API_URL}/auth/profile`, {
    headers: getAuthHeaders(),
  });
  const data = await response.json();
  if (!response.ok) throw new Error(data.message || 'Failed to fetch profile');
  return data.data;
};

export const updateProfile = async (profileData) => {
  const response = await fetch(`${API_URL}/auth/profile`, {
    method: 'PUT',
    headers: getAuthHeaders(),
    body: JSON.stringify(profileData),
  });
  const data = await response.json();
  if (!response.ok) throw new Error(data.message || 'Failed to update profile');
  return data;
};

// ─── Admin API ─────────────────────────────────────────────────────────────
export const getAllOrdersAdmin = async () => {
  const response = await fetch(`${API_URL}/orders/admin`, {
    headers: getAuthHeaders(),
  });
  const data = await response.json();
  if (!response.ok) throw new Error(data.message || 'Failed to fetch all orders');
  return data.data;
};

export const updateOrderStatus = async (orderId, status) => {
  const response = await fetch(`${API_URL}/orders/admin/${orderId}/status`, {
    method: 'PUT',
    headers: getAuthHeaders(),
    body: JSON.stringify({ status }),
  });
  const data = await response.json();
  if (!response.ok) throw new Error(data.message || 'Failed to update order status');
  return data.data;
};

// ─── COUPON API ───────────────────────────────────────────────────────────────

// Seller: list active coupons
export const getCoupons = async () => {
  const response = await fetch(`${API_URL}/coupons`, { headers: getAuthHeaders() });
  const data = await response.json();
  if (!response.ok) throw new Error(data.message || 'Failed to fetch coupons');
  return data.data;
};

// Seller: validate a coupon code (returns discount info)
export const validateCoupon = async (code, productId, orderValue) => {
  const response = await fetch(`${API_URL}/coupons/validate`, {
    method: 'POST',
    headers: getAuthHeaders(),
    body: JSON.stringify({ code, productId, orderValue }),
  });
  const data = await response.json();
  if (!response.ok) throw new Error(data.message || 'Invalid coupon');
  return data.data;
};

// Admin: list all coupons
export const getCouponsAdmin = async () => {
  const response = await fetch(`${API_URL}/coupons/admin`, { headers: getAuthHeaders() });
  const data = await response.json();
  if (!response.ok) throw new Error(data.message || 'Failed to fetch coupons');
  return data.data;
};

// Admin: create coupon
export const createCouponAdmin = async (payload) => {
  const response = await fetch(`${API_URL}/coupons`, {
    method: 'POST', headers: getAuthHeaders(), body: JSON.stringify(payload),
  });
  const data = await response.json();
  if (!response.ok) throw new Error(data.message || 'Failed to create coupon');
  return data.data;
};

// Admin: update coupon
export const updateCouponAdmin = async (id, payload) => {
  const response = await fetch(`${API_URL}/coupons/${id}`, {
    method: 'PUT', headers: getAuthHeaders(), body: JSON.stringify(payload),
  });
  const data = await response.json();
  if (!response.ok) throw new Error(data.message || 'Failed to update coupon');
  return data.data;
};

// Admin: delete coupon
export const deleteCouponAdmin = async (id) => {
  const response = await fetch(`${API_URL}/coupons/${id}`, {
    method: 'DELETE',
    headers: getAuthHeaders(),
  });
  const data = await response.json();
  if (!response.ok) throw new Error(data.message || 'Failed to delete coupon');
  return data.data;
};

export const claimCoupon = async (id) => {
  const response = await fetch(`${API_URL}/coupons/${id}/claim`, {
    method: 'POST',
    headers: getAuthHeaders(),
  });
  const data = await response.json();
  if (!response.ok) throw new Error(data.message || 'Failed to claim coupon');
  return data;
};
