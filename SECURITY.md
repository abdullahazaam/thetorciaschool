# Security Policy

## Supported Versions

The `main` branch is the actively maintained version of this portfolio project.

## Reporting a Vulnerability

If you discover a security issue, please do not publish credentials, exploit details, or sensitive information in a public issue.

Instead, contact **Abdullah Azaam** through the contact information listed on the GitHub profile:

- GitHub: https://github.com/abdullahazaam
- LinkedIn: https://www.linkedin.com/in/abdullahazaam-dev/

When reporting an issue, include:

1. A short description of the vulnerability.
2. Steps to reproduce it, where safe to provide them.
3. The affected route or component.
4. Any suggested mitigation.

Please allow reasonable time for investigation and remediation before publicly disclosing the issue.

## Secret Handling

Never commit:

- MongoDB connection strings containing real credentials
- Cloudinary API secrets
- SMTP passwords or app passwords
- Admin authentication secrets
- Private keys or certificates
- Production environment files
- Database dumps containing private information

Use local environment variables for development and your hosting provider's secret/environment configuration for production.

If a secret is accidentally exposed, rotate it immediately and remove it from active use.
