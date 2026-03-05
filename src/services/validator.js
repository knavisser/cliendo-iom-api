// api/src/services/validator.js
// Structural validator for Cliendo PHP form configuration arrays.

const VALID_TEMPLATES = new Set([
  'input', 'input2', 'input3', 'input4', 'input-readonly',
  'textarea', 'textarea2', 'textarea3',
  'radio', 'radio2', 'radio3',
  'select', 'select2',
  'checkbox', 'checkbox2',
  'repeat',
  'signature', 'signature2',
  'file', 'files', 'files2',
  'map',
  'plainTitle',
  'collapse',
  'spacer',
  'matrixHeader', 'matrixRadio',
  'options',
  'disableForm', 'enableForm',
  'none',
]);

const VALID_FORM_TYPES = new Set([
  'left', 'right', 'left full', 'left full matrixWithComments',
]);

const TEMPLATES_REQUIRING_CHOICES = new Set([
  'radio', 'radio2', 'radio3', 'select', 'select2',
  'checkbox', 'checkbox2', 'options',
]);

const TEMPLATES_REQUIRING_FIELDS = new Set(['repeat']);

const VALID_CSS2 = new Set([
  'date', 'date future',
  'mapPostalCode', 'mapHouseNumber', 'mapStreet', 'mapCity',
  'postalCode', 'houseNumber', 'street', 'city',
  'toggleNextOn', 'toggleNextOff',
  'normalWidth',
]);

const VISIBLE_PATTERNS = [
  /^[a-zA-Z0-9_-]+#[a-zA-Z0-9_-]+$/,    // fieldName#value
  /^[a-zA-Z0-9_-]+#any$/,                  // fieldName#any
  /^prev#[a-zA-Z0-9_-]+$/,                 // prev#value
  /^FORM\.[a-zA-Z0-9_]+$/,                 // FORM.formName
];

