# Contributing

We welcome contributions to `negus-ethiopic-gregorian`! This document outlines how to contribute to the project.

## Development Setup

1. **Fork** the repository on GitHub
2. **Clone** your fork locally:
   ```bash
   git clone https://github.com/negusnati/negus-ethiopic-gregorian.git
   cd negus-ethiopic-gregorian
   ```
3. **Install dependencies**:
   ```bash
   npm ci
   ```
4. **Run tests** to ensure everything works:
   ```bash
   npm test
   ```
5. **Build** the project:
   ```bash
   npm run build
   ```

## Making Changes

1. **Create a branch** for your changes:
   ```bash
   git checkout -b feature/your-feature-name
   ```

2. **Make your changes** following the existing code style

3. **Add tests** for any new functionality

4. **Run tests** to ensure nothing is broken:
   ```bash
   npm test
   ```

5. **Build** the project:
   ```bash
   npm run build
   ```

6. **Commit** your changes with a descriptive message:
   ```bash
   git commit -m "Add: new feature description"
   ```

7. **Push** your branch to GitHub:
   ```bash
   git push origin feature/your-feature-name
   ```

8. **Create a Pull Request** on GitHub

## Code Style

- Use **TypeScript** with strict mode
- Follow **ESLint** and **Prettier** configurations
- Use **descriptive variable names**
- Add **JSDoc comments** for public APIs
- Keep functions **small and focused**

## Testing

- All code must have **unit tests**
- Tests should cover **edge cases**
- Run `npm test` before submitting PRs
- Aim for **100% test coverage** for new code

## Pull Request Process

1. **Update** the CHANGELOG.md with your changes
2. **Ensure** all tests pass
3. **Request review** from maintainers
4. **Address** any feedback
5. **Merge** will be handled by maintainers

## Issues and Feature Requests

- **Bug reports**: Include steps to reproduce, expected vs actual behavior
- **Feature requests**: Describe the use case and proposed API
- **Questions**: Use GitHub Discussions for general questions

## License

By contributing, you agree that your contributions will be licensed under the same MIT license as the original project.
