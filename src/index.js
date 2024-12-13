import { stkPush } from "./api/stk.js";
import { getAccessToken } from "./api/token.js";

class daraja {
  /**
   * Initializes MiniDaraja with required credentials.
   * @param {object} options - The credentials for Daraja API.
   * @param {string} options.consumerKey - The Consumer Key.
   * @param {string} options.consumerSecret - The Consumer Secret.
   * @param {string} options.businessShortcode - The Business Shortcode.
   * @param {string} options.passkey - The Passkey for the business shortcode.
   * @throws Will throw an error if any credential is missing.
   */
  constructor({ consumerKey, consumerSecret, businessShortcode, passkey }) {
    this.#validateCredentials({
      consumerKey,
      consumerSecret,
      businessShortcode,
      passkey,
    });

    this.credentials = {
      consumerKey,
      consumerSecret,
      businessShortcode,
      passkey,
    };
  }

  /**
   * Validates required credentials.
   * @param {object} credentials - Credentials to validate.
   * @throws Will throw an error if any credential is missing.
   */
  #validateCredentials(credentials) {
    for (const [key, value] of Object.entries(credentials)) {
      if (!value) {
        throw new Error(`Missing required parameter: ${key}`);
      }
    }
  }

  /**
   * Generates an access token using Daraja API credentials.
   * @returns {Promise<string>} - The generated access token.
   */
  async generateToken() {
    try {
      return await getAccessToken(this.credentials);
    } catch (error) {
      throw new Error(`Failed to generate token: ${error.message}`);
    }
  }

  /**
   * Initiates an STK Push transaction.
   * @param {object} options - The transaction details.
   * @param {string} options.phoneNumber - The customer's phone number.
   * @param {number} options.amount - The amount to be paid.
   * @param {string} options.accountReference - The account reference for the transaction.
   * @param {string} options.callbackUrl - The URL to receive transaction status updates.
   * @returns {Promise<object>} - The response from the Daraja API.
   * @throws Will throw an error if any required parameter is missing or the request fails.
   */
  async initiateSTKPush({
    phoneNumber,
    amount,
    accountReference,
    callbackUrl,
  }) {
    this.#validateTransactionDetails({
      phoneNumber,
      amount,
      accountReference,
      callbackUrl,
    });

    try {
      return await stkPush({
        ...this.credentials,
        phoneNumber,
        amount,
        accountReference,
        callbackUrl,
      });
    } catch (error) {
      throw new Error(`STK Push initiation failed: ${error.message}`);
    }
  }

  /**
   * Validates required transaction details.
   * @param {object} transactionDetails - Transaction details to validate.
   * @throws Will throw an error if any required detail is missing.
   */
  #validateTransactionDetails(transactionDetails) {
    for (const [key, value] of Object.entries(transactionDetails)) {
      if (!value) {
        throw new Error(`Missing required transaction detail: ${key}`);
      }
    }
  }
}

// Export the daraja class as a named export
export { daraja };
