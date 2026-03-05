const express = require('express');
const multer = require('multer');
const { streamChat } = require('../services/claude');
const { addMessage, getMessages } = require('../services/sessionStore');
const { parseFile } = require('../services/fileParser');
const { validate, extractPhpFromResponse } = require('../services/validator');

const router = express.Router();
const upload = multer({ storage: multer.memoryStorage(), limits: { fileSize: 10 * 1024 * 1024 } });

function formatValidation(result) {
	const parts = [];
	if (result.errors.length > 0) {
		parts.push('**Validation Errors:**\n' + result.errors.map(e => `- ${e}`).join('\n'));
	}
	if (result.warnings.length > 0) {
		parts.push('**Validation Warnings:**\n' + result.warnings.map(w => `- ${w}`).join('\n'));
	}
	return parts.join('\n\n');
}

router.post('/chat', async (req, res) => {
	const sessionId = req.headers['x-session-id'] || 'default';
	const { message } = req.body;

	if (!message) {
		return res.status(400).json({ error: 'message is required' });
	}

	addMessage(sessionId, 'user', message);
	const messages = getMessages(sessionId);

	const fullResponse = await streamChat(messages, res);
	if (fullResponse) {
		const phpBlocks = extractPhpFromResponse(fullResponse);
		if (phpBlocks.length > 0) {
			const validation = validate(phpBlocks[0]);
			if (!validation.valid || validation.warnings.length > 0) {
				const validationMsg = formatValidation(validation);
				addMessage(sessionId, 'assistant', fullResponse);
				addMessage(sessionId, 'assistant', validationMsg);
			} else {
				addMessage(sessionId, 'assistant', fullResponse);
			}
		} else {
			addMessage(sessionId, 'assistant', fullResponse);
		}
	}
});

router.post('/upload', upload.single('file'), async (req, res) => {
	const sessionId = req.headers['x-session-id'] || 'default';
	const userMessage = req.body.message || '';

	if (!req.file) {
		return res.status(400).json({ error: 'file is required' });
	}

	try {
		const fileText = await parseFile(req.file.buffer, req.file.originalname);
		const combinedMessage = `${userMessage ? userMessage + '\n\n' : ''}[Uploaded file: ${req.file.originalname}]\n\n${fileText}`;

		addMessage(sessionId, 'user', combinedMessage);
		const messages = getMessages(sessionId);

		const fullResponse = await streamChat(messages, res);
		if (fullResponse) {
			const phpBlocks = extractPhpFromResponse(fullResponse);
			if (phpBlocks.length > 0) {
				const validation = validate(phpBlocks[0]);
				if (!validation.valid || validation.warnings.length > 0) {
					const validationMsg = formatValidation(validation);
					addMessage(sessionId, 'assistant', fullResponse);
					addMessage(sessionId, 'assistant', validationMsg);
				} else {
					addMessage(sessionId, 'assistant', fullResponse);
				}
			} else {
				addMessage(sessionId, 'assistant', fullResponse);
			}
		}
	} catch (error) {
		res.status(400).json({ error: error.message });
	}
});

router.post('/validate', (req, res) => {
	const { code } = req.body;
	if (!code) {
		return res.status(400).json({ error: 'code is required' });
	}
	const result = validate(code);
	res.json(result);
});

module.exports = router;
