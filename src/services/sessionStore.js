const SESSION_TIMEOUT_MS = 2 * 60 * 60 * 1000; // 2 hours
const CLEANUP_INTERVAL_MS = 15 * 60 * 1000; // 15 minutes
const MAX_MESSAGES = 40; // keep last N messages to avoid token overflow

const sessions = new Map();

function getSession(sessionId) {
	let session = sessions.get(sessionId);
	if (!session) {
		session = { messages: [], createdAt: Date.now(), lastActivity: Date.now() };
		sessions.set(sessionId, session);
	}
	session.lastActivity = Date.now();
	return session;
}

function addMessage(sessionId, role, content) {
	const session = getSession(sessionId);
	session.messages.push({ role, content });
	// Trim oldest pairs if too long (keep first pair + last N)
	if (session.messages.length > MAX_MESSAGES) {
		session.messages = session.messages.slice(-MAX_MESSAGES);
	}
}

function getMessages(sessionId) {
	return getSession(sessionId).messages;
}

// Periodic cleanup of expired sessions
setInterval(() => {
	const now = Date.now();
	for (const [id, session] of sessions) {
		if (now - session.lastActivity > SESSION_TIMEOUT_MS) {
			sessions.delete(id);
		}
	}
}, CLEANUP_INTERVAL_MS);

module.exports = { getSession, addMessage, getMessages };
