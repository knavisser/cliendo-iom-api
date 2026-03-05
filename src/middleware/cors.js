const cors = require('cors');

module.exports = cors({
	origin: true,
	methods: ['GET', 'POST'],
	allowedHeaders: ['Content-Type', 'X-Session-Id', 'X-App-Password'],
});
