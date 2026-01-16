# Contributing to Dragverse

Thank you for your interest in contributing to Dragverse! We welcome contributions from the community.

## Getting Started

1. Fork the repository
2. Clone your fork: `git clone https://github.com/your-username/dragverse-salti.git`
3. Create a new branch: `git checkout -b feature/your-feature-name`
4. Make your changes
5. Test your changes locally
6. Commit with a descriptive message
7. Push to your fork
8. Open a Pull Request

## Development Setup

Follow the installation instructions in [README.md](README.md).

## Code Style

- Use TypeScript for all new files
- Follow the existing code structure
- Use functional components with hooks
- Keep components small and focused
- Add comments for complex logic
- Format with Prettier (config in project)

## Component Guidelines

### File Structure
```
ComponentName.tsx
└── "use client" directive (if needed)
└── imports
└── types/interfaces
└── component function
└── export
```

### Naming Conventions
- Components: PascalCase (`VideoCard.tsx`)
- Utilities: camelCase (`uploadVideo.ts`)
- Constants: UPPER_SNAKE_CASE (`MAX_FILE_SIZE`)

## Commit Messages

Use clear, descriptive commit messages:

- `feat: Add video upload progress bar`
- `fix: Resolve livestream detection bug`
- `docs: Update README with new features`
- `style: Format navbar component`
- `refactor: Simplify upload validation logic`

## Pull Request Guidelines

1. **Title**: Clear and descriptive
2. **Description**: Explain what and why
3. **Screenshots**: For UI changes
4. **Testing**: Describe how you tested
5. **Breaking Changes**: Highlight if any

### PR Template
```markdown
## Description
Brief description of changes

## Type of Change
- [ ] Bug fix
- [ ] New feature
- [ ] Breaking change
- [ ] Documentation update

## Testing
How did you test these changes?

## Screenshots (if applicable)
Add screenshots here

## Checklist
- [ ] Code follows project style
- [ ] Self-reviewed my code
- [ ] Commented complex code
- [ ] Updated documentation
- [ ] No new warnings
- [ ] Tested locally
```

## Areas to Contribute

### High Priority
- Ceramic integration completion
- Stripe payment implementation
- Social media cross-posting (Bluesky, Farcaster, Lens)
- Creator analytics improvements

### Medium Priority
- Additional content filters
- Search functionality
- Mobile app (React Native)
- Performance optimizations

### Good First Issues
- UI polish and animations
- Documentation improvements
- Bug fixes
- Test coverage

## Questions?

- Open an issue for bugs
- Use discussions for questions
- Tag maintainers for urgent issues

## Code of Conduct

Be respectful, inclusive, and professional. We're building for the drag community - let's create a welcoming space for everyone.

---

Thank you for contributing to Dragverse! 🎭✨
