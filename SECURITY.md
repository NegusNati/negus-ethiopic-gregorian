# Security Policy

## Supported Versions

This project follows semantic versioning. Security updates are provided for:

| Version | Supported          |
| ------- | ------------------ |
| 1.x.x   | :white_check_mark: |
| 0.x.x   | :x:                |

## Reporting a Vulnerability

We take security seriously. If you discover a security vulnerability, please follow these guidelines:

### How to Report

1. **Do not** open a public issue on GitHub
2. **Email** the maintainers at: [your-email@example.com]
3. **Include** the following information:
   - Description of the vulnerability
   - Steps to reproduce
   - Potential impact
   - Suggested fix (if available)
   - Your name/handle (optional)

### Response Timeline

- **Acknowledgment**: We will respond within 48 hours
- **Investigation**: Initial assessment within 1 week
- **Fix**: Security patches released within 2-4 weeks (depending on severity)
- **Disclosure**: Coordinated disclosure with the reporter

### Vulnerability Severity

We use the following severity levels:

- **Critical**: Immediate security risk requiring urgent attention
- **High**: Significant security risk
- **Medium**: Moderate security risk
- **Low**: Minor security risk

### Security Best Practices

This library is designed with security in mind:

- **No external dependencies** - reduces supply chain attack surface
- **Pure functions** - no side effects or global state
- **Integer math only** - no floating point precision issues
- **Input validation** - strict type checking and bounds validation
- **UTC-only operations** - no timezone-related vulnerabilities

## Security Considerations

### Date Calculations
- All date conversions use integer math to avoid floating-point precision issues
- Input validation prevents out-of-bounds dates
- Leap year calculations follow established algorithms

### No External Dependencies
- Zero runtime dependencies minimize supply chain risks
- All calculations are implemented in pure TypeScript

### Memory Safety
- No dynamic memory allocation in core algorithms
- All data structures are statically typed
- No use of `eval()` or other dynamic code execution

## Testing Security

We maintain comprehensive test coverage including:

- Edge cases and boundary conditions
- Invalid input handling
- Round-trip conversion accuracy
- Leap year calculations
- Large date ranges

## Responsible Disclosure

We follow responsible disclosure practices:

1. Vulnerabilities are fixed before public disclosure
2. Reporters are credited (with permission)
3. Security advisories are published with fix details
4. Users are notified through release notes and security advisories

## Contact

- **Security Email**: [your-email@example.com]
- **GitHub Issues**: Use for non-security related issues only
- **Project Lead**: [Your Name]

Thank you for helping keep `negus-ethiopic-gregorian` secure!
