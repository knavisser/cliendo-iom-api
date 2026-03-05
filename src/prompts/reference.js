// api/src/prompts/reference.js
// Complete reference documentation for the Cliendo PHP form configuration format.
// This replaces raw PHP examples in the Claude system prompt.

const reference = `
## PHP Form Configuration Reference

### Overview

Cliendo form configurations are PHP files that define tab structures containing nested forms and fields. Each file assigns a PHP array to a variable using \`$variableName\` notation.

### Structure Hierarchy

\`\`\`
Tab (top-level array)
├── name (string, required) — camelCase identifier
├── localName (string, required) — display label (Dutch by default)
├── noVersions (bool, optional) — disable version tracking
├── noSignatures (bool, optional) — disable signatures
└── forms (array, required) — array of form groups
    └── Form
        ├── name (string, required) — identifier
        ├── localName (string, required) — section heading
        ├── type (string, required) — layout type
        ├── fields (array, required) — field definitions
        ├── choices (array, optional) — form-level choices for matrixRadio
        ├── enabled (bool, optional) — whether form starts enabled
        ├── info (string, optional) — tooltip HTML
        └── infoIntake (string, optional) — intake-specific tooltip
            └── Field
                ├── name (string, required) — camelCase identifier, unique within form
                ├── localName (string, usually required) — field label
                ├── template (string, required) — template type
                ├── choices (array, optional) — for radio/select/checkbox/options
                ├── css2 (string, optional) — CSS behavior class
                ├── css (string, optional) — wrapper CSS class
                ├── visible (string|false, optional) — conditional visibility
                ├── info (string, optional) — tooltip HTML
                ├── infoIntake (string, optional) — intake tooltip
                ├── placeholder (string, optional) — placeholder text
                ├── addWord (string, optional) — "add" button label (repeat/files)
                ├── fields (array, optional) — nested fields (repeat template)
                ├── variation (int, optional) — repeat display variant (2 or 3)
                ├── max (int, optional) — max items (files template)
                ├── localSubName (string, optional) — subtitle (matrixHeader)
                ├── readOnly (bool, optional) — field-level read-only
                ├── required (bool, optional) — validation required
                └── assertMsg (string, optional) — custom error message
\`\`\`

### Form Type Values

| Value | Description |
|-------|-------------|
| \`'left'\` | Standard left column |
| \`'right'\` | Standard right column |
| \`'left full'\` | Full width, left aligned (used for matrix and wide forms) |
| \`'left full matrixWithComments'\` | Full width matrix with comment textareas after each row |

Alternate forms between 'left' and 'right' for visual balance in the two-column layout.

### Template Types — Complete Reference

#### Text Input Templates

| Template | Label | Rows | Notes |
|----------|-------|------|-------|
| \`input\` | Left side | — | Standard single-line text input |
| \`input2\` | Indented right | — | Sub-field under a parent, no left label |
| \`input3\` | Left side | — | Same as input, typically used inside repeat groups |
| \`input4\` | Left side | — | Uses localName as placeholder text |
| \`input-readonly\` | Left side | — | Always read-only, cannot be edited |

#### Textarea Templates

| Template | Label | Rows | Notes |
|----------|-------|------|-------|
| \`textarea\` | Left side | 2 | Small multi-line with label |
| \`textarea2\` | None | 6 | Large multi-line, no left label |
| \`textarea3\` | None | 3 | Medium multi-line, no left label |

#### Selection Templates

| Template | Label | Notes |
|----------|-------|-------|
| \`radio\` | Left side | Radio button group |
| \`radio2\` | None | Radio group without left label |
| \`radio3\` | Left side | Radio with responsive mobile layout |
| \`select\` | Left side | Dropdown. First option should be empty: \`['value' => 'null', 'label' => ' ']\` |
| \`select2\` | None | Dropdown without left label |
| \`checkbox\` | Left side | Multi-select checkbox group. Values stored as \`#val1#val2#\` format |
| \`checkbox2\` | None | Checkbox group without left label |
| \`options\` | Left side | Advanced multi-select with search, "Other" freetext, and optional description |

#### Repeatable Groups

| Template | Label | Notes |
|----------|-------|-------|
| \`repeat\` | None | Repeatable field group. Requires \`addWord\` (button label) and nested \`fields\` array |

Repeat fields support a \`variation\` property:
- Default (no variation): Collapsible instances with title bar showing label/time
- \`variation: 2\`: Compact layout without title bar
- \`variation: 3\`: Inline layout with gray "add" button

#### Signature Templates

| Template | Label | Notes |
|----------|-------|-------|
| \`signature\` | Left side | Canvas signature with agreement checkbox, timestamp, and IP recording |
| \`signature2\` | Left side | Simplified canvas signature without agreement tracking |

#### File Upload Templates

| Template | Label | Notes |
|----------|-------|-------|
| \`file\` | Left side | Single file upload (max 1). Requires \`addWord\` |
| \`files\` | Left side | Multi-file upload. Optional \`max\` property. Requires \`addWord\` |
| \`files2\` | None | Multi-file upload without left label |

#### Matrix Templates

Used together in forms with \`type: 'left full matrixWithComments'\`:

| Template | Notes |
|----------|-------|
| \`matrixHeader\` | Column header row. Requires \`localSubName\`. Uses parent form's \`choices\` |
| \`matrixRadio\` | Data row with radio buttons. Uses parent form's \`choices\` |

Matrix choices at form level must include \`labelShort\`:
\`\`\`php
'choices' => [
    ['value' => 'A', 'label' => 'Very Low', 'labelShort' => 'A'],
    ['value' => 'B', 'label' => 'Low', 'labelShort' => 'B'],
]
\`\`\`

#### Layout & Display Templates

| Template | Notes |
|----------|-------|
| \`plainTitle\` | Displays localName as text-only heading (no input) |
| \`collapse\` | Toggle checkbox that shows/hides dependent fields. Value is 'open' or '' |
| \`spacer\` | Empty element for visual spacing |
| \`map\` | Embedded Google Map |
| \`disableForm\` | Button to remove/disable a form section. Use with \`visible: 'FORM.formName'\` |
| \`enableForm\` | Button to add/enable a form section. Use with \`visible: 'FORM.formName2'\` |

### Visibility Syntax

The \`visible\` property controls conditional field display:

| Pattern | Meaning | Example |
|---------|---------|---------|
| \`'fieldName#value'\` | Show when field equals value | \`'visible' => 'incidentType#type12'\` |
| \`'fieldName#any'\` | Show when field has any value | \`'visible' => 'risc1#any'\` |
| \`'prev#value'\` | Show based on previous field | \`'visible' => 'prev#yes'\` |
| \`'COLLAPSE_NAME#open'\` | Show when collapse is open | \`'visible' => 'detailsCollapse#open'\` |
| \`'FORM.formName'\` | Show when form is enabled | \`'visible' => 'FORM.wmoOrJeugdwet'\` |
| \`false\` | Always hidden | \`'visible' => false\` |

### CSS2 Classes

| Class | Behavior |
|-------|----------|
| \`'date'\` | Date input formatting and validation |
| \`'date future'\` | Date with future-date validation |
| \`'mapPostalCode'\` | Triggers address lookup from postal code |
| \`'mapHouseNumber'\` | Triggers address lookup from house number |
| \`'mapStreet'\` | Auto-filled street from address lookup |
| \`'mapCity'\` | Auto-filled city from address lookup |
| \`'postalCode'\` | Postal code formatting |
| \`'houseNumber'\` | House number field |
| \`'street'\` | Street field |
| \`'city'\` | City field |
| \`'toggleNextOn'\` | Show next field when this has a value |
| \`'toggleNextOff'\` | Hide next field when this has a value |
| \`'notice'\` | Style field as notice/info (used with css property on wrapper) |
| \`'normalWidth'\` | Override default width |

### Choices Array Format

For radio, select, checkbox, and options templates:
\`\`\`php
'choices' => [
    ['value' => 'null', 'label' => ' '],  // empty default (select only)
    ['value' => 'optionId', 'label' => 'Display Text'],
]
\`\`\`

Rules:
- Select templates should have an empty first option: \`['value' => 'null', 'label' => ' ']\`
- Radio/checkbox do NOT need an empty option
- Values should be camelCase or short codes
- Labels are Dutch by default

### Common Field Patterns

#### Address Group
\`\`\`php
['name' => 'postalCode', 'localName' => 'Postcode', 'template' => 'input', 'css2' => 'mapPostalCode'],
['name' => 'houseNumber', 'localName' => 'Huisnummer', 'template' => 'input', 'css2' => 'mapHouseNumber'],
['name' => 'street', 'localName' => 'Straat', 'template' => 'input', 'css2' => 'mapStreet'],
['name' => 'city', 'localName' => 'Woonplaats', 'template' => 'input', 'css2' => 'mapCity'],
['name' => 'map1', 'localName' => '', 'template' => 'map'],
\`\`\`

#### Contact Persons (Repeat)
\`\`\`php
[
    'name' => 'contactPersons',
    'template' => 'repeat',
    'addWord' => 'contactpersoon',
    'fields' => [
        ['name' => 'label', 'localName' => 'Titel', 'template' => 'input'],
        ['name' => 'name', 'localName' => 'Naam (voluit)', 'template' => 'input'],
        ['name' => 'telMobile', 'localName' => 'Mobiele nummer', 'template' => 'input'],
        ['name' => 'tel', 'localName' => 'Telefoon', 'template' => 'input'],
        ['name' => 'email', 'localName' => 'E-mail', 'template' => 'input'],
    ]
]
\`\`\`

#### Gender Radio
\`\`\`php
[
    'name' => 'gender',
    'localName' => 'Geslacht',
    'choices' => [
        ['value' => 'male', 'label' => 'Man'],
        ['value' => 'female', 'label' => 'Vrouw'],
    ],
    'template' => 'radio'
]
\`\`\`

#### Yes/No Radio
\`\`\`php
[
    'name' => 'fieldName',
    'localName' => 'Label',
    'choices' => [
        ['value' => 'yes', 'label' => 'Ja'],
        ['value' => 'no', 'label' => 'Nee'],
    ],
    'template' => 'radio'
]
\`\`\`

#### Conditional Follow-up
\`\`\`php
[
    'name' => 'hasAllergy',
    'localName' => 'Allergie',
    'choices' => [['value' => 'yes', 'label' => 'Ja'], ['value' => 'no', 'label' => 'Nee']],
    'template' => 'radio'
],
[
    'name' => 'allergyDetails',
    'localName' => 'Toelichting',
    'template' => 'textarea',
    'visible' => 'hasAllergy#yes'
],
\`\`\`

#### Collapse Section
\`\`\`php
[
    'name' => 'detailsCollapse',
    'localName' => 'Details tonen',
    'template' => 'collapse',
],
[
    'name' => 'details',
    'localName' => 'Details',
    'template' => 'textarea2',
    'visible' => 'detailsCollapse#open'
],
\`\`\`

#### Matrix Risk Assessment
\`\`\`php
// Form level:
'type' => 'left full matrixWithComments',
'choices' => [
    ['value' => 'A', 'label' => 'Zeer laag', 'labelShort' => 'A'],
    ['value' => 'B', 'label' => 'Laag', 'labelShort' => 'B'],
    ['value' => 'C', 'label' => 'Hoog', 'labelShort' => 'C'],
    ['value' => 'D', 'label' => 'Zeer hoog', 'labelShort' => 'D'],
],
// Fields:
['name' => 'header', 'localName' => '', 'localSubName' => '', 'template' => 'matrixHeader'],
['name' => 'risk1', 'localName' => 'Fysieke agressie', 'template' => 'matrixRadio'],
['name' => 'risk1b', 'localName' => '', 'placeholder' => 'Maatregelen', 'template' => 'textarea', 'visible' => 'risk1#any'],
\`\`\`

### Output Rules

1. Always start with \`<?php\` on the first line
2. Use tab indentation (not spaces)
3. Use single quotes for all strings
4. Assign to \`$variableName\` using camelCase
5. Field names use camelCase
6. localName values in Dutch unless user specifies otherwise
7. Every select should have a null/empty first option
8. Group related fields into forms, alternating type 'left' and 'right'
9. Output the complete file — never output diffs or partial code
10. No PHP logic (no if/else, function calls, or variable references) — only static arrays
`;

module.exports = { reference };
