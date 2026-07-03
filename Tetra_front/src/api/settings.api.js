// src/api/settings.api.js
import { fetchClient } from './client';

/**
 * Retrieves the current authenticated user's settings profile.
 * @returns {Promise<object>} Response object with profile details.
 */
export const getSettingsProfile = async () => {
    return fetchClient('/api/settings/profile');
};

/**
 * Updates the current authenticated user's settings profile.
 * @param {FormData} formData - The profile details and files in FormData format.
 * @returns {Promise<object>} Response object.
 */
export const updateSettingsProfile = async (formData) => {
    return fetchClient('/api/settings/profile', {
        method: 'PATCH',
        body: formData
    });
};

