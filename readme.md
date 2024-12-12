# Mini Daraja API

Mini Daraja API is a Node.js wrapper for the Daraja API, which allows developers to easily integrate M-Pesa payment services into their applications.

## Features

- Simplified integration with M-Pesa Daraja API
- Easy-to-use methods for common M-Pesa operations
- Supports both sandbox and production environments

## Installation

To install the Mini Daraja API wrapper, use npm:

```bash
npm install mini-daraja-api
```

## Usage

First, require the Mini Daraja API in your project and initialize it with your credentials:

```javascript
const MiniDaraja = require('mini-daraja-api');

const daraja = new MiniDaraja({
    consumerKey: 'yourConsumerKey',
    consumerSecret: 'yourConsumerSecret',
    environment: 'sandbox' // or 'production'
});
```

### Example: Lipa na M-Pesa Online Payment

```javascript
daraja.lipaNaMpesaOnline({
    BusinessShortCode: '174379',
    Amount: '1',
    PartyA: '254712345678',
    PartyB: '174379',
    PhoneNumber: '254712345678',
    CallBackURL: 'https://yourcallbackurl.com/callback',
    AccountReference: 'Test123',
    TransactionDesc: 'Payment for testing'
}).then(response => {
    console.log(response);
}).catch(error => {
    console.error(error);
});
```

## API Methods

### `lipaNaMpesaOnline(options)`

Initiates an M-Pesa online payment.

- `BusinessShortCode` (string): The short code of the business.
- `Amount` (string): The amount to be paid.
- `PartyA` (string): The phone number of the payer.
- `PartyB` (string): The short code receiving the payment.
- `PhoneNumber` (string): The phone number making the payment.
- `CallBackURL` (string): The URL to call once the payment is complete.
- `AccountReference` (string): An account reference for the transaction.
- `TransactionDesc` (string): A description of the transaction.

### `generateToken()`

Generates an OAuth token for authenticating API requests.

```javascript
daraja.generateToken().then(token => {
    console.log(token);
}).catch(error => {
    console.error(error);
});
```

## Contributing

Contributions are welcome! Please open an issue or submit a pull request on GitHub.

## License

This project is licensed under the MIT License. See the [LICENSE](LICENSE) file for details.

## Contact

For any questions or inquiries, please contact [archywilliams2@gmail.com](archywilliams2@gmail.com).
