# Getting Started with Vercel Web Analytics

This guide explains how Vercel Web Analytics is set up in this Code Persona project and how to use it effectively.

## Overview

Vercel Web Analytics helps you understand how users interact with your application by tracking page views and collecting performance metrics. This project uses `@vercel/analytics` for seamless integration with Vercel deployments.

## Prerequisites

Before working with Vercel Web Analytics, ensure you have:

- A Vercel account. If you don't have one, you can [sign up for free](https://vercel.com/signup)
- A Vercel project. If you don't have one, you can [create a new project](https://vercel.com/new)
- The Vercel CLI installed (optional but recommended):

```bash
# Using pnpm
pnpm i vercel

# Using yarn
yarn i vercel

# Using npm
npm i vercel

# Using bun
bun i vercel
```

## Current Setup

### Package Installation

The `@vercel/analytics` package is already installed in this project. You can verify this by checking `package.json`:

```json
{
  "dependencies": {
    "@vercel/analytics": "^1.6.1"
  }
}
```

### Integration in React

The Analytics component is already integrated into the main App component (`src/App.tsx`):

```tsx
import { Analytics } from "@vercel/analytics/react";

const App = () => (
  <QueryClientProvider client={queryClient}>
    <ThemeProvider attribute="class" defaultTheme="dark" enableSystem>
      <TooltipProvider>
        <Toaster />
        <Sonner />
        <BrowserRouter>
          <TransitionProvider>
            <AppContent />
          </TransitionProvider>
        </BrowserRouter>
        <Analytics />
      </TooltipProvider>
    </ThemeProvider>
  </QueryClientProvider>
);

export default App;
```

The `<Analytics />` component is placed at the root level of the application, ensuring all page views and interactions are tracked.

## Enabling Analytics in Vercel Dashboard

To enable Web Analytics for your project:

1. Go to the [Vercel Dashboard](https://vercel.com/dashboard)
2. Select your project
3. Click the **Analytics** tab
4. Click **Enable** from the dialog

**Note:** Enabling Web Analytics will add new routes (scoped at `/_vercel/insights/*`) after your next deployment.

## Deploying to Vercel

### Using Vercel CLI

Deploy your app using the following command:

```bash
vercel deploy
```

### Using Git Integration

We recommend connecting your project's Git repository to enable automatic deployments:

1. Push your code to a Git repository (GitHub, GitLab, or Bitbucket)
2. Import the repository on [Vercel](https://vercel.com/new)
3. Vercel will automatically deploy your latest commits to the `main` branch

## Verifying Analytics Setup

Once deployed, verify that analytics tracking is working:

1. Open your deployed application in a browser
2. Open the browser's Developer Tools (F12 or Cmd+Option+I)
3. Go to the **Network** tab
4. Look for a Fetch/XHR request from `/_vercel/insights/view`

This request indicates that analytics data is being sent to Vercel.

## Viewing Analytics Data

After deployment and once users have visited your site:

1. Go to your [Vercel Dashboard](https://vercel.com/dashboard)
2. Select your project
3. Click the **Analytics** tab
4. After a few days of visitor activity, you'll be able to explore your data through various panels

## Key Metrics Tracked

Vercel Web Analytics automatically tracks:

- **Page Views**: Number of times pages are viewed
- **Visitors**: Unique users visiting your site
- **Core Web Vitals**: Performance metrics including:
  - Largest Contentful Paint (LCP)
  - First Input Delay (FID)
  - Cumulative Layout Shift (CLS)

## Advanced Features

### Custom Events

Users on Pro and Enterprise plans can track custom events to monitor:

- Button clicks
- Form submissions
- Feature usage
- Purchases
- Any other important user interactions

See [Custom Events Documentation](/docs/analytics/custom-events) for implementation details.

### Data Filtering

You can filter analytics data by:

- Date ranges
- Device type
- Browser
- Operating system
- Geographic location
- And more

See [Filtering Documentation](/docs/analytics/filtering) for more information.

## Deployment Verification Checklist

Before your analytics data starts flowing, ensure:

- [ ] `@vercel/analytics` is installed in `package.json`
- [ ] `<Analytics />` component is added to your root component (App.tsx)
- [ ] Your app is deployed to Vercel
- [ ] Web Analytics is enabled in the Vercel Dashboard
- [ ] At least one deployment has been made after enabling analytics

## Privacy and Compliance

Vercel Web Analytics is designed with privacy in mind. For detailed information about how Vercel handles data and compliance with various standards:

- [GDPR Compliance](/docs/analytics/privacy-policy)
- [Data Retention Policies](/docs/analytics/privacy-policy)
- [Privacy Documentation](/docs/analytics/privacy-policy)

## Troubleshooting

### Analytics data not appearing

**Problem:** After deployment, no analytics data appears in the dashboard

**Solution:**
1. Verify Web Analytics is enabled in the Vercel Dashboard
2. Check that `<Analytics />` component is present in your app
3. Wait at least 5-10 minutes for initial data to appear
4. Clear browser cache and reload the site
5. Check browser console for any errors

### Missing Core Web Vitals data

**Problem:** Core Web Vitals metrics are not showing

**Solution:**
1. Ensure your app has real user traffic
2. Core Web Vitals require at least 100 real user sessions
3. Data is aggregated over 28 days by default

### Script not loading

**Problem:** The `/_vercel/insights/script.js` fails to load

**Solution:**
1. Check that Web Analytics is enabled in Vercel Dashboard
2. Verify deployment completed successfully
3. Check for Content Security Policy (CSP) issues that might block the script

## Configuration Options

The Analytics component supports minimal configuration as it auto-detects routes in React applications using React Router, which is configured in this project.

For more advanced configuration options, refer to the [@vercel/analytics package documentation](https://github.com/vercel/analytics).

## Next Steps

Now that Vercel Web Analytics is set up, explore:

1. **[@vercel/analytics Package Documentation](https://www.npmjs.com/package/@vercel/analytics)** - Detailed package reference
2. **[Custom Events Guide](/docs/analytics/custom-events)** - Track user interactions
3. **[Data Filtering Guide](/docs/analytics/filtering)** - Analyze your data
4. **[Pricing Information](/docs/analytics/limits-and-pricing)** - Understand plan limits
5. **[Troubleshooting Guide](/docs/analytics/troubleshooting)** - Resolve common issues

## Additional Resources

- [Vercel Analytics Home](https://vercel.com/analytics)
- [Vercel Documentation](https://vercel.com/docs)
- [@vercel/analytics GitHub](https://github.com/vercel/analytics)
- [Web Vitals Guide](https://web.dev/vitals/)

## Support

For issues or questions about Vercel Web Analytics:

1. Check the [Vercel Documentation](https://vercel.com/docs/analytics)
2. Review the [Troubleshooting Guide](/docs/analytics/troubleshooting)
3. Contact [Vercel Support](https://vercel.com/support)
