import { API_ENDPOINTS, apiRequest } from '../config/api';

/**
 * Contact Service - Handles all contact form API calls
 */

/**
 * Submit contact form
 * @param {Object} contactData - Contact form data
 * @param {string} contactData.name - User's name
 * @param {string} contactData.email - User's email
 * @param {string} contactData.subject - Message subject
 * @param {string} contactData.message - Message content
 * @returns {Promise<Object>} Response from server
 */
export const submitContactForm = async (contactData) => {
  try {
    const data = await apiRequest(API_ENDPOINTS.CONTACT, {
      method: 'POST',
      body: JSON.stringify(contactData),
    });

    return data;
  } catch (error) {
    throw new Error(error.message || 'Failed to send message');
  }
};

/**
 * Get all contact messages (Admin only)
 * @returns {Promise<Object>} All contact messages
 */
export const getAllContacts = async () => {
  try {
    const data = await apiRequest(API_ENDPOINTS.CONTACT, {
      method: 'GET',
    });

    return data;
  } catch (error) {
    throw new Error(error.message || 'Failed to fetch contact messages');
  }
};

/**
 * Update contact message status (Admin only)
 * @param {string} id - Contact message ID
 * @param {string} status - New status (pending/reviewed/resolved)
 * @returns {Promise<Object>} Updated contact message
 */
export const updateContactStatus = async (id, status) => {
  try {
    const data = await apiRequest(`${API_ENDPOINTS.CONTACT}/${id}/status`, {
      method: 'PATCH',
      body: JSON.stringify({ status }),
    });

    return data;
  } catch (error) {
    throw new Error(error.message || 'Failed to update contact status');
  }
};
