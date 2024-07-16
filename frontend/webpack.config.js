const path = require('path');
const Dotenv = require('dotenv-webpack');

module.exports = {
    plugins: [
        new Dotenv({
            path: path.resolve(__dirname, '.env'), // Path to your .env file
        }),
    ],
};
