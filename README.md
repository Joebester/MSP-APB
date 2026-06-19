# MSP eWallet Registration

Responsive React + Tailwind CSS implementation of the MSP eWallet registration flow.

## Screens

1. **Registration Intro** – Requirements checklist with gradient hero
2. **Step 1: Verify** – Phone OTP (Laos) or Email verification (International)
3. **Step 2: General Details** – Personal info and address form
4. **Step 3: Set PIN** – 6-digit PIN keypad
5. **Terms & Conditions** – Scrollable legal text with agreement checkbox
6. **Confirm Registration** – Review applicant details before submit
7. **Registration Success** – Confirmation screen

## Tech Stack

- React 19 + Vite
- Tailwind CSS v4
- React Router
- Lucide React (icons)

## Getting Started

```bash
npm install
npm run dev
```

Open [http://localhost:5173](http://localhost:5173) in your browser.

## Project Structure

```
src/
├── components/
│   ├── brand/          # MSP logo
│   ├── layout/         # Header, page container, step footer
│   ├── registration/   # Registration-specific UI
│   └── ui/             # Reusable Button, Input, Select, Checkbox
├── constants/          # Step config, provinces, terms text
├── context/            # Registration form state
├── hooks/              # usePinEntry
├── pages/
│   └── registration/   # All registration screens
├── routes/             # React Router config
├── App.jsx
├── main.jsx
└── index.css
```

## Build

```bash
npm run build
npm run preview
```
