const API_BASE_URL = 'http://localhost:8081/api';

const getAuthHeaders = (extraHeaders = {}) => {
    const token = localStorage.getItem('jwt_token');
    return {
        ...extraHeaders,
        ...(token ? { 'Authorization': `Bearer ${token}` } : {})
    };
};

export const loginUser = async (username, password) => {
    const response = await fetch(`${API_BASE_URL}/auth/login`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ username, password })
    });
    if (!response.ok) {
        throw new Error('Invalid credentials');
    }
    return response.json();
};

export const registerUser = async (username, password) => {
    const response = await fetch(`${API_BASE_URL}/auth/register`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ username, password })
    });
    if (!response.ok) {
        const err = await response.text();
        throw new Error(err || 'Registration failed');
    }
    return response.json();
};

export const getTables = async () => {
    const response = await fetch(`${API_BASE_URL}/tables`, { headers: getAuthHeaders() });
    if (!response.ok) throw new Error('Failed to fetch tables');
    return response.json();
};

export const addTable = async (tableData) => {
    const response = await fetch(`${API_BASE_URL}/tables`, {
        method: 'POST',
        headers: getAuthHeaders({ 'Content-Type': 'application/json' }),
        body: JSON.stringify(tableData),
    });
    if (!response.ok) throw new Error('Failed to add table');
    return response.json();
};

export const getReservations = async () => {
    const response = await fetch(`${API_BASE_URL}/reservations`, { headers: getAuthHeaders() });
    if (!response.ok) throw new Error('Failed to fetch reservations');
    return response.json();
};

export const createReservation = async (reservationData) => {
    const response = await fetch(`${API_BASE_URL}/reservations`, {
        method: 'POST',
        headers: getAuthHeaders({ 'Content-Type': 'application/json' }),
        body: JSON.stringify(reservationData),
    });
    
    if (!response.ok) {
        const errorText = await response.text();
        throw new Error(errorText || 'Failed to create reservation');
    }
    
    const contentType = response.headers.get("content-type");
    if (contentType && contentType.indexOf("application/json") !== -1) {
        return response.json();
    } else {
        return response.text();
    }
};

export const cancelReservation = async (id) => {
    const response = await fetch(`${API_BASE_URL}/reservations/${id}`, {
        method: 'DELETE',
        headers: getAuthHeaders()
    });
    
    if (!response.ok) {
        const errorText = await response.text();
        throw new Error(errorText || 'Failed to cancel reservation');
    }
    return response.text();
};

export const getMyReservations = async () => {
    const response = await fetch(`${API_BASE_URL}/reservations/my`, { headers: getAuthHeaders() });
    if (!response.ok) throw new Error('Failed to fetch user reservations');
    return response.json();
};

export const updateReservation = async (id, updatedData) => {
    const response = await fetch(`${API_BASE_URL}/reservations/${id}`, {
        method: 'PUT',
        headers: getAuthHeaders({ 'Content-Type': 'application/json' }),
        body: JSON.stringify(updatedData),
    });
    
    if (!response.ok) {
        const errorText = await response.text();
        throw new Error(errorText || 'Failed to update reservation');
    }
    
    const contentType = response.headers.get("content-type");
    if (contentType && contentType.indexOf("application/json") !== -1) {
        return response.json();
    } else {
        return response.text();
    }
};
