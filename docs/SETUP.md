# Project Setup and Configuration

## Quick Start

### Prerequisites
- Node.js 18+ (or use nvm to manage versions)
- pnpm, yarn, npm, or bun as your package manager

### Installation

```bash
# Install dependencies
pnpm install

# Start development server
pnpm dev

# Build for production
pnpm build

# Preview production build
pnpm preview

# Run linter
pnpm lint
```

## Project Structure

```
codepersona/
├── src/
│   ├── components/        # React components
│   ├── contexts/          # React context providers
│   ├── hooks/             # Custom React hooks
│   ├── integrations/      # External service integrations
│   ├── lib/               # Utility functions and libraries
│   ├── pages/             # Page components (routes)
│   ├── App.tsx            # Root app component
│   ├── main.tsx           # Entry point
│   └── index.css          # Global styles
├── public/                # Static assets
├── docs/                  # Documentation
├── vite.config.ts         # Vite configuration
├── tsconfig.json          # TypeScript configuration
├── tailwind.config.ts     # Tailwind CSS configuration
├── postcss.config.js      # PostCSS configuration
└── package.json           # Project dependencies
```

## Key Technologies

### Frontend Framework
- **React 18.3**: UI library
- **TypeScript**: Type safety
- **Vite**: Fast build tool

### Styling
- **Tailwind CSS**: Utility-first CSS framework
- **shadcn/ui**: Component library built on Radix UI
- **Class Variance Authority**: Type-safe component variants

### UI Components
- **Radix UI**: Headless UI primitive components
- **Lucide React**: Icon library

### State Management & Data Fetching
- **React Query**: Server state management
- **React Router v6**: Client-side routing
- **Context API**: App-wide state (theme, transitions)

### Form Handling
- **React Hook Form**: Form state management
- **Zod**: Schema validation
- **@hookform/resolvers**: Integration between form and validation

### Data & Integrations
- **Supabase**: Backend-as-a-service
- **GitHub API**: (@octokit) for analyzing GitHub activity
- **Vercel Analytics**: User behavior tracking

### Additional Libraries
- **Framer Motion**: Animation library
- **GSAP**: Professional animation platform
- **date-fns**: Date utilities
- **next-themes**: Theme management
- **sonner**: Toast notifications
- **recharts**: Data visualization

## Development Workflow

### Running in Development

```bash
pnpm dev
```

The development server runs at `http://localhost:8080` with hot module replacement (HMR).

### Linting

```bash
pnpm lint
```

Uses ESLint with TypeScript and React hooks support.

### Building for Production

```bash
pnpm build
```

Creates an optimized build in the `dist/` directory.

### Preview Production Build

```bash
pnpm preview
```

Preview the production build locally.

## Analytics Configuration

Vercel Web Analytics is already integrated in the application. See [VERCEL_WEB_ANALYTICS.md](./VERCEL_WEB_ANALYTICS.md) for detailed setup and usage instructions.

### Quick Analytics Setup
1. Install: `@vercel/analytics` (already installed)
2. Component is added in `src/App.tsx`
3. Enable in Vercel Dashboard
4. Deploy to Vercel
5. View data in Analytics tab

## Environment Configuration

### Local Development
The project uses Vite with automatic environment variable loading. Create a `.env.local` file for sensitive variables:

```env
# Example: GitHub token for API calls
VITE_GITHUB_TOKEN=your_token_here

# Supabase configuration
VITE_SUPABASE_URL=your_url_here
VITE_SUPABASE_ANON_KEY=your_key_here
```

### Vercel Deployment
Environment variables for production should be set in the Vercel dashboard.

## Database

This project uses **Supabase** (PostgreSQL-based) for backend functionality. Configuration is in the `supabase/` directory.

## Build Configuration

### Vite Config (`vite.config.ts`)
- TypeScript support via @vitejs/plugin-react-swc
- Path aliases for clean imports
- Development server on `::` (IPv4/IPv6)

### TypeScript Config
- Target: ES2020
- Module: ESNext
- JSX: React-JSX

### Tailwind Config
- Dark mode enabled
- Custom fonts and animations
- Extended color palette

## Performance Optimization

### Code Splitting
- Vite automatically splits code for optimal loading

### Lazy Loading
- Routes use React Router's lazy loading

### Caching
- Static assets served with appropriate cache headers

### Monitoring
- Vercel Analytics tracks Core Web Vitals
- Monitor LCP, FID, and CLS metrics

## Deployment

### Vercel Deployment

1. **Connect Repository**
   ```bash
   vercel link
   ```

2. **Deploy**
   ```bash
   vercel deploy
   ```
   Or push to the connected Git repository for automatic deployment.

3. **Production Build**
   The project automatically builds when deployed:
   - Optimized bundle
   - Tree shaking
   - Code minification

### Environment Variables in Vercel
1. Go to Project Settings → Environment Variables
2. Add required variables for production
3. Redeploy to apply changes

## Troubleshooting

### Port Already in Use
If port 8080 is already in use:
```bash
pnpm dev -- --port 3000
```

### Build Failures
1. Clear node_modules: `rm -rf node_modules && pnpm install`
2. Clear Vite cache: `rm -rf .vite`
3. Check TypeScript errors: `tsc --noEmit`

### Analytics Not Showing
See [VERCEL_WEB_ANALYTICS.md](./VERCEL_WEB_ANALYTICS.md#troubleshooting)

## Contributing

1. Create a feature branch
2. Make your changes
3. Run linter: `pnpm lint`
4. Build to verify: `pnpm build`
5. Commit and push
6. Create a pull request

## License

See LICENSE file for details.
