<div align="center">

# 🎓 UNI-VERIFY

### Project Originality Validation Portal

[![Python](https://img.shields.io/badge/Python-3.8+-blue.svg)](https://www.python.org/downloads/)
[![Node.js](https://img.shields.io/badge/Node.js-18+-green.svg)](https://nodejs.org/)
[![FastAPI](https://img.shields.io/badge/FastAPI-0.109+-009688.svg)](https://fastapi.tiangolo.com/)
[![Next.js](https://img.shields.io/badge/Next.js-14+-black.svg)](https://nextjs.org/)
[![License](https://img.shields.io/badge/License-MIT-yellow.svg)](LICENSE)

**AI-Powered Academic Integrity System for St. Philomena's College**

[Features](#-features) • [Installation](#-installation) • [Usage](#-usage) • [Documentation](#-documentation) • [Support](#-support)

![UNI-VERIFY Banner](https://via.placeholder.com/1200x300/1a1a2e/ffffff?text=UNI-VERIFY+Project+Originality+Validation)

</div>

---

## 📋 Table of Contents

- [Overview](#-overview)
- [Features](#-features)
- [Tech Stack](#-tech-stack)
- [Project Structure](#-project-structure)
- [Installation](#-installation)
  - [Prerequisites](#prerequisites)
  - [Quick Start](#quick-start)
  - [Portable USB Installation](#portable-usb-installation)
- [Usage](#-usage)
  - [For Students](#for-students)
  - [For Administrators](#for-administrators)
- [API Documentation](#-api-documentation)
- [Configuration](#-configuration)
- [Troubleshooting](#-troubleshooting)
- [Contributing](#-contributing)
- [License](#-license)
- [Support](#-support)

---

## 🌟 Overview

**UNI-VERIFY** is a comprehensive web application designed to validate the originality of student projects using advanced AI-powered similarity detection. Built for St. Philomena's College, it helps maintain academic integrity by analyzing submitted documents and comparing them against a database of existing projects.

### 🎯 Key Highlights

- 🤖 **AI-Powered Analysis** - Uses Sentence Transformers for semantic similarity detection
- ⚡ **Real-Time Processing** - Instant originality scoring within seconds
- 📊 **Comprehensive Reports** - Detailed similarity analysis with visual representations
- 🔒 **Secure & Private** - JWT-based authentication with encrypted passwords
- 📱 **Responsive Design** - Modern UI that works on all devices
- 💾 **Efficient Storage** - Compressed document storage to save space
- 🌐 **Multi-Format Support** - PDF, DOCX, TXT, and PPTX documents

---

## ✨ Features

### 👨‍🎓 For Students

- ✅ **Easy Document Upload** - Drag & drop or browse to upload projects
- ✅ **Instant Originality Score** - Get 0-100% originality rating immediately
- ✅ **Similarity Reports** - View which projects are similar and by how much
- ✅ **Submission History** - Track all your past submissions
- ✅ **Detailed Analysis** - Receive suggestions for improving originality
- ✅ **Multiple Formats** - Support for PDF, DOCX, TXT, PPTX files
- ✅ **Real-Time Status** - Track approval status (Pending/Approved/Rejected)

### 👨‍💼 For Administrators

- ✅ **Dashboard Analytics** - Comprehensive statistics and insights
- ✅ **Review System** - Approve or reject student submissions
- ✅ **Data Warehouse** - Build and manage reference document library
- ✅ **User Management** - View and manage all registered users
- ✅ **Bulk Operations** - Upload multiple reference documents
- ✅ **Duplicate Detection** - Automatic detection of duplicate uploads
- ✅ **Export Reports** - Generate and download analysis reports

### 🔧 Technical Features

- 🤖 **ML-Powered** - Sentence Transformers for semantic understanding
- 🚀 **Fast API** - High-performance backend with FastAPI
- ⚛️ **Modern Frontend** - React/Next.js with TypeScript
- 💾 **Smart Storage** - Gzip compression for efficient storage
- 🔐 **Secure Auth** - JWT tokens with bcrypt password hashing
- 📊 **SQLite Database** - Lightweight and portable database
- 🎨 **Beautiful UI** - Tailwind CSS with glassmorphism design
- 🌐 **CORS Enabled** - Secure cross-origin resource sharing

---

## 🛠️ Tech Stack

### Backend
- **Framework:** FastAPI 0.109+
- **Language:** Python 3.8+
- **ML Engine:** Sentence Transformers
- **Database:** SQLite with SQLAlchemy ORM
- **Authentication:** JWT (python-jose) + bcrypt
- **Document Processing:** PyMuPDF, python-docx, python-pptx
- **Server:** Uvicorn ASGI

### Frontend
- **Framework:** Next.js 14+
- **Language:** TypeScript
- **Styling:** Tailwind CSS
- **UI Components:** Custom React components
- **State Management:** React Hooks
- **HTTP Client:** Fetch API

### DevOps
- **Version Control:** Git
- **Package Managers:** pip (Python), npm (Node.js)
- **Environment:** Virtual environments (.venv)

---

## 📁 Project Structure

```
UNI_VERIFY/
│
├── 📂 backend/                      # FastAPI Backend Server
│   ├── 📄 main.py                  # Main API application
│   ├── 📄 auth.py                  # Authentication & JWT logic
│   ├── 📄 database.py              # Database models & config
│   ├── 📄 ml_engine.py             # ML similarity detection
│   ├── 📄 document_processor.py    # Document text extraction
│   ├── 📄 create_admin.py          # Admin user creation script
│   ├── 📄 requirements.txt         # Python dependencies
│   ├── 📂 .venv/                   # Python virtual environment
│   ├── 📂 uploads/                 # Uploaded documents storage
│   ├── 📂 data_warehouse/          # Reference documents storage
│   └── 📄 uni_verify.db            # SQLite database
│
├── 📂 frontend/                     # Next.js Frontend Application
│   ├── 📂 src/
│   │   ├── 📂 app/                 # Next.js app directory
│   │   │   ├── 📂 admin/           # Admin dashboard pages
│   │   │   │   ├── 📄 page.tsx    # Admin home
│   │   │   │   └── 📂 warehouse/  # Data warehouse management
│   │   │   ├── 📂 dashboard/       # Student dashboard
│   │   │   ├── 📂 login/           # Login page
│   │   │   ├── 📂 register/        # Registration page
│   │   │   ├── 📄 layout.tsx       # Root layout
│   │   │   ├── 📄 page.tsx         # Landing page
│   │   │   └── 📄 globals.css      # Global styles
│   │   ├── 📂 components/          # Reusable React components
│   │   │   ├── 📄 Navbar.tsx       # Navigation bar
│   │   │   ├── 📄 FileUpload.tsx   # File upload component
│   │   │   ├── 📄 OriginalityScore.tsx
│   │   │   ├── 📄 SimilarityReport.tsx
│   │   │   └── 📄 ProjectAnalysis.tsx
│   │   └── 📂 lib/
│   │       └── 📄 api.ts            # API client utilities
│   ├── 📂 public/                   # Static assets
│   ├── 📄 package.json              # Node.js dependencies
│   ├── 📄 tsconfig.json             # TypeScript config
│   ├── 📄 next.config.ts            # Next.js config
│   └── 📄 tailwind.config.ts        # Tailwind CSS config
│
├── 📄 SETUP_FIRST_TIME.bat          # 🔧 First-time installation script
├── 📄 START.bat                     # ▶️ Application launcher
├── 📄 STOP.bat                      # ⏹️ Application stopper
├── 📄 README.md                     # 📖 This file
├── 📄 INSTALLATION_GUIDE.txt        # 📋 Detailed installation guide
├── 📄 QUICK_START.txt               # ⚡ Quick reference guide
├── 📄 WORKFLOW_DIAGRAM.txt          # 📊 Visual workflow diagrams
└── 📄 .gitignore                    # Git ignore rules
```

---

## 🚀 Installation

### Prerequisites

Before installing UNI-VERIFY, ensure you have:

| Requirement | Version | Download Link |
|------------|---------|---------------|
| 🐍 Python | 3.8 or higher | [python.org](https://www.python.org/downloads/) |
| 📦 Node.js | 18 or higher | [nodejs.org](https://nodejs.org/) |
| 💾 Disk Space | 2-5 GB free | - |
| 🌐 Internet | Required for setup | - |

> ⚠️ **Important:** When installing Python, make sure to check **"Add Python to PATH"** during installation!

---

### Quick Start

#### Option 1: Automated Setup (Recommended)

```bash
# 1. Clone the repository
git clone https://github.com/Inamulhassan-dev/UNI_VERIFY.git
cd UNI_VERIFY

# 2. Run first-time setup (Windows)
SETUP_FIRST_TIME.bat

# 3. Start the application
START.bat

# 4. Open browser to http://localhost:3000
# Login with: admin@univerify.com / admin123
```

#### Option 2: Manual Setup

**Backend Setup:**
```bash
# Navigate to backend directory
cd backend

# Create virtual environment
python -m venv .venv

# Activate virtual environment (Windows)
.venv\Scripts\activate

# Install dependencies
pip install -r requirements.txt

# Initialize database and create admin
python -c "from database import init_db; init_db()"
python create_admin.py

# Start backend server
python main.py
```

**Frontend Setup:**
```bash
# Navigate to frontend directory (in new terminal)
cd frontend

# Install dependencies
npm install

# Start development server
npm run dev
```

**Access the application:**
- Frontend: http://localhost:3000
- Backend API: http://localhost:8000
- API Docs: http://localhost:8000/docs

---

### Portable USB Installation

For distributing UNI-VERIFY via USB drive:

1. **Create Portable Package:**
   ```bash
   # Run the packaging script
   CREATE_PORTABLE_ZIP.bat
   ```

2. **Copy to USB:**
   - Copy the generated `UNI-VERIFY-Portable-YYYYMMDD.zip` to USB drive

3. **Recipients Extract and Run:**
   ```bash
   # Extract ZIP file
   # Run setup
   SETUP_FIRST_TIME.bat
   
   # Start application
   START.bat
   ```

📖 See [INSTALLATION_GUIDE.txt](INSTALLATION_GUIDE.txt) for detailed instructions.

---

## 💻 Usage

### For Students

#### 1️⃣ Register Account
```
Navigate to: http://localhost:3000/register
Fill in:
  - Name
  - Email
  - Roll Number
  - Department
  - Year & Semester
  - Password
```

#### 2️⃣ Upload Project
```
1. Login to dashboard
2. Click "Upload New Project"
3. Select document (PDF, DOCX, TXT, or PPTX)
4. Enter project title
5. Click "Submit for Analysis"
```

#### 3️⃣ View Results
```
✅ Originality Score (0-100%)
📊 Similar Projects List
📈 Detailed Analysis
💡 Improvement Suggestions
⏳ Approval Status
```

---

### For Administrators

#### 🔐 Admin Login
```
Email: admin@univerify.com
Password: admin123
```

#### 📊 Dashboard Features

**1. Statistics Overview**
- Total students registered
- Total projects submitted
- Pending approvals
- Average originality score

**2. Review Submissions**
- View all student projects
- Check originality scores
- Approve or reject submissions
- View detailed similarity reports

**3. Data Warehouse Management**
- Upload reference documents
- Build knowledge base
- Remove outdated projects
- Prevent duplicate uploads

**4. User Management**
- View all registered users
- Monitor user activity
- Export user reports

---

## 📚 API Documentation

### Authentication Endpoints

#### Register User
```http
POST /api/auth/register
Content-Type: application/json

{
  "name": "John Doe",
  "email": "john@example.com",
  "password": "secure123",
  "roll_number": "21CS001",
  "department": "Computer Science",
  "year": 3,
  "semester": 6
}
```

#### Login
```http
POST /api/auth/login
Content-Type: application/json

{
  "email": "john@example.com",
  "password": "secure123"
}

Response:
{
  "access_token": "eyJhbGc...",
  "token_type": "bearer",
  "user": {
    "id": 1,
    "name": "John Doe",
    "email": "john@example.com",
    "role": "student"
  }
}
```

### Project Endpoints

#### Upload Project
```http
POST /api/projects/upload
Authorization: Bearer {token}
Content-Type: multipart/form-data

file: [document file]
title: "My Project Title"
year: 3
semester: 6
```

#### Get My Projects
```http
GET /api/projects/my-projects
Authorization: Bearer {token}
```

### Admin Endpoints

#### Get All Projects
```http
GET /api/admin/projects
Authorization: Bearer {admin_token}
```

#### Update Project Status
```http
PATCH /api/admin/projects/{project_id}/status
Authorization: Bearer {admin_token}
Content-Type: multipart/form-data

status: "approved" | "rejected" | "pending"
```

📖 **Full API Documentation:** http://localhost:8000/docs (when server is running)

---

## ⚙️ Configuration

### Environment Variables

Create `.env` file in frontend directory:
```env
NEXT_PUBLIC_API_URL=http://localhost:8000
```

### Backend Configuration

Edit `backend/main.py` for:
- **CORS Origins:** Modify `allow_origins` list
- **Port:** Change `uvicorn.run()` port parameter
- **Database:** Modify `DATABASE_URL` in `database.py`

### Frontend Configuration

Edit `frontend/src/lib/api.ts` for:
- **API Base URL:** Modify `API_BASE_URL` constant

---

## 🐛 Troubleshooting

### Common Issues

#### ❌ "Python not found"
**Solution:**
```bash
1. Install Python from python.org
2. Check "Add Python to PATH" during installation
3. Restart computer
4. Verify: python --version
```

#### ❌ "Node.js not found"
**Solution:**
```bash
1. Install Node.js from nodejs.org
2. Restart computer
3. Verify: node --version
```

#### ❌ "Failed to fetch" error on login
**Solution:**
```bash
1. Ensure backend is running (green terminal window)
2. Ensure frontend is running (purple terminal window)
3. Check backend shows: "Uvicorn running on http://0.0.0.0:8000"
4. Run STOP.bat then START.bat
```

#### ❌ Port already in use
**Solution:**
```bash
# Windows
netstat -ano | findstr :8000
taskkill /F /PID <PID>

# Or simply run
STOP.bat
```

#### ❌ Module not found errors
**Solution:**
```bash
# Backend
cd backend
.venv\Scripts\activate
pip install -r requirements.txt

# Frontend
cd frontend
npm install
```

### Getting Help

1. 📖 Check [INSTALLATION_GUIDE.txt](INSTALLATION_GUIDE.txt)
2. 📖 Check [QUICK_START.txt](QUICK_START.txt)
3. 🐛 Check error messages in terminal windows
4. 📚 Review API docs at http://localhost:8000/docs
5. 💬 Open an issue on GitHub

---

## 🤝 Contributing

We welcome contributions! Here's how you can help:

### Development Setup

```bash
# Fork the repository
git clone https://github.com/YOUR_USERNAME/UNI_VERIFY.git
cd UNI_VERIFY

# Create a branch
git checkout -b feature/your-feature-name

# Make your changes
# Test thoroughly

# Commit and push
git add .
git commit -m "Add: your feature description"
git push origin feature/your-feature-name

# Create a Pull Request
```

### Contribution Guidelines

- ✅ Follow existing code style
- ✅ Write clear commit messages
- ✅ Test your changes thoroughly
- ✅ Update documentation if needed
- ✅ Add comments for complex logic

---

## 📄 License

This project is licensed under the MIT License - see the [LICENSE](LICENSE) file for details.

---

## 🎓 About

**UNI-VERIFY** was developed for St. Philomena's College to maintain academic integrity and help students create original work.

### Project Information

- **Institution:** St. Philomena's College
- **Purpose:** Academic Integrity Validation
- **Version:** 1.0.0
- **Year:** 2026

### Key Technologies

- **AI/ML:** Sentence Transformers (all-MiniLM-L6-v2)
- **Backend:** FastAPI + Python
- **Frontend:** Next.js + TypeScript + Tailwind CSS
- **Database:** SQLite + SQLAlchemy
- **Authentication:** JWT + bcrypt

---

## 📞 Support

### Documentation

- 📖 [README.md](README.md) - This file
- 📋 [INSTALLATION_GUIDE.txt](INSTALLATION_GUIDE.txt) - Detailed setup
- ⚡ [QUICK_START.txt](QUICK_START.txt) - Quick reference
- 📊 [WORKFLOW_DIAGRAM.txt](WORKFLOW_DIAGRAM.txt) - Visual guides

### Resources

- 🌐 **Frontend:** http://localhost:3000
- 🔧 **Backend API:** http://localhost:8000
- 📚 **API Docs:** http://localhost:8000/docs
- 💚 **Health Check:** http://localhost:8000/api/health

### Contact

- 📧 **Email:** support@univerify.com
- 🐛 **Issues:** [GitHub Issues](https://github.com/Inamulhassan-dev/UNI_VERIFY/issues)
- 💬 **Discussions:** [GitHub Discussions](https://github.com/Inamulhassan-dev/UNI_VERIFY/discussions)

---

## 🌟 Acknowledgments

- **St. Philomena's College** - For supporting this initiative
- **FastAPI** - For the amazing web framework
- **Next.js** - For the powerful React framework
- **Sentence Transformers** - For ML capabilities
- **Open Source Community** - For all the tools and libraries

---

## 📊 Project Stats

![GitHub stars](https://img.shields.io/github/stars/Inamulhassan-dev/UNI_VERIFY?style=social)
![GitHub forks](https://img.shields.io/github/forks/Inamulhassan-dev/UNI_VERIFY?style=social)
![GitHub issues](https://img.shields.io/github/issues/Inamulhassan-dev/UNI_VERIFY)
![GitHub pull requests](https://img.shields.io/github/issues-pr/Inamulhassan-dev/UNI_VERIFY)

---

<div align="center">

### 🎉 Thank you for using UNI-VERIFY!

**Made with ❤️ for Academic Excellence**

[⬆ Back to Top](#-uni-verify)

</div>
