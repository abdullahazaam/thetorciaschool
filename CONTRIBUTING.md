# Contributing

This repository is primarily a portfolio project, but constructive feedback and improvements are welcome.

## Before Opening a Pull Request

Run:

```bash
npm install
npm run lint
npm run build
```

Please also verify that:

- No secrets or environment files are staged.
- Public pages still work on desktop and mobile.
- Admin authentication and protected routes still work.
- Forms handle validation and error states correctly.
- Database and external-service integrations remain configurable through environment variables.

## Commit Style

Use clear, focused commit messages, for example:

- `feat: add admissions validation`
- `fix: prevent duplicate news rendering`
- `docs: improve deployment instructions`
- `refactor: simplify admin session handling`

Keep unrelated changes out of the same commit whenever practical.

## Code Style

- Prefer small, reusable components.
- Keep server-side secrets out of client components.
- Validate user-controlled input.
- Keep environment-specific configuration outside tracked source files.
- Avoid unnecessary dependencies.
