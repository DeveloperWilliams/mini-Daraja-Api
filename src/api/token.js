import axios from "axios";

/**
 * In-memory cache for the access token and expiry time
 */
let cachedToken = null;
let tokenExpiry = null;

/**
 * Generates a Base64-encoded string for consumer key and secret.
 * @param {string} consumerKey - The Daraja consumer key.
 * @param {string} consumerSecret - The Daraja consumer secret.
 * @returns {string} - Base64-encoded credentials.
 */
const generateAuthHeader = (consumerKey, consumerSecret) => {
  return `Basic ${Buffer.from(`${consumerKey}:${consumerSecret}`).toString("base64")}`;
};

/**
 * Fetches a new access token from Safaricom API.
 * @param {string} authHeader - Base64-encoded authorization header.
 * @returns {Promise<{ accessToken: string, expiresIn: number }>} - Access token and its expiry time.
 * @throws Will throw an error if the token fetch fails.
 */
const fetchNewToken = async (authHeader) => {
  try {
    const response = await axios.get(
      "https://sandbox.safaricom.co.ke/oauth/v1/generate?grant_type=client_credentials",
      { headers: { Authorization: authHeader } }
    );

    return {
      accessToken: response.data.access_token,
      expiresIn: response.data.expires_in,
    };
  } catch (error) {
    throw new Error(`Error fetching access token: ${error.message}`);
  }
};

/**
 * Retrieves a cached access token if valid or fetches a new one.
 * @param {object} config - Configuration object containing consumerKey and consumerSecret.
 * @param {string} config.consumerKey - The Daraja consumer key.
 * @param {string} config.consumerSecret - The Daraja consumer secret.
 * @returns {Promise<string>} - The valid access token.
 * @throws Will throw an error if the token fetch fails.
 */
export const getAccessToken = async ({ consumerKey, consumerSecret }) => {
  if (cachedToken && tokenExpiry && tokenExpiry > Date.now()) {
    return cachedToken;
  }

  const authHeader = generateAuthHeader(consumerKey, consumerSecret);
  const { accessToken, expiresIn } = await fetchNewToken(authHeader);

  // Cache the token and set expiry
  cachedToken = accessToken;
  tokenExpiry = Date.now() + expiresIn * 1000;

  return cachedToken;
};
