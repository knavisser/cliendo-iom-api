require('dotenv').config();
const express = require('express');
const corsMiddleware = require('./middleware/cors');
const auth = require('./middleware/auth');
const chatRouter = require('./routes/chat');

const app = express();
const PORT = process.env.PORT || 3456;

app.use(corsMiddleware);
app.use(express.json({ limit: '10mb' }));

app.get('/api/health', (req, res) => {
	res.json({ status: 'ok' });
});

app.post('/api/auth', auth, (req, res) => {
	res.json({ status: 'ok' });
});

app.use('/api', auth, chatRouter);

app.listen(PORT, () => {
	console.log(`Cliendo IOM API running on port ${PORT}`);
});
