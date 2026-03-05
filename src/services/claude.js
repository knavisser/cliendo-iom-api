const Anthropic = require('@anthropic-ai/sdk');
const { systemPrompt } = require('../prompts/system');

const client = new Anthropic();

const MODEL = process.env.CLAUDE_MODEL || 'claude-sonnet-4-20250514';
const MAX_TOKENS = 4096;

function streamChat(messages, res) {
	res.writeHead(200, {
		'Content-Type': 'text/event-stream',
		'Cache-Control': 'no-cache',
		'Connection': 'keep-alive',
	});

	return new Promise((resolve) => {
		let fullResponse = '';
		let finished = false;

		function finish(response) {
			if (finished) return;
			finished = true;
			if (!res.writableEnded) res.end();
			resolve(response);
		}

		try {
			const stream = client.messages.stream({
				model: MODEL,
				max_tokens: MAX_TOKENS,
				system: systemPrompt,
				messages,
			});

			stream.on('text', (text) => {
				if (finished) return;
				fullResponse += text;
				res.write(`data: ${JSON.stringify({ type: 'text', text })}\n\n`);
			});

			stream.on('error', (error) => {
				console.error('Claude stream error:', error);
				if (!finished && !res.writableEnded) {
					res.write(`data: ${JSON.stringify({ type: 'error', error: error.message })}\n\n`);
				}
				finish('');
			});

			stream.on('end', () => {
				if (!finished && !res.writableEnded) {
					res.write(`data: ${JSON.stringify({ type: 'done' })}\n\n`);
				}
				finish(fullResponse);
			});
		} catch (error) {
			console.error('Claude API error:', error);
			if (!res.writableEnded) {
				res.write(`data: ${JSON.stringify({ type: 'error', error: error.message })}\n\n`);
			}
			finish('');
		}
	});
}

module.exports = { streamChat };
