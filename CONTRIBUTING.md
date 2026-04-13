# Contributing to the SAIP Frontend Project

Thanks for helping build the SAIP platform! To keep our work clean and consistent, please follow these basic guidelines when contributing code.

---

## 📚 Branch Naming Convention

When creating a new branch, use the following format:

- `feature/[short-description]` → for new components or features
- `bugfix/[short-description]` → for fixing existing bugs
- `hotfix/[short-description]` → for urgent patches
- `docs/[short-description]` → for documentation/storybook updates
- `test/[component-name]` → for test-related additions

**Examples:**

- `feature/add-service-card`
- `bugfix/tabs-not-scrollable`
- `docs/update-tabvertical-stories`
- `test/button-component`

---

## ✅ Pull Request Template

Each merge request should use the following structure:

```
### 🔍 What’s been done?
_A short summary of the issue and what was changed._

---

### 📸 Screenshots (if UI was changed)
_Add before/after screenshots for clarity – especially for mobile/RTL._

---

### ✅ Checklist
- [ ] Code is formatted & linted
- [ ] Only relevant files are changed
- [ ] PR title follows conventional commits (e.g. `fix:`, `feat:`, `docs:`)
- [ ] I’ve tested my changes and reviewed the diff before submitting
```

---

## 🧪 Testing

- We use **Vitest** + **React Testing Library**.
- Test files live alongside components using the `.test.tsx` naming convention.
- Run tests with:

```bash
npm run test
```

---

## 🧼 Pre-commit

Follow pre-commit rules (formatting, typechecking). If you encounter issues with Git, try:

```bash
git pull --no-rebase
```

---

## 🙋 Questions?

Ask in `#front-end-developer-team` Slack channel or DM @robertgrzonka personally.
