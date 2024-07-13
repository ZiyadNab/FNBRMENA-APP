// useAuthStore.js
import { create } from 'zustand';
import { immer } from 'zustand/middleware/immer';
import axios from 'axios';
import AsyncStorage from '@react-native-async-storage/async-storage';

// Define your API base URL
const API_BASE_URL = 'http://192.168.8.28:3000'; // Replace with your backend URL

const useAuthStore = create(immer((set, get) => ({
    user: null,
    token: null,
    isAuthenticated: false,
    reminders: [],
    bookmarks: [],

    // Initialize authentication state from AsyncStorage
    initializeAuth: async () => {
        try {
            const token = await AsyncStorage.getItem('token');
            const user = JSON.parse(await AsyncStorage.getItem('user'));

            if (token && user) {
                set({ user, token, isAuthenticated: true });
                await get().fetchReminders();
                await get().fetchBookmarks();
            } else {
                set({ user: null, token: null, isAuthenticated: false, reminders: [], bookmarks: [] });
            }
        } catch (error) {
            set({ error: 'Error initializing authentication.' });
        }
    },

    // Powerful error handling
    handleError: (error) => {
        if (error.response) {
            throw error.response.data.error
        } else if (error.request) {
            throw 'No response from the server.'
        } else if (error.reason) {
            throw error.reason
        } else {
            console.error('API Error:', error);
            throw 'An error occurred.'
        }
    },

    // Login user
    login: async (email, password) => {
        try {
            const response = await axios.post(`${API_BASE_URL}/login`, { email, password });
            const { token, user } = response.data;

            await AsyncStorage.setItem('token', token);
            await AsyncStorage.setItem('user', JSON.stringify(user));

            set({ user, token, isAuthenticated: true });
            await get().fetchReminders();
            await get().fetchBookmarks();
        } catch (error) {
            get().handleError(error);
        }
    },

    // Register new user
    register: async (email, displayname, password) => {
        try {
            const response = await axios.post(`${API_BASE_URL}/register`, { email, displayname, password });
            const { token, user } = response.data;

            await AsyncStorage.setItem('token', token);
            await AsyncStorage.setItem('user', JSON.stringify(user));

            set({ user, token, isAuthenticated: true });
        } catch (error) {
            get().handleError(error);
        }
    },

    // Check user authentication status
    checkAuth: async () => {
        try {
            await get().initializeAuth();
        } catch (error) {
            get().handleError(error);
        }
    },

    // Update user profile information
    updateProfile: async (updates) => {
        try {
            const { token } = get();
            const response = await axios.patch(`${API_BASE_URL}/update-profile`, updates, {
                headers: { Authorization: `Bearer ${token}` }
            });

            const updatedUser = response.data.user;

            await AsyncStorage.setItem('user', JSON.stringify(updatedUser));
            set(state => {
                state.user = { ...state.user, ...updates };
                state.error = null;
            });
        } catch (error) {
            get().handleError(error);
        }
    },

    // Change user password
    changePassword: async (oldPassword, newPassword) => {
        try {
            const { token } = get();
            await axios.patch(`${API_BASE_URL}/change-password`, { oldPassword, newPassword }, {
                headers: { Authorization: `Bearer ${token}` }
            });

            set({ error: null });
        } catch (error) {
            get().handleError(error);
        }
    },

    // Logout user
    logout: async () => {
        try {

            await AsyncStorage.removeItem('token');
            await AsyncStorage.removeItem('user');
            set({ user: null, token: null, isAuthenticated: false, reminders: [], bookmarks: [] });

        } catch (error) {
            get().handleError(error);
        }
    },

    // Retrieve user reminders
    fetchReminders: async () => {
        try {
            const { token } = get();
            const response = await axios.get(`${API_BASE_URL}/reminders`, {
                headers: { Authorization: `Bearer ${token}` }
            });

            set({ reminders: response.data.reminders });
        } catch (error) {
            get().handleError(error);
        }
    },

    // Update user reminders
    updateReminders: async (reminders) => {
        try {
            const { token } = get();
            await axios.patch(`${API_BASE_URL}/reminders`, { reminders }, {
                headers: { Authorization: `Bearer ${token}` }
            });

            set(state => {
                state.reminders = reminders;
                state.error = null;
            });
        } catch (error) {
            get().handleError(error);
        }
    },

    // Retrieve user bookmarks
    fetchBookmarks: async () => {
        try {
            const { token } = get();
            const response = await axios.get(`${API_BASE_URL}/bookmarks`, {
                headers: { Authorization: `Bearer ${token}` }
            });

            set({ bookmarks: response.data.bookmarks });
        } catch (error) {
            get().handleError(error);
        }
    },

    // Update user bookmarks
    updateBookmarks: async (bookmarks) => {
        try {
            const { token } = get();
            await axios.patch(`${API_BASE_URL}/bookmarks`, { bookmarks }, {
                headers: { Authorization: `Bearer ${token}` }
            });

            set(state => {
                state.bookmarks = bookmarks;
                state.error = null;
            });
        } catch (error) {
            get().handleError(error);
        }
    },
})))

export default useAuthStore;