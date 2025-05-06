import axios from 'axios';

const API_URL = process.env.REACT_APP_API_URL || 'http://localhost:8080';

const apiClient = axios.create({
  baseURL: API_URL,
  headers: {
    'Content-Type': 'application/json',
  },
});

// Memory API endpoints
export const memoryApi = {
  // Get all memories
  getMemories: async (params = {}) => {
    try {
      const response = await apiClient.get('/memories', { params });
      return response.data;
    } catch (error) {
      console.error('Error fetching memories:', error);
      throw error;
    }
  },

  // Get a single memory by ID
  getMemory: async (id) => {
    try {
      const response = await apiClient.get(`/memory/${id}`);
      return response.data;
    } catch (error) {
      console.error(`Error fetching memory with ID ${id}:`, error);
      throw error;
    }
  },

  // Create a new memory
  createMemory: async (memoryData) => {
    try {
      const response = await apiClient.post('/memory', memoryData);
      return response.data;
    } catch (error) {
      console.error('Error creating memory:', error);
      throw error;
    }
  },

  // Update an existing memory
  updateMemory: async (id, memoryData) => {
    try {
      const response = await apiClient.put(`/memory/${id}`, memoryData);
      return response.data;
    } catch (error) {
      console.error(`Error updating memory with ID ${id}:`, error);
      throw error;
    }
  },

  // Delete a memory
  deleteMemory: async (id) => {
    try {
      const response = await apiClient.delete(`/memory/${id}`);
      return response.data;
    } catch (error) {
      console.error(`Error deleting memory with ID ${id}:`, error);
      throw error;
    }
  },

  // Search memories by text query
  searchMemories: async (query) => {
    try {
      const response = await apiClient.get('/search', { params: { query } });
      return response.data;
    } catch (error) {
      console.error('Error searching memories:', error);
      throw error;
    }
  },
};

export default apiClient; 