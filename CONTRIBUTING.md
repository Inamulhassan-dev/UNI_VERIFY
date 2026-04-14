# 🤝 Contributing to UNI-VERIFY

Thank you for your interest in contributing to UNI-VERIFY! We welcome contributions from the community.

## 📋 Table of Contents

- [Code of Conduct](#code-of-conduct)
- [How Can I Contribute?](#how-can-i-contribute)
- [Development Setup](#development-setup)
- [Pull Request Process](#pull-request-process)
- [Coding Standards](#coding-standards)
- [Commit Message Guidelines](#commit-message-guidelines)

---

## 📜 Code of Conduct

This project adheres to a Code of Conduct. By participating, you are expected to uphold this code. Please be respectful and constructive in all interactions.

---

## 🎯 How Can I Contribute?

### Reporting Bugs

Before creating bug reports, please check existing issues. When creating a bug report, include:

- **Clear title and description**
- **Steps to reproduce**
- **Expected vs actual behavior**
- **Screenshots** (if applicable)
- **Environment details** (OS, Python version, Node.js version)

### Suggesting Enhancements

Enhancement suggestions are tracked as GitHub issues. When creating an enhancement suggestion, include:

- **Clear title and description**
- **Use case and benefits**
- **Possible implementation approach**
- **Alternative solutions considered**

### Pull Requests

- Fill in the required template
- Follow the coding standards
- Include appropriate test coverage
- Update documentation as needed

---

## 🛠️ Development Setup

### Prerequisites

- Python 3.8+
- Node.js 18+
- Git

### Setup Steps

```bash
# 1. Fork and clone the repository
git clone https://github.com/YOUR_USERNAME/UNI_VERIFY.git
cd UNI_VERIFY

# 2. Create a new branch
git checkout -b feature/your-feature-name

# 3. Setup backend
cd backend
python -m venv .venv
.venv\Scripts\activate  # Windows
pip install -r requirements.txt

# 4. Setup frontend
cd ../frontend
npm install

# 5. Make your changes

# 6. Test your changes
# Backend: Run tests
# Frontend: npm run build

# 7. Commit and push
git add .
git commit -m "Add: your feature description"
git push origin feature/your-feature-name

# 8. Create Pull Request on GitHub
```

---

## 🔄 Pull Request Process

1. **Update Documentation**: Ensure README.md and other docs reflect your changes
2. **Test Thoroughly**: Test on Windows environment
3. **Follow Code Style**: Match existing code formatting
4. **Clear Commits**: Write meaningful commit messages
5. **PR Description**: Clearly describe what and why
6. **Review Process**: Address review comments promptly

### PR Checklist

- [ ] Code follows project style guidelines
- [ ] Self-review completed
- [ ] Comments added for complex code
- [ ] Documentation updated
- [ ] No new warnings generated
- [ ] Tests added/updated as needed
- [ ] All tests passing
- [ ] Dependent changes merged

---

## 💻 Coding Standards

### Python (Backend)

```python
# Follow PEP 8 style guide
# Use type hints
def calculate_similarity(text1: str, text2: str) -> float:
    """
    Calculate similarity between two texts.
    
    Args:
        text1: First text string
        text2: Second text string
        
    Returns:
        Similarity score between 0 and 1
    """
    pass

# Use meaningful variable names
originality_score = calculate_originality(project_text)

# Add docstrings to functions and classes
# Keep functions focused and small
# Use list comprehensions when appropriate
```

### TypeScript/React (Frontend)

```typescript
// Use TypeScript for type safety
interface Project {
  id: number;
  title: string;
  originalityScore: number;
}

// Use functional components with hooks
const ProjectCard: React.FC<{ project: Project }> = ({ project }) => {
  return (
    <div className="project-card">
      <h3>{project.title}</h3>
      <p>Score: {project.originalityScore}%</p>
    </div>
  );
};

// Use meaningful component and variable names
// Keep components small and focused
// Add comments for complex logic
```

### General Guidelines

- **Naming**: Use descriptive names for variables, functions, and classes
- **Comments**: Add comments for complex logic, not obvious code
- **Error Handling**: Always handle errors gracefully
- **Security**: Never commit sensitive data (passwords, keys, tokens)
- **Performance**: Consider performance implications of changes

---

## 📝 Commit Message Guidelines

### Format

```
<type>(<scope>): <subject>

<body>

<footer>
```

### Types

- **feat**: New feature
- **fix**: Bug fix
- **docs**: Documentation changes
- **style**: Code style changes (formatting, etc.)
- **refactor**: Code refactoring
- **test**: Adding or updating tests
- **chore**: Maintenance tasks

### Examples

```bash
# Good commit messages
feat(backend): Add duplicate detection for warehouse uploads
fix(frontend): Resolve login redirect issue
docs(readme): Update installation instructions
refactor(ml-engine): Optimize similarity calculation

# Bad commit messages
update stuff
fix bug
changes
```

### Commit Message Rules

- Use present tense ("Add feature" not "Added feature")
- Use imperative mood ("Move cursor to..." not "Moves cursor to...")
- First line should be 50 characters or less
- Reference issues and pull requests when relevant
- Explain what and why, not how

---

## 🧪 Testing

### Backend Tests

```bash
cd backend
.venv\Scripts\activate
pytest
```

### Frontend Tests

```bash
cd frontend
npm test
npm run build  # Ensure build succeeds
```

---

## 📚 Documentation

When adding new features:

1. Update README.md if user-facing
2. Add docstrings to Python functions
3. Add JSDoc comments to TypeScript functions
4. Update API documentation if endpoints change
5. Add examples for complex features

---

## 🐛 Debugging

### Backend Debugging

```python
# Add debug logging
import logging
logging.basicConfig(level=logging.DEBUG)
logger = logging.getLogger(__name__)

logger.debug(f"Processing project: {project_id}")
```

### Frontend Debugging

```typescript
// Use console.log for debugging
console.log('Project data:', project);

// Use React DevTools
// Use browser developer tools
```

---

## 🎨 UI/UX Guidelines

- Follow existing design patterns
- Ensure responsive design (mobile, tablet, desktop)
- Use Tailwind CSS classes consistently
- Maintain accessibility standards
- Test on different browsers

---

## 🔒 Security

- Never commit sensitive data
- Use environment variables for configuration
- Validate all user inputs
- Follow OWASP security guidelines
- Report security vulnerabilities privately

---

## 📞 Getting Help

- 💬 GitHub Discussions for questions
- 🐛 GitHub Issues for bugs
- 📧 Email for security issues

---

## 🙏 Thank You!

Your contributions make UNI-VERIFY better for everyone. We appreciate your time and effort!

---

## 📄 License

By contributing, you agree that your contributions will be licensed under the MIT License.
