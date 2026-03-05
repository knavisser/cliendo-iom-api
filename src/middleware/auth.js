module.exports = function auth(req, res, next) {
	const password = process.env.APP_PASSWORD;
	if (!password) return next();
	const provided = req.headers['x-app-password'];
	if (provided === password) return next();
	res.status(401).json({ error: 'Invalid password' });
};
