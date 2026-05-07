class APIClient {
    constructor() {
        this.baseURL = 'http://127.0.0.1:8000';
    }
    
    async login(email, password) {
        // ✅ JWT login - NO CSRF token needed
        const response = await fetch(`${this.baseURL}/accounts/api/v1/jwt/login/`, {
            method: 'POST',
            headers: { 
                'Content-Type': 'application/json'
                // ❌ DON'T add X-CSRFToken header for JWT
            },
            body: JSON.stringify({ email, password })
        });
        
        if (!response.ok) {
            const error = await response.json();
            throw new Error(error.detail || 'Login failed');
        }
        
        const data = await response.json();
        
        // Store tokens
        localStorage.setItem('access_token', data.access);
        localStorage.setItem('refresh_token', data.refresh);
        
        // ✅ Clear any old session cookies to avoid confusion
        document.cookie.split(";").forEach(cookie => {
            document.cookie = cookie
                .replace(/^ +/, "")
                .replace(/=.*/, `=;expires=${new Date(0).toUTCString()};path=/`);
        });
        
        return data;
    }
    
    async request(endpoint, options = {}) {
        const token = localStorage.getItem('access_token');
        
        const headers = {
            'Content-Type': 'application/json',
            ...options.headers
        };
        
        if (token) {
            headers['Authorization'] = `Bearer ${token}`;
        }
        
        // ❌ Don't add CSRF token for JWT requests
        try {
            let response = await fetch(`${this.baseURL}${endpoint}`, {
                ...options,
                headers
            });
            
            if (response.status === 401) {
                const refreshed = await this.refreshToken();
                if (refreshed) {
                    const newToken = localStorage.getItem('access_token');
                    headers['Authorization'] = `Bearer ${newToken}`;
                    response = await fetch(`${this.baseURL}${endpoint}`, {
                        ...options,
                        headers
                    });
                } else {
                    localStorage.clear();
                    // Clear cookies too
                    document.cookie.split(";").forEach(cookie => {
                        document.cookie = cookie
                            .replace(/^ +/, "")
                            .replace(/=.*/, `=;expires=${new Date(0).toUTCString()};path=/`);
                    });
                    window.location.href = '/index.html';
                    throw new Error('Session expired');
                }
            }
            
            const contentType = response.headers.get('content-type');
            if (contentType && contentType.includes('application/json')) {
                const data = await response.json();
                if (!response.ok) {
                    throw new Error(data.detail || data.message || 'Request failed');
                }
                return data;
            }
            
            if (!response.ok) {
                throw new Error(`HTTP ${response.status}`);
            }
            
            return null;
            
        } catch (error) {
            console.error('API Error:', error);
            throw error;
        }
    }
    
    async refreshToken() {
        const refresh = localStorage.getItem('refresh_token');
        if (!refresh) return false;
        
        try {
            const response = await fetch(`${this.baseURL}/accounts/api/v1/jwt/refresh/`, {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ refresh })
            });
            
            if (response.ok) {
                const data = await response.json();
                localStorage.setItem('access_token', data.access);
                return true;
            }
        } catch (error) {
            console.error('Refresh failed:', error);
        }
        
        return false;
    }
    
    async getTodos() {
        return this.request('/tasks/api/v1/tasks/'); // Adjust endpoint
    }
    
    async createTodo(title) {
        return this.request('/tasks/api/v1/tasks/', {
            method: 'POST',
            body: JSON.stringify({ title, completed: false })
        });
    }
    
    async updateTodo(id, completed) {
        return this.request(`tasks/api/v1/done/${id}/`, {
            method: 'PATCH',
            body: JSON.stringify({ completed })
        });
    }
    
    async deleteTodo(id) {
        return this.request(`tasks/api/v1/delete/${id}/`, {
            method: 'DELETE'
        });
    }
    

    
    logout() {
        localStorage.clear();
        // Clear all cookies
        document.cookie.split(";").forEach(cookie => {
            document.cookie = cookie
                .replace(/^ +/, "")
                .replace(/=.*/, `=;expires=${new Date(0).toUTCString()};path=/`);
        });
        window.location.href = '/index.html';
    }
}