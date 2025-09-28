const API_BASE_URL = 'http://localhost:5000';

export const teachingAssistantAPI = {
  // Register Teaching Assistant
  register: async (userData) => {
    const response = await fetch(`${API_BASE_URL}/ta/register`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      credentials: 'include',
      body: JSON.stringify(userData),
    });

    if (!response.ok) {
      const error = await response.json();
      throw new Error(error.error || 'Registration failed');
    }

    return await response.json();
  },

  // Login Teaching Assistant
  login: async (username, password) => {
    const response = await fetch(`${API_BASE_URL}/ta/login`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      credentials: 'include',
      body: JSON.stringify({ username, password }),
    });

    if (!response.ok) {
      const error = await response.json();
      throw new Error(error.error || 'Login failed');
    }

    return await response.json();
  },

  // Logout Teaching Assistant
  logout: async () => {
    const response = await fetch(`${API_BASE_URL}/ta/logout`, {
      method: 'POST',
      credentials: 'include',
    });

    if (!response.ok) {
      throw new Error('Logout failed');
    }

    return await response.json();
  },

  // Get TA profile
  getProfile: async () => {
    const response = await fetch(`${API_BASE_URL}/ta/profile`, {
      credentials: 'include',
    });

    if (!response.ok) {
      throw new Error('Not authenticated');
    }

    return await response.json();
  },

  // Get all questions across all classrooms
  getAllQuestions: async (params = {}) => {
    const queryParams = new URLSearchParams();
    
    if (params.page) queryParams.append('page', params.page);
    if (params.limit) queryParams.append('limit', params.limit);
    if (params.status) queryParams.append('status', params.status);
    if (params.classroomId) queryParams.append('classroomId', params.classroomId);
    if (params.sortBy) queryParams.append('sortBy', params.sortBy);
    if (params.sortOrder) queryParams.append('sortOrder', params.sortOrder);

    const response = await fetch(`${API_BASE_URL}/ta/questions?${queryParams}`, {
      credentials: 'include',
    });

    if (!response.ok) {
      throw new Error('Failed to fetch questions');
    }

    return await response.json();
  },

  // Get questions statistics
  getStats: async () => {
    const response = await fetch(`${API_BASE_URL}/ta/stats`, {
      credentials: 'include',
    });

    if (!response.ok) {
      throw new Error('Failed to fetch statistics');
    }

    return await response.json();
  },

  // Answer a question
  answerQuestion: async (questionId, answer, attachments = []) => {
    const formData = new FormData();
    formData.append('answer', answer);
    
    // Append each file to FormData
    attachments.forEach((file, index) => {
      formData.append('attachments', file);
    });

    const response = await fetch(`${API_BASE_URL}/ta/answer/${questionId}`, {
      method: 'POST',
      credentials: 'include',
      body: formData,
    });

    if (!response.ok) {
      const error = await response.json();
      throw new Error(error.error || 'Failed to answer question');
    }

    return await response.json();
  },

  // Update an existing answer
  updateAnswer: async (questionId, answer, attachments = []) => {
    const formData = new FormData();
    formData.append('answer', answer);
    
    // Append each file to FormData
    attachments.forEach((file, index) => {
      formData.append('attachments', file);
    });

    const response = await fetch(`${API_BASE_URL}/ta/answer/${questionId}`, {
      method: 'PUT',
      credentials: 'include',
      body: formData,
    });

    if (!response.ok) {
      const error = await response.json();
      throw new Error(error.error || 'Failed to update answer');
    }

    return await response.json();
  }
};