function validate(phpCode) {
  const errors = [];
  const warnings = [];

  // Check PHP opening
  if (!phpCode.trim().startsWith('<?php')) {
    errors.push('Missing <?php opening tag');
  }

  // Extract the array content (everything after $varName = [ ... ];)
  const varMatch = phpCode.match(/\$([a-zA-Z_]\w*)\s*=\s*\[/);
  if (!varMatch) {
    errors.push('No variable assignment found (expected $variableName = [...])');
    return { valid: errors.length === 0, errors, warnings };
  }

  // Check balanced brackets
  let depth = 0;
  let inString = false;
  let stringChar = null;
  let escaped = false;
  for (const ch of phpCode) {
    if (escaped) { escaped = false; continue; }
    if (ch === '\\') { escaped = true; continue; }
    if (inString) {
      if (ch === stringChar) inString = false;
      continue;
    }
    if (ch === "'" || ch === '"') { inString = true; stringChar = ch; continue; }
    if (ch === '[') depth++;
    if (ch === ']') depth--;
  }
  if (depth !== 0) {
    errors.push(`Unbalanced brackets: depth is ${depth} (expected 0)`);
  }

  // Check for function calls (server rejects all except __())
  // Scan line by line, skip lines that are inside string contexts
  const funcCallRegex = /\b([a-zA-Z_]\w*)\s*\(/g;
  let funcMatch;
  while ((funcMatch = funcCallRegex.exec(phpCode)) !== null) {
    const funcName = funcMatch[1];
    if (['php', 'array'].includes(funcName)) continue;
    if (funcName === '__') {
      warnings.push("Translation function __() detected — use literal Dutch strings instead");
    } else {
      errors.push(`Function call '${funcName}()' detected — only static arrays are allowed`);
    }
  }

  // Check for variable references used as values (not the top-level assignment)
  const varRefRegex = /=>\s*\$[a-zA-Z_]\w*/g;
  if (varRefRegex.test(phpCode)) {
    errors.push("Variable reference in value position — only literal values are allowed");
  }

  // Check for string concatenation (dot operator)
  if (/'\s*\.\s*'/.test(phpCode) || /'\s*\.\s*\$/.test(phpCode)) {
    warnings.push("String concatenation detected — use complete literal strings instead");
  }

  // Extract key-value pairs using regex
  const tabName = extractString(phpCode, "'name'");
  const tabLocalName = extractString(phpCode, "'localName'");

  if (!tabName) errors.push('Tab missing required property: name');
  if (!tabLocalName) errors.push('Tab missing required property: localName');

  // Check for forms array
  if (!phpCode.includes("'forms'")) {
    errors.push('Tab missing required property: forms');
    return { valid: errors.length === 0, errors, warnings };
  }

  // Parse forms and fields using regex-based extraction
  const forms = extractForms(phpCode);

  for (const form of forms) {
    if (!form.name) {
      errors.push(`Form missing required property: name`);
    }
    if (!form.localName && form.localName !== '') {
      warnings.push(`Form '${form.name || '?'}' missing localName`);
    }
    if (form.type && !VALID_FORM_TYPES.has(form.type)) {
      errors.push(`Form '${form.name || '?'}' has invalid type: '${form.type}'. Valid: ${[...VALID_FORM_TYPES].join(', ')}`);
    }
    if (!form.type) {
      errors.push(`Form '${form.name || '?'}' missing required property: type`);
    }

    const fieldNames = new Set();
    for (const field of form.fields) {
      // Check required properties
      if (!field.name) {
        errors.push(`Field in form '${form.name || '?'}' missing required property: name`);
        continue;
      }
      if (!field.template) {
        errors.push(`Field '${field.name}' missing required property: template`);
        continue;
      }

      // Check valid template
      if (!VALID_TEMPLATES.has(field.template)) {
        errors.push(`Field '${field.name}' has unknown template: '${field.template}'`);
      }

      // Check duplicate names
      if (fieldNames.has(field.name)) {
        warnings.push(`Duplicate field name '${field.name}' in form '${form.name || '?'}'`);
      }
      fieldNames.add(field.name);

      // Template-specific checks
      if (TEMPLATES_REQUIRING_CHOICES.has(field.template) && !field.hasChoices) {
        errors.push(`Field '${field.name}' (${field.template}) requires 'choices' property`);
      }
      if (TEMPLATES_REQUIRING_FIELDS.has(field.template) && !field.hasNestedFields) {
        errors.push(`Field '${field.name}' (repeat) requires nested 'fields' property`);
      }
      if (field.template === 'repeat' && !field.hasAddWord) {
        warnings.push(`Field '${field.name}' (repeat) should have 'addWord' property`);
      }
      if (field.template === 'matrixHeader' && !field.hasLocalSubName) {
        warnings.push(`Field '${field.name}' (matrixHeader) should have 'localSubName' property`);
      }
      if ((field.template === 'files' || field.template === 'file') && !field.hasAddWord) {
        warnings.push(`Field '${field.name}' (${field.template}) should have 'addWord' property`);
      }

      // Check css2
      if (field.css2) {
        const css2Parts = field.css2.split(' ').map(p => p.trim()).filter(Boolean);
        // Allow compound classes but warn on unknown individual classes
        for (const part of css2Parts) {
          if (!VALID_CSS2.has(part) && !VALID_CSS2.has(field.css2)) {
            warnings.push(`Field '${field.name}' has unknown css2 value: '${part}'`);
            break;
          }
        }
      }

      // Check visible syntax
      if (field.visible && field.visible !== 'false') {
        const validVisible = VISIBLE_PATTERNS.some(p => p.test(field.visible));
        if (!validVisible) {
          warnings.push(`Field '${field.name}' has unusual visible syntax: '${field.visible}'`);
        }
      }
    }

    // Check matrix forms have form-level choices
    if (form.type === 'left full matrixWithComments') {
      const hasMatrixRadio = form.fields.some(f => f.template === 'matrixRadio');
      if (hasMatrixRadio && !form.hasChoices) {
        errors.push(`Form '${form.name}' (matrixWithComments) requires form-level 'choices' for matrixRadio fields`);
      }
    }
  }

  return { valid: errors.length === 0, errors, warnings };
}

// Extract a string value after a key like 'name' => 'value'
function extractString(code, key) {
  const regex = new RegExp(key + "\\s*=>\\s*'([^']*)'");
  const match = code.match(regex);
  return match ? match[1] : null;
}

// Simple form/field extraction using regex patterns
function extractForms(phpCode) {
  const forms = [];

  // Find form blocks by looking for 'name' => '...' patterns within forms array
  // This is a simplified parser that extracts key properties
  const formRegex = /\[\s*'name'\s*=>\s*'([^']*)'\s*,\s*'localName'\s*=>\s*'([^']*)'\s*,\s*'type'\s*=>\s*'([^']*)'/g;
  let match;

  while ((match = formRegex.exec(phpCode)) !== null) {
    const formStart = match.index;
    const form = {
      name: match[1],
      localName: match[2],
      type: match[3],
      hasChoices: false,
      fields: [],
    };

    // Find the extent of this form (balanced brackets)
    const formContent = extractBalancedBlock(phpCode, formStart);

    // Check for form-level choices
    form.hasChoices = /\n\t{2,3}'choices'\s*=>/.test(formContent);

    // Extract the 'fields' => [...] block from the form content
    const fieldsArrayMatch = formContent.match(/'fields'\s*=>\s*\[/);
    if (fieldsArrayMatch) {
      const fieldsStart = formContent.indexOf('[', fieldsArrayMatch.index + fieldsArrayMatch[0].length - 1);
      const fieldsContent = extractBalancedBlock(formContent, fieldsStart);

      // Now extract individual fields from the fields array
      const fieldRegex = /\[\s*(?:'name'\s*=>\s*'([^']*)')[\s\S]*?(?:'template'\s*=>\s*'([^']*)')/g;
      let fieldMatch;
      while ((fieldMatch = fieldRegex.exec(fieldsContent)) !== null) {
        const fieldBlock = extractBalancedBlock(fieldsContent, fieldMatch.index);
        const field = {
          name: fieldMatch[1],
          template: fieldMatch[2],
          hasChoices: /'choices'\s*=>/.test(fieldBlock),
          hasNestedFields: /'fields'\s*=>\s*\[/.test(fieldBlock),
          hasAddWord: /'addWord'\s*=>/.test(fieldBlock),
          hasLocalSubName: /'localSubName'\s*=>/.test(fieldBlock),
          css2: extractString(fieldBlock, "'css2'"),
          visible: extractString(fieldBlock, "'visible'"),
        };
        form.fields.push(field);
      }
    }

    forms.push(form);
  }

  return forms;
}

function extractBalancedBlock(code, startIndex) {
  let depth = 0;
  let started = false;
  let inString = false;
  let stringChar = null;
  let escaped = false;

  for (let i = startIndex; i < code.length; i++) {
    const ch = code[i];
    if (escaped) { escaped = false; continue; }
    if (ch === '\\') { escaped = true; continue; }
    if (inString) {
      if (ch === stringChar) inString = false;
      continue;
    }
    if (ch === "'" || ch === '"') { inString = true; stringChar = ch; continue; }
    if (ch === '[') { depth++; started = true; }
    if (ch === ']') {
      depth--;
      if (started && depth === 0) {
        return code.substring(startIndex, i + 1);
      }
    }
  }
  return code.substring(startIndex);
}

// Extract PHP code blocks from a Claude response
function extractPhpFromResponse(text) {
  const blocks = [];
  const regex = /```(?:php)?\s*\n([\s\S]*?)```/g;
  let match;
  while ((match = regex.exec(text)) !== null) {
    const code = match[1].trim();
    if (code.includes('<?php') || code.includes("'template'") || code.includes("'forms'")) {
      blocks.push(code);
    }
  }
  return blocks;
}

module.exports = { validate, extractPhpFromResponse };
