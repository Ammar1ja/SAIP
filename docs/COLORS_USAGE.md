# Color Usage Guide - SAIP Project

## Brand Colors (Figma)

According to Figma design system (EXSP-1243):

- **Primary Color**: `#074D31` (success-900) - Dark green
- **Secondary/Accent Color**: `#1B8354` (primary-600) - Light green

## How to Use Colors in Components

### 1. Tailwind Classes (Recommended)

We've mapped Tailwind's default `green` palette to our `success` colors:

```tsx
// ✅ GOOD - Uses our brand colors automatically
<div className="bg-green-700 text-white">  // → #067647 (success-700)
<button className="bg-green-900">         // → #074D31 (success-900) PRIMARY
<span className="text-green-600">         // → #079455 (success-600)
```

### 2. Icon Backgrounds

```tsx
// ✅ GOOD - Uses success-900 (#074D31)
<Icon
  src="/icons/example.svg"
  background="green" // Mapped to bg-success-900
  size="large"
/>
```

### 3. Buttons

```tsx
// ✅ GOOD - Uses our brand colors from tailwind.config.js
<Button intent="primary">    // → #074D31 (PRIMARY)
<Button intent="secondary">  // → Light gray (NOT green - design decision)
```

### 4. Custom Colors (Only when necessary)

```tsx
// ⚠️ USE SPARINGLY - Only for specific cases
<div style={{ backgroundColor: '#074D31' }}>
```

## Color Tokens Reference

### Success Palette (Green = Our Brand)

```
success-25:  #F6FEF9
success-50:  #ECFDF3
success-100: #DCFAE6
success-200: #ABDFC6
success-300: #75E0A7
success-400: #47CD89
success-500: #17B26A
success-600: #079455
success-700: #067647  ← Commonly used for active states
success-800: #085D3A
success-900: #074D31  ← PRIMARY BRAND COLOR
success-950: #053321
```

### Primary Palette (Accent)

```
primary-600: #1B8354  ← SECONDARY/ACCENT COLOR
primary-700: #166A45
```

## Common Patterns

### Primary Actions

```tsx
<Button intent="primary">      // Dark green (#074D31)
<Icon background="green">      // Dark green (#074D31)
```

### Hover States

```tsx
hover: bg - green - 800; // #085D3A - Slightly darker
hover: text - green - 700; // #067647
```

### Active/Selected States

```tsx
className = 'bg-green-700 text-white'; // Active menu item
```

### Borders

```tsx
border - green - 600; // #079455
```

## ❌ Don't Use

1. **Hardcoded hex values** (unless absolutely necessary):

   ```tsx
   // ❌ BAD
   <div style={{ color: '#2E8B57' }}>
   ```

2. **Tailwind's default green palette** - It's already overridden:
   ```tsx
   // These now use our success colors automatically
   bg - green - 500; // → #17B26A (our success-500)
   ```

## Files Configuration

- **Color tokens**: `styles/tokens/colors.ts`
- **Tailwind config**: `tailwind.config.js` (green → success mapping)
- **Button styles**: `components/atoms/Button/Button.styles.tsx`
- **Icon styles**: `components/atoms/Icon/Icon.styles.tsx`
- **Global CSS**: `styles/globals.css` (date picker, etc.)

## Migration from Old Colors

If you find components using old colors:

```tsx
// ❌ OLD (wrong color)
bg-[#2E8B57]  // or #1B8354 as primary

// ✅ NEW (correct)
bg-green-900  // Uses #074D31 (PRIMARY)
bg-green-700  // Uses #067647 (active states)
```

## Questions?

For more details, see Jira issue **EXSP-1243**: "Brand colors don't match Figma"
