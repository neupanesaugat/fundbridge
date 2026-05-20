# FundBridge - Community Crowdfunding Platform

FundBridge is a functional React/Vite academic project demo for a crowdfunding platform. It supports campaign browsing, filtering, campaign creation, demo donations, a login demo, dashboard statistics, campaign updates, and local browser storage.

## Features

- Home page with platform summary
- Campaign listing with search, category filter, and sorting
- Campaign details modal
- Demo donation flow that updates raised amount and backer count
- Campaign creation form
- Dashboard with live statistics
- Add campaign updates from dashboard
- Delete campaigns from dashboard
- Demo login/logout
- Data persistence using `localStorage`
- Responsive design for desktop, tablet, and mobile

## Tech Stack

- React
- Vite
- CSS
- Framer Motion
- Lucide React icons

## How to Run Locally

1. Install Node.js from https://nodejs.org/
2. Open this folder in a terminal.
3. Install dependencies:

```bash
npm install
```

4. Start the development server:

```bash
npm run dev
```

5. Open the local URL shown in the terminal, usually:

```text
http://localhost:5173
```

## Build for Deployment

```bash
npm run build
```

The production files will be created in the `dist` folder.

## Deploy Public Demo

You can deploy this project easily using Vercel or Netlify:

- Push the folder to GitHub.
- Import the repository in Vercel or Netlify.
- Build command: `npm run build`
- Output directory: `dist`

## Demo Login

You can use any email and password in the demo login form. The default values are:

- Email: `demo@fundbridge.com`
- Password: `password123`

## Notes for Academic Report

This demo uses mock/local donation processing. In a real production system, payment processing would be integrated with a secure payment gateway such as Stripe, PayPal, or a bank payment API.
# fundbridge
