<![CDATA[<div align="center">

# 🎓 UNI-VERIFY

### Project Originality Validation Portal

[![Python](https://img.shields.io/badge/Python-3.10+-3776AB?style=for-the-badge&logo=python&logoColor=white)](https://python.org)
[![FastAPI](https://img.shields.io/badge/FastAPI-009688?style=for-the-badge&logo=fastapi&logoColor=white)](https://fastapi.tiangolo.com)
[![Next.js](https://img.shields.io/badge/Next.js-16-000000?style=for-the-badge&logo=next.js&logoColor=white)](https://nextjs.org)
[![TypeScript](https://img.shields.io/badge/TypeScript-3178C6?style=for-the-badge&logo=typescript&logoColor=white)](https://typescriptlang.org)
[![Sentence Transformers](https://img.shields.io/badge/ML-Sentence_Transformers-FF6F00?style=for-the-badge&logo=huggingface&logoColor=white)](https://sbert.net)
[![License](https://img.shields.io/badge/License-MIT-green?style=for-the-badge)](LICENSE)

**An AI-powered academic project originality checker that uses machine learning to detect similarities between student submissions and maintain academic integrity.**

---

[Features](#-features) •
[Tech Stack](#-tech-stack) •
[Quick Start](#-quick-start) •
[Architecture](#-architecture) •
[API Reference](#-api-reference) •
[Contributing](#-contributing)

</div>

---

## ✨ Features

| Feature | Description |
|---------|-------------|
| 🤖 **AI-Powered Analysis** | Uses `all-MiniLM-L6-v2` sentence transformer model to generate semantic embeddings and detect content similarity |
| 📄 **Multi-Format Support** | Upload and analyze PDF, DOCX, PPTX, and TXT documents |
| 📊 **Originality Scoring** | Get a 0–100% originality score with detailed breakdown |
| 🔍 **Similar Project Detection** | Automatically identifies and lists similar existing submissions |
| 💡 **Smart Suggestions** | AI-generated recommendations to improve project uniqueness |
| 🏛️ **Admin Data Warehouse** | Admins can build a reference library of past projects for more accurate detection |
| 🔐 **Role-Based Access** | Separate student and admin dashboards with JWT authentication |
| 🚀 **One-Click Setup** | Batch scripts for automated installation, startup, and shutdown |

---

## 🛠 Tech Stack

### Backend
- **[FastAPI](https://fastapi.tiangolo.com)** — High-performance async Python web framework
- **[SQLAlchemy](https://sqlalchemy.org)** — ORM with SQLite database
- **[Sentence Transformers](https://sbert.net)** — ML model for semantic text embeddings
- **[PyMuPDF](https://pymupdf.readthedocs.io)** — PDF text extraction
- **[python-docx](https://python-docx.readthedocs.io)** / **[python-pptx](https://python-pptx.readthedocs.io)** — Office document processing

### Frontend
- **[Next.js 16](https://nextjs.org)** — React framework with App Router
- **[TypeScript](https://typescriptlang.org)** — Type-safe JavaScript
- **[Tailwind CSS 4](https://tailwindcss.com)** — Utility-first CSS framework

---

## 🚀 Quick Start

### Prerequisites
- **Python 3.10+** — [Download](https://python.org/downloads/) *(check "Add to PATH" during install)*
- **Node.js 18+** — [Download](https://nodejs.org/)
- **Git** — [Download](https://git-scm.com/)

### Installation

```bash
# 1. Clone the repository
git clone https://github.com/Inamulhassan-dev/UNI_VERIFY.git
cd UNI_VERIFY
```

Then use the **one-click batch scripts**:

| Script | Action | When to Use |
|--------|--------|-------------|
| 📦 `setup.bat` | Installs all dependencies, creates virtual environment, downloads ML model | **Run once** after cloning |
| ▶️ `start.bat` | Starts backend + frontend servers, opens browser | **Every time** you want to use the app |
| ⏹️ `stop.bat` | Stops all running services | **When done** using the app |

> **Just double-click each `.bat` file!** No command line knowledge needed.

---

### Manual Setup (Alternative)

<details>
<summary>Click to expand manual setup instructions</summary>

#### Backend Setup
```bash
# Navigate to backend
cd backend

# Create virtual environment
python -m venv .venv

# Activate it
# Windows:
.venv\Scripts\activate
# macOS/Linux:
source .venv/bin/activate

# Install dependencies
pip install -r requirements.txt

# Start the server
python main.py
```

#### Frontend Setup
```bash
# Navigate to frontend (in a new terminal)
cd frontend

# Install dependencies
npm install

# Start the dev server
npm run dev
```

#### Access the App
- **Frontend:** http://localhost:3000
- **Backend API:** http://localhost:8000
- **API Docs:** http://localhost:8000/docs

</details>

---

## 🏗 Architecture

```
┌─────────────────┐         ┌──────────────────────┐
│                 │  HTTP   │                      │
│   Next.js App   │ ◄─────► │   FastAPI Backend     │
│   (Port 3000)   │  REST   │   (Port 8000)        │
│                 │         │                      │
│  • Landing Page │         │  • Auth (JWT)        │
│  • Dashboard    │         │  • Project Upload    │
│  • Admin Panel  │         │  • ML Analysis       │
│  • File Upload  │         │  • Data Warehouse    │
│                 │         │                      │
└─────────────────┘         └──────────┬───────────┘
                                       │
                            ┌──────────┴───────────┐
                            │                      │
                            │   ML Engine          │
                            │   (Sentence          │
                            │    Transformers)     │
                            │                      │
                            │  • Text Embedding    │
                            │  • Cosine Similarity │
                            │  • Originality Score │
                            │                      │
                            └──────────┬───────────┘
                                       │
                            ┌──────────┴───────────┐
                            │                      │
                            │   SQLite Database     │
                            │                      │
                            │  • Users             │
                            │  • Projects          │
                            │  • Submissions       │
                            │  • Warehouse         │
                            │                      │
                            └──────────────────────┘
```

---

## 📡 API Reference

### Authentication
| Method | Endpoint | Description |
|--------|----------|-------------|
| `POST` | `/api/auth/register` | Register a new student account |
| `POST` | `/api/auth/login` | Login with email & password |
| `GET` | `/api/auth/me` | Get current user profile |

### Projects
| Method | Endpoint | Description |
|--------|----------|-------------|
| `POST` | `/api/projects/upload` | Upload & analyze a project document |
| `GET` | `/api/projects/my-projects` | Get all projects by current user |
| `GET` | `/api/projects/{id}` | Get project details |

### Admin
| Method | Endpoint | Description |
|--------|----------|-------------|
| `GET` | `/api/admin/projects` | Get all projects (admin only) |
| `PATCH` | `/api/admin/projects/{id}/status` | Update project status |
| `GET` | `/api/admin/stats` | Get dashboard statistics |
| `GET` | `/api/admin/users` | Get all users |

### Data Warehouse
| Method | Endpoint | Description |
|--------|----------|-------------|
| `POST` | `/api/admin/warehouse/upload` | Upload project to warehouse |
| `GET` | `/api/admin/warehouse/projects` | List all warehouse projects |
| `DELETE` | `/api/admin/warehouse/{id}` | Delete warehouse project |

### Health
| Method | Endpoint | Description |
|--------|----------|-------------|
| `GET` | `/api/health` | API health check |

> 📖 **Interactive API docs** available at `http://localhost:8000/docs` when the server is running.

---

## 📁 Project Structure

```
UNI_VERIFY/
│
├── backend/                    # Python FastAPI Backend
│   ├── main.py                 # API routes & app entry point
│   ├── database.py             # SQLAlchemy models & DB config
│   ├── auth.py                 # JWT authentication logic
│   ├── ml_engine.py            # ML model & similarity analysis
│   ├── document_processor.py   # Multi-format document extraction
│   └── requirements.txt        # Python dependencies
│
├── frontend/                   # Next.js Frontend
│   ├── src/
│   │   ├── app/                # App Router pages
│   │   │   ├── page.tsx        # Landing page
│   │   │   ├── login/          # Login page
│   │   │   ├── register/       # Registration page
│   │   │   ├── dashboard/      # Student dashboard
│   │   │   └── admin/          # Admin panel & warehouse
│   │   ├── components/         # Reusable UI components
│   │   │   ├── Navbar.tsx
│   │   │   ├── FileUpload.tsx
│   │   │   ├── OriginalityScore.tsx
│   │   │   ├── ProjectAnalysis.tsx
│   │   │   └── SimilarityReport.tsx
│   │   └── lib/
│   │       └── api.ts          # API client functions
│   ├── package.json
│   └── tsconfig.json
│
├── setup.bat                   # 📦 One-click dependency installer
├── start.bat                   # ▶️ One-click app launcher
├── stop.bat                    # ⏹️ One-click service stopper
├── .gitignore
└── README.md
```

---

## 🔒 How It Works

1. **Upload** — Student uploads a project document (PDF, DOCX, PPTX, or TXT)
2. **Extract** — System extracts text from the document using format-specific parsers
3. **Embed** — Text is converted to a 384-dimensional semantic embedding using `all-MiniLM-L6-v2`
4. **Compare** — Cosine similarity is computed against all existing project embeddings + warehouse
5. **Score** — An originality score (0–100%) is calculated based on the highest similarity match
6. **Report** — Student receives a detailed report with similar projects, suggestions, and AI insights

---

## 👤 Default Accounts

When the database is first created, you can register a new account. The first registered user can be promoted to admin through the database.

---

## 🤝 Contributing

1. Fork the repository
2. Create your feature branch (`git checkout -b feature/amazing-feature`)
3. Commit your changes (`git commit -m 'Add amazing feature'`)
4. Push to the branch (`git push origin feature/amazing-feature`)
5. Open a Pull Request

---

## 📄 License

This project is licensed under the MIT License. See the [LICENSE](LICENSE) file for details.

---

## 👨‍💻 Author

**Inamul Hassan**

- GitHub: [@Inamulhassan-dev](https://github.com/Inamulhassan-dev)
- Email: inamulhassan20006@gmail.com

---

<div align="center">

**Built with ❤️ for academic integrity**

*St. Philomena's College*

</div>
]]>
