# SAIP - Technical Documentation

## Overview

SAIP is a modern web application built with Next.js 15 (App Router) and React 19, developed using TypeScript. The project follows Atomic Design principles for component organization and utilizes Tailwind CSS v4 for styling.

## Technology Stack

### Core Technologies

- **Framework:** Next.js 15 (App Router)
- **UI Library:** React 19.1.0
- **Language:** TypeScript 5.8.2
- **Styling:** Tailwind CSS 4.0.17 with design tokens
- **State Management:** React Context API, [@tanstack/react-query](https://tanstack.com/query/latest) 5.71.1

### Styling & UI

- **CSS Utilities:** [class-variance-authority](https://cva.style/docs) 0.7.1, [tailwind-merge](https://github.com/dcastil/tailwind-merge) 3.1.0
- **CSS Processing:** PostCSS 8.5.3 via `@tailwindcss/postcss` 4.0.17
- **Scrollbar Customization:** tailwind-scrollbar 4.0.2

### Internationalization

- **i18n Framework:** i18next 24.2.3, react-i18next 15.4.1

### Development Tools

- **Linting:** ESLint 9.23.0
- **Formatting:** Prettier 3.5.3
- **Git Hooks:** Husky 9.1.7, lint-staged 15.5.0
- **Commit Standards:** @commitlint/cli 19.8.0, @commitlint/config-conventional 19.8.0
- **SVG Handling:** @svgr/webpack 8.1.0
- **Accessibility Testing:** @axe-core/react 4.10.1
- **Package Manager:** npm

## Architecture

### Directory Structure

```
saip/
├── app/                           # Next.js App Router routes
│   ├── layout.tsx                 # Root layout (global UI elements)
│   └── page.tsx                   # Homepage
├── components/                    # Component library (Atomic Design)
│   ├── atoms/                     # UI primitives
│   ├── molecules/                 # Composite components
│   └── organisms/                 # Complex UI sections
├── hooks/                         # Custom React hooks
├── lib/                           # Utilities and business logic
│   └── utils.ts                   # Helper functions
├── public/                        # Static assets
│   ├── fonts/                     # Font files
│   └── images/                    # Static image assets
├── styles/                        # Global styles
│   ├── globals.css                # Global CSS and Tailwind imports
│   └── tokens/                    # Design tokens (colors, spacing, etc.)
├── types/                         # TypeScript type definitions
├── .commitlintrc.json             # Commitlint configuration
├── .eslintrc.js                   # ESLint configuration
├── .gitignore                     # Git ignore patterns
├── .prettierrc                    # Prettier configuration
├── .prettierignore                # Files to ignore during formatting
├── lint-staged.config.js          # Lint-staged configuration
├── next.config.ts                 # Next.js configuration
├── postcss.config.mjs             # PostCSS configuration
├── tailwind.config.js             # Tailwind CSS configuration
├── tsconfig.json                  # TypeScript configuration
└── package.json                   # Project dependencies and scripts
```

### Component Architecture

Components follow Atomic Design methodology, organized as:

| Level       | Description                       | Examples                              |
| ----------- | --------------------------------- | ------------------------------------- |
| `atoms`     | Basic UI primitives               | Button, Heading, Icon, Label          |
| `molecules` | Combinations of atoms             | Card, Hero, ContentBlock, VideoPlayer |
| `organisms` | Complex, section-level components | Footer, FeaturedNews, OurValues       |

Each component typically includes:

- Component implementation (`.tsx`)
- Styling via CVA (`.styles.ts`) when variants are needed
- TypeScript types when appropriate

## Styling Implementation

The project uses Tailwind CSS v4 with a custom design system:

- Design tokens defined in `styles/tokens/` are integrated into Tailwind's theme
- `class-variance-authority` (CVA) provides typed component variants
- `tailwind-merge` handles class name merging to prevent conflicts
- Global styles and Tailwind imports are configured in `globals.css`
- Fonts are loaded via `@font-face` in global CSS

## Build & Development

### Scripts

- `npm run dev` - Start development server
- `npm run build` - Build production-ready application
- `npm run start` - Run production build locally
- `npm run lint` - Run ESLint on TypeScript files
- `npm run format` - Run Prettier formatting
- `npm run typecheck` - Type-check the project without emitting files

### Configuration Files

- **next.config.ts** - Next.js configuration including redirects, rewrites, and build options
- **tailwind.config.js** - Tailwind CSS setup with custom design tokens integration
- **postcss.config.mjs** - PostCSS plugins configuration for Tailwind
- **tsconfig.json** - TypeScript compiler options and path aliases
- **.eslintrc.js** - Linting rules and plugins
- **.prettierrc** - Code formatting preferences
- **.commitlintrc.json** - Conventional commit format enforcement

### Quality Assurance

- Pre-commit hooks via Husky run linting and formatting
- ESLint enforces code quality rules
- Prettier ensures consistent formatting
- Conventional Commits standard (`type(scope): description`) enforced by commitlint
- Accessibility testing with axe-core/react

## Coding Standards

### Naming Conventions

- **Folders:** lowercase-with-dashes
- **Components:** PascalCase
- **Utility files:** camelCase
- **Hooks:** camelCase, prefixed with `use`

### Component Guidelines

- Maintain clear separation between atoms, molecules, and organisms
- Keep components focused on single responsibilities
- Co-locate component styles and types with implementations
- Prioritize accessibility with semantic HTML and ARIA attributes

### Styling Patterns

- Use CVA for components with variants
- Prefer composable Tailwind classes over custom CSS
- Utilize design tokens for consistency

## Contact

For technical questions or support:  
`robert.grzonka@crafton.pl`
