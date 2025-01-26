/**
 * Helper function to send a standardized API response.
 * @param {object} res - Express response object
 * @param {number} statusCode - HTTP status code (e.g., 200 for success)
 * @param {boolean} success - Indicates if the request was successful or not
 * @param {string} message - Message to be sent in the response
 * @param {object} [data=null] - Any data to be included in the response (optional)
 */
const sendResponse = (res, statusCode, success, message, data = null) => {
    const response = {
        success,
        message,
        data
    };

    return res.status(statusCode).json(response);
};

/**
 * Sends a success response.
 * @param {object} res - Express response object
 * @param {string} message - Success message
 * @param {object} data - Data to be sent in the response
 */
const sendSuccess = (res, message, data = null) => {
    sendResponse(res, 200, true, message, data);
};

/**
 * Sends an error response.
 * @param {object} res - Express response object
 * @param {string} message - Error message
 * @param {number} [statusCode=400] - HTTP status code (default is 400 for Bad Request)
 * @param {object} [data=null] - Any data related to the error (optional)
 */

const sendError = (res, message, statusCode = 400, data = null) => {
    sendResponse(res, statusCode, false, message, data);
};

module.exports = {
    sendSuccess,
    sendError
};
