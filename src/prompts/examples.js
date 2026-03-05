// api/src/prompts/examples.js
// Curated best-practice examples for Claude to reference.

const examples = [
  {
    title: 'Basic client information tab',
    description: 'Demonstrates: input, radio, select, textarea, address group with map, contact persons repeat',
    code: `<?php

$basicInfo = [
\t'name' => 'basic',
\t'localName' => 'Basisgegevens',
\t'noVersions' => true,
\t'forms' => [
\t\t[
\t\t\t'name' => 'passport',
\t\t\t'localName' => 'Paspoort',
\t\t\t'type' => 'left',
\t\t\t'fields' => [
\t\t\t\t[
\t\t\t\t\t'name' => 'lastName',
\t\t\t\t\t'localName' => 'Achternaam',
\t\t\t\t\t'template' => 'input'
\t\t\t\t],
\t\t\t\t[
\t\t\t\t\t'name' => 'dateOfBirth',
\t\t\t\t\t'localName' => 'Geboortedatum',
\t\t\t\t\t'template' => 'input',
\t\t\t\t\t'css2' => 'date',
\t\t\t\t],
\t\t\t\t[
\t\t\t\t\t'name' => 'gender',
\t\t\t\t\t'localName' => 'Geslacht',
\t\t\t\t\t'choices' => [
\t\t\t\t\t\t['value' => 'male', 'label' => 'Man'],
\t\t\t\t\t\t['value' => 'female', 'label' => 'Vrouw'],
\t\t\t\t\t],
\t\t\t\t\t'template' => 'radio'
\t\t\t\t],
\t\t\t\t[
\t\t\t\t\t'name' => 'nationality',
\t\t\t\t\t'localName' => 'Nationaliteit',
\t\t\t\t\t'choices' => [
\t\t\t\t\t\t['value' => 'null', 'label' => ' '],
\t\t\t\t\t\t['value' => 'nl', 'label' => 'Nederlands'],
\t\t\t\t\t\t['value' => 'be', 'label' => 'Belgisch'],
\t\t\t\t\t\t['value' => 'de', 'label' => 'Duits'],
\t\t\t\t\t\t['value' => 'other', 'label' => 'Overig'],
\t\t\t\t\t],
\t\t\t\t\t'template' => 'select'
\t\t\t\t],
\t\t\t]
\t\t],
\t\t[
\t\t\t'name' => 'address',
\t\t\t'localName' => 'Adres',
\t\t\t'type' => 'right',
\t\t\t'fields' => [
\t\t\t\t['name' => 'postalCode', 'localName' => 'Postcode', 'template' => 'input', 'css2' => 'mapPostalCode'],
\t\t\t\t['name' => 'houseNumber', 'localName' => 'Huisnummer', 'template' => 'input', 'css2' => 'mapHouseNumber'],
\t\t\t\t['name' => 'street', 'localName' => 'Straat', 'template' => 'input', 'css2' => 'mapStreet'],
\t\t\t\t['name' => 'city', 'localName' => 'Woonplaats', 'template' => 'input', 'css2' => 'mapCity'],
\t\t\t\t['name' => 'map1', 'localName' => '', 'template' => 'map'],
\t\t\t]
\t\t],
\t\t[
\t\t\t'name' => 'contactPersons',
\t\t\t'localName' => 'Contactpersonen',
\t\t\t'type' => 'right',
\t\t\t'fields' => [
\t\t\t\t[
\t\t\t\t\t'name' => 'contactPersons',
\t\t\t\t\t'template' => 'repeat',
\t\t\t\t\t'addWord' => 'contactpersoon',
\t\t\t\t\t'fields' => [
\t\t\t\t\t\t['name' => 'label', 'localName' => 'Titel', 'template' => 'input'],
\t\t\t\t\t\t['name' => 'name', 'localName' => 'Naam (voluit)', 'template' => 'input'],
\t\t\t\t\t\t['name' => 'telMobile', 'localName' => 'Mobiele nummer', 'template' => 'input'],
\t\t\t\t\t\t['name' => 'tel', 'localName' => 'Telefoon', 'template' => 'input'],
\t\t\t\t\t\t['name' => 'email', 'localName' => 'E-mail', 'template' => 'input'],
\t\t\t\t\t]
\t\t\t\t]
\t\t\t]
\t\t],
\t]
];`
  },
  {
    title: 'Medical tab with conditional visibility',
    description: 'Demonstrates: checkbox, conditional visibility (fieldName#value, fieldName#any), textarea variants, yes/no radio with follow-up',
    code: `<?php

$medical = [
\t'name' => 'medical',
\t'localName' => 'Medisch',
\t'forms' => [
\t\t[
\t\t\t'name' => 'diagnosis',
\t\t\t'localName' => 'Diagnose',
\t\t\t'type' => 'left',
\t\t\t'fields' => [
\t\t\t\t[
\t\t\t\t\t'name' => 'primaryDiagnosis',
\t\t\t\t\t'localName' => 'Primaire diagnose',
\t\t\t\t\t'template' => 'input'
\t\t\t\t],
\t\t\t\t[
\t\t\t\t\t'name' => 'symptoms',
\t\t\t\t\t'localName' => 'Symptomen',
\t\t\t\t\t'choices' => [
\t\t\t\t\t\t['value' => 'fever', 'label' => 'Koorts'],
\t\t\t\t\t\t['value' => 'pain', 'label' => 'Pijn'],
\t\t\t\t\t\t['value' => 'fatigue', 'label' => 'Vermoeidheid'],
\t\t\t\t\t\t['value' => 'other', 'label' => 'Overig'],
\t\t\t\t\t],
\t\t\t\t\t'template' => 'checkbox'
\t\t\t\t],
\t\t\t\t[
\t\t\t\t\t'name' => 'symptomsOther',
\t\t\t\t\t'localName' => '',
\t\t\t\t\t'template' => 'textarea',
\t\t\t\t\t'placeholder' => 'Overige symptomen',
\t\t\t\t\t'visible' => 'symptoms#other'
\t\t\t\t],
\t\t\t\t[
\t\t\t\t\t'name' => 'notes',
\t\t\t\t\t'localName' => 'Toelichting',
\t\t\t\t\t'template' => 'textarea2'
\t\t\t\t],
\t\t\t]
\t\t],
\t\t[
\t\t\t'name' => 'medication',
\t\t\t'localName' => 'Medicatie',
\t\t\t'type' => 'right',
\t\t\t'fields' => [
\t\t\t\t[
\t\t\t\t\t'name' => 'hasMedication',
\t\t\t\t\t'localName' => 'Gebruikt medicatie',
\t\t\t\t\t'choices' => [
\t\t\t\t\t\t['value' => 'yes', 'label' => 'Ja'],
\t\t\t\t\t\t['value' => 'no', 'label' => 'Nee'],
\t\t\t\t\t],
\t\t\t\t\t'template' => 'radio'
\t\t\t\t],
\t\t\t\t[
\t\t\t\t\t'name' => 'medicationList',
\t\t\t\t\t'template' => 'repeat',
\t\t\t\t\t'addWord' => 'medicatie',
\t\t\t\t\t'visible' => 'hasMedication#yes',
\t\t\t\t\t'fields' => [
\t\t\t\t\t\t['name' => 'label', 'localName' => 'Naam', 'template' => 'input3'],
\t\t\t\t\t\t['name' => 'dosage', 'localName' => 'Dosering', 'template' => 'input'],
\t\t\t\t\t\t['name' => 'description', 'localName' => 'Toelichting', 'template' => 'textarea2'],
\t\t\t\t\t]
\t\t\t\t],
\t\t\t]
\t\t],
\t]
];`
  },
  {
    title: 'Risk assessment matrix',
    description: 'Demonstrates: matrixHeader, matrixRadio, form-level choices with labelShort, matrixWithComments type, #any visibility for follow-up textareas',
    code: `<?php

$riskAssessment = [
\t'name' => 'risk',
\t'localName' => 'Risico inventarisatie',
\t'forms' => [
\t\t[
\t\t\t'name' => 'riskMatrix',
\t\t\t'localName' => 'Risico inventarisatie (en maatregelen)',
\t\t\t'type' => 'left full matrixWithComments',
\t\t\t'choices' => [
\t\t\t\t['value' => 'A', 'label' => 'Zeer laag', 'labelShort' => 'A'],
\t\t\t\t['value' => 'B', 'label' => 'Laag', 'labelShort' => 'B'],
\t\t\t\t['value' => 'C', 'label' => 'Hoog', 'labelShort' => 'C'],
\t\t\t\t['value' => 'D', 'label' => 'Zeer hoog', 'labelShort' => 'D'],
\t\t\t],
\t\t\t'fields' => [
\t\t\t\t['name' => 'riskHeader', 'localName' => '', 'localSubName' => '', 'template' => 'matrixHeader'],
\t\t\t\t['name' => 'risk1', 'localName' => 'Fysieke agressie', 'template' => 'matrixRadio'],
\t\t\t\t['name' => 'risk1b', 'localName' => '', 'placeholder' => 'Maatregelen', 'template' => 'textarea', 'visible' => 'risk1#any'],
\t\t\t\t['name' => 'risk2', 'localName' => 'Verbale agressie', 'template' => 'matrixRadio'],
\t\t\t\t['name' => 'risk2b', 'localName' => '', 'placeholder' => 'Maatregelen', 'template' => 'textarea', 'visible' => 'risk2#any'],
\t\t\t\t['name' => 'risk3', 'localName' => 'Zelfbeschadiging', 'template' => 'matrixRadio'],
\t\t\t\t['name' => 'risk3b', 'localName' => '', 'placeholder' => 'Maatregelen', 'template' => 'textarea', 'visible' => 'risk3#any'],
\t\t\t]
\t\t],
\t]
];`
  },
  {
    title: 'Settings tab with collapse and enable/disable forms',
    description: 'Demonstrates: collapse, visible with COLLAPSE#open, disableForm/enableForm, visible with FORM.formName, date fields',
    code: `<?php

$settings = [
\t'name' => 'settings',
\t'localName' => 'Instellingen',
\t'forms' => [
\t\t[
\t\t\t'name' => 'registration',
\t\t\t'localName' => 'Registratie',
\t\t\t'type' => 'left',
\t\t\t'fields' => [
\t\t\t\t[
\t\t\t\t\t'name' => 'startDate',
\t\t\t\t\t'localName' => 'Startdatum',
\t\t\t\t\t'template' => 'input',
\t\t\t\t\t'css2' => 'date',
\t\t\t\t],
\t\t\t\t[
\t\t\t\t\t'name' => 'endDate',
\t\t\t\t\t'localName' => 'Einddatum',
\t\t\t\t\t'template' => 'input',
\t\t\t\t\t'css2' => 'date future',
\t\t\t\t],
\t\t\t\t[
\t\t\t\t\t'name' => 'remarksCollapse',
\t\t\t\t\t'localName' => 'Opmerkingen',
\t\t\t\t\t'template' => 'collapse',
\t\t\t\t],
\t\t\t\t[
\t\t\t\t\t'name' => 'remarks',
\t\t\t\t\t'localName' => 'Opmerkingen',
\t\t\t\t\t'template' => 'textarea2',
\t\t\t\t\t'visible' => 'remarksCollapse#open'
\t\t\t\t],
\t\t\t\t[
\t\t\t\t\t'name' => 'removeRegistration',
\t\t\t\t\t'localName' => 'Registratie',
\t\t\t\t\t'template' => 'disableForm',
\t\t\t\t\t'visible' => 'FORM.registration'
\t\t\t\t],
\t\t\t\t[
\t\t\t\t\t'name' => 'addRegistration',
\t\t\t\t\t'localName' => 'Registratie',
\t\t\t\t\t'template' => 'enableForm',
\t\t\t\t\t'visible' => 'FORM.registration2'
\t\t\t\t],
\t\t\t]
\t\t],
\t\t[
\t\t\t'name' => 'documents',
\t\t\t'localName' => 'Documenten',
\t\t\t'type' => 'right',
\t\t\t'fields' => [
\t\t\t\t[
\t\t\t\t\t'name' => 'documents',
\t\t\t\t\t'localName' => 'Bestanden',
\t\t\t\t\t'template' => 'files',
\t\t\t\t\t'addWord' => 'bestand',
\t\t\t\t\t'max' => 10,
\t\t\t\t],
\t\t\t\t[
\t\t\t\t\t'name' => 'consent',
\t\t\t\t\t'localName' => 'Handtekening',
\t\t\t\t\t'template' => 'signature',
\t\t\t\t],
\t\t\t]
\t\t],
\t]
];`
  },
];

function formatExamples() {
  return examples.map(ex =>
    `### Example: ${ex.title}\n${ex.description}\n\n\`\`\`php\n${ex.code}\n\`\`\``
  ).join('\n\n');
}

module.exports = { examples, formatExamples };
