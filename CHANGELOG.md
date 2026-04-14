# 📝 Changelog

All notable changes to UNI-VERIFY will be documented in this file.

The format is based on [Keep a Changelog](https://keepachangelog.com/en/1.0.0/),
and this project adheres to [Semantic Versioning](https://semver.org/spec/v2.0.0.html).

---

## [1.0.0] - 2026-04-14

### 🎉 Initial Release

#### ✨ Added

**Backend Features:**
- FastAPI backend server with Uvicorn
- JWT-based authentication system
- bcrypt password hashing
- SQLite database with SQLAlchemy ORM
- ML-powered similarity detection using Sentence Transformers
- Multi-format document processing (PDF, DOCX, TXT, PPTX)
- Compressed document storage with gzip
- Admin user creation script
- Data warehouse management system
- Duplicate detection for warehouse uploads
- RESTful API with automatic documentation
- CORS middleware for frontend integration

**Frontend Features:**
- Next.js 14 with App Router
- TypeScript for type safety
- Tailwind CSS with glassmorphism design
- Responsive UI components
- Student registration and login
- Project upload with drag & drop
- Real-time originality scoring
- Similarity report visualization
- Admin dashboard with statistics
- Project review and approval system
- Data warehouse management interface
- User management interface

**Installation & Deployment:**
- Automated setup script (SETUP_FIRST_TIME.bat)
- Application launcher (START.bat)
- Application stopper (STOP.bat)
- Portable USB package creator (CREATE_PORTABLE_ZIP.bat)
- Comprehensive documentation suite

**Documentation:**
- Advanced README with emojis and badges
- Detailed installation guide
- Quick start guide
- Workflow diagrams
- API documentation
- Contributing guidelines
- License file

**Security:**
- JWT token authentication
- Password hashing with bcrypt
- CORS protection
- Input validation with Pydantic
- SQL injection prevention with ORM

**Database Models:**
- User model (students and admins)
- Project model (submissions)
- Submission model (analysis results)
- WarehouseProject model (reference documents)

**API Endpoints:**
- `/api/auth/register` - User registration
- `/api/auth/login` - User login
- `/api/auth/me` - Get current user
- `/api/projects/upload` - Upload project
- `/api/projects/my-projects` - Get user projects
- `/api/projects/{id}` - Get project details
- `/api/admin/projects` - Get all projects (admin)
- `/api/admin/projects/{id}/status` - Update status (admin)
- `/api/admin/stats` - Get statistics (admin)
- `/api/admin/users` - Get all users (admin)
- `/api/admin/warehouse/upload` - Upload to warehouse (admin)
- `/api/admin/warehouse/projects` - Get warehouse projects (admin)
- `/api/admin/warehouse/{id}` - Delete warehouse project (admin)
- `/api/health` - Health check

**ML Features:**
- Sentence Transformers (all-MiniLM-L6-v2 model)
- Semantic similarity calculation
- Embedding generation and storage
- Cosine similarity comparison
- Originality score calculation (0-100%)
- Similar project detection
- Threshold-based duplicate detection

**UI Components:**
- Navbar with authentication state
- FileUpload component with drag & drop
- OriginalityScore display
- SimilarityReport visualization
- ProjectAnalysis dashboard
- Admin statistics cards
- User management table
- Warehouse management interface

#### 🔧 Configuration

- Environment variable support
- Configurable CORS origins
- Configurable ports (3000 for frontend, 8000 for backend)
- Configurable database URL
- Configurable JWT secret key
- Configurable token expiration

#### 📚 Documentation

- README.md with comprehensive project information
- INSTALLATION_GUIDE.txt with step-by-step instructions
- QUICK_START.txt for quick reference
- WORKFLOW_DIAGRAM.txt with visual workflows
- PACKAGING_INSTRUCTIONS.txt for distribution
- API documentation at /docs endpoint
- Inline code comments and docstrings

#### 🎨 Design

- Modern glassmorphism UI
- Gradient backgrounds
- Smooth animations
- Responsive layout
- Dark theme
- Accessible color contrast
- Loading states
- Error handling UI

#### 🚀 Performance

- Compressed document storage
- Efficient embedding storage as bytes
- Database indexing on key fields
- Lazy loading of components
- Optimized API responses
- Fast similarity calculations

#### 🐛 Bug Fixes

- None (initial release)

#### 🔒 Security

- Secure password storage
- Token-based authentication
- Protected admin routes
- Input sanitization
- File upload validation
- CORS configuration
- SQL injection prevention

---

## [Unreleased]

### 🔮 Planned Features

- Email notifications for project status
- Batch project upload
- Export reports to PDF
- Advanced analytics dashboard
- Project comparison tool
- Plagiarism percentage breakdown
- Multi-language support
- Dark/Light theme toggle
- Mobile app version
- Integration with LMS systems
- Advanced search and filters
- Project categories and tags
- Automated testing suite
- Docker containerization
- Cloud deployment guides

---

## Version History

- **1.0.0** (2026-04-14) - Initial release with full features

---

## 📞 Support

For issues, questions, or suggestions:
- 🐛 [GitHub Issues](https://github.com/Inamulhassan-dev/UNI_VERIFY/issues)
- 💬 [GitHub Discussions](https://github.com/Inamulhassan-dev/UNI_VERIFY/discussions)
- 📧 Email: support@univerify.com

---

## 🙏 Acknowledgments

Special thanks to:
- St. Philomena's College for supporting this project
- FastAPI team for the excellent framework
- Next.js team for the powerful React framework
- Sentence Transformers for ML capabilities
- Open source community for tools and libraries

---

[1.0.0]: https://github.com/Inamulhassan-dev/UNI_VERIFY/releases/tag/v1.0.0
