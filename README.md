# Employee Wizard

A 2-step role-based employee wizard and list page built with React + TypeScript.

## Demo

Deployed at: https://employee-wizard-assignment.vercel.app

## Setup

```bash
npm install
npm run api:step1   # http://localhost:4001
npm run api:step2   # http://localhost:4002
npm run dev
```

## Features

- **Admin:** Step 1 + Step 2
- **Ops:** Step 2 only
- Async autocomplete for departments and locations (`name_like` queries)
- Auto-generated employee ID (`<3-letter dept>-<3-digit seq>`)
- Photo upload with preview and Base64 storage
- Draft auto-save every 2 seconds per role (localStorage)
- Sequential submit: POST `/basicInfo` then POST `/details` with progress log
- Employee list with merged data, placeholders, and pagination

## Testing

```bash
npm test
```

Automated tests cover:

- Department autocomplete fetching and rendering suggestions
- Submit flow sequential POST + progress states

UI flows (validation, loading, error states, pagination) were verified manually.
