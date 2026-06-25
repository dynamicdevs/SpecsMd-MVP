# Friccion Cero Frontend

Angular 21 and PrimeNG frontend for the Friccion Cero MVP.

## Setup

Run from `friccion-cero/frontend`:

```bash
npm install
npm start
```

The app runs at:

```text
http://localhost:4200
```

## Backend API

The frontend expects the backend API at:

```text
http://localhost:3000
```

The API base URL is configured in:

```text
src/environments/environment.ts
```

## Main Screens

- Dashboard
- Friction list
- Friction create/edit/detail
- Initiative list
- Initiative detail

## Commands

```bash
npm start
npm run build
npm test -- --watch=false
npm audit --omit=dev
```

## Notes

- PrimeNG provides the UI components.
- API access is centralized under `src/app/core/api`.
- Shared models live under `src/app/core/models`.
- Feature screens live under `src/app/features`.
