import axios from "axios";
import { getAccessToken } from "./token.js";

/**
 * Generates a password for the STK Push request.
 * @param {string} businessShortcode - The Daraja business shortcode.
 * @param {string} passkey - The Daraja passkey.
 * @param {string} timestamp - The timestamp in the required format.
 * @returns {string} - Base64-encoded password.
 */
const generatePassword = (businessShortcode, passkey, timestamp) => {
  return Buffer.from(`${businessShortcode}${passkey}${timestamp}`).toString(
    "base64"
  );
};

/**
 * Generates a timestamp in the format required by the Daraja API.
 * @returns {string} - The timestamp in `yyyyMMddHHmmss` format.
 */
const generateTimestamp = () => {
  return new Date()
    .toISOString()
    .replace(/[-:TZ.]/g, "")
    .slice(0, 14);
};

/**
 * Creates the payload for the STK Push request.
 * @param {object} params - Configuration object for the STK Push.
 * @returns {object} - The STK Push payload.
 */
const createPayload = ({
  businessShortcode,
  password,
  timestamp,
  phoneNumber,
  amount,
  accountReference,
  callbackUrl,
}) => {
  return {
    BusinessShortCode: businessShortcode,
    Password: password,
    Timestamp: timestamp,
    TransactionType: "CustomerPayBillOnline",
    Amount: amount,
    PartyA: phoneNumber,
    PartyB: businessShortcode,
    PhoneNumber: phoneNumber,
    CallBackURL: callbackUrl,
    AccountReference: accountReference,
    TransactionDesc: "Payment",
  };
};

/**
 * Sends an STK Push request to the Daraja API.
 * @param {object} config - Configuration object for the STK Push.
 * @returns {Promise<object>} - The response data from the Daraja API.
 * @throws Will throw an error if the request fails.
 */
export const stkPush = async ({
  consumerKey,
  consumerSecret,
  businessShortcode,
  passkey,
  phoneNumber,
  amount,
  accountReference,
  callbackUrl,
}) => {
  const timestamp = generateTimestamp();
  const password = generatePassword(businessShortcode, passkey, timestamp);

  const payload = createPayload({
    businessShortcode,
    password,
    timestamp,
    phoneNumber,
    amount,
    accountReference,
    callbackUrl,
  });

  try {
    const token = await getAccessToken({ consumerKey, consumerSecret });

    const { data } = await axios.post(
      "https://sandbox.safaricom.co.ke/mpesa/stkpush/v1/processrequest",
      payload,
      {
        headers: { Authorization: `Bearer ${token}` },
      }
    );

    return data;
  } catch (error) {
    throw new Error(`STK Push failed: ${error.message}`);
  }
};
