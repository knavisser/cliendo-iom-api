const mammoth = require('mammoth');
const pdfParse = require('pdf-parse');
const XLSX = require('xlsx');

const MAX_TEXT_LENGTH = 10000;

function truncate(text) {
	if (text.length > MAX_TEXT_LENGTH) {
		return text.slice(0, MAX_TEXT_LENGTH) + '\n\n[... truncated to 10,000 characters]';
	}
	return text;
}

async function parseFile(buffer, originalName) {
	const ext = originalName.split('.').pop().toLowerCase();

	switch (ext) {
		case 'docx': {
			const result = await mammoth.extractRawText({ buffer });
			return truncate(result.value);
		}
		case 'pdf': {
			const result = await pdfParse(buffer);
			return truncate(result.text);
		}
		case 'xlsx':
		case 'xls': {
			const workbook = XLSX.read(buffer, { type: 'buffer' });
			const texts = [];
			for (const sheetName of workbook.SheetNames) {
				const sheet = workbook.Sheets[sheetName];
				texts.push(`Sheet: ${sheetName}`);
				texts.push(XLSX.utils.sheet_to_csv(sheet));
			}
			return truncate(texts.join('\n\n'));
		}
		case 'csv': {
			return truncate(buffer.toString('utf-8'));
		}
		default:
			throw new Error(`Unsupported file type: .${ext}`);
	}
}

module.exports = { parseFile };
