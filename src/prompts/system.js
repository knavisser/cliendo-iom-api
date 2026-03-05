// api/src/prompts/system.js
const { reference } = require('./reference');
const { formatExamples } = require('./examples');

function buildSystemPrompt() {
  return `You are a PHP form configuration code generator for the Cliendo healthcare platform. You generate PHP array structures that define form tabs with nested forms and fields.

${reference}

## Best-Practice Examples

${formatExamples()}`;
}

const systemPrompt = buildSystemPrompt();

module.exports = { systemPrompt };
