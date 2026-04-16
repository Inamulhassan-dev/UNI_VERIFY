"""
Smoke tests for UNI-VERIFY backend.

These tests are intentionally lightweight – they verify that the core modules
import correctly, the database can be initialised, and password hashing/JWT
signing work end-to-end without requiring a running server.

Run from the backend directory:
    python -m pytest tests/test_smoke.py -v
"""

# ---------------------------------------------------------------------------
# 1. Import smoke tests
# ---------------------------------------------------------------------------

def test_imports():
    """All core backend modules must be importable without errors."""
    import database          # noqa: F401
    import auth              # noqa: F401
    import document_processor  # noqa: F401
    # ml_engine imports sentence-transformers which is large; only check
    # importability, not model loading.
    import ml_engine         # noqa: F401


# ---------------------------------------------------------------------------
# 2. Database initialisation
# ---------------------------------------------------------------------------

def test_database_init(tmp_path):
    """init_db() creates all tables in a fresh SQLite database."""
    import sqlalchemy
    from sqlalchemy import create_engine, inspect
    from sqlalchemy.orm import sessionmaker

    db_path = tmp_path / "test.db"
    db_url = f"sqlite:///{db_path}"

    # Patch the module-level engine so we don't touch the real DB
    import database as db_module
    original_engine = db_module.engine
    original_session = db_module.SessionLocal

    try:
        db_module.engine = create_engine(db_url, connect_args={"check_same_thread": False})
        db_module.SessionLocal = sessionmaker(
            autocommit=False, autoflush=False, bind=db_module.engine
        )
        db_module.Base.metadata.bind = db_module.engine

        db_module.init_db()

        inspector = inspect(db_module.engine)
        tables = inspector.get_table_names()
        assert "users" in tables
        assert "projects" in tables
        assert "submissions" in tables
        assert "warehouse_projects" in tables
    finally:
        db_module.engine = original_engine
        db_module.SessionLocal = original_session


# ---------------------------------------------------------------------------
# 3. Password hashing
# ---------------------------------------------------------------------------

def test_password_hash_and_verify():
    """hash_password and verify_password must round-trip correctly."""
    from auth import hash_password, verify_password

    plain = "SuperSecret123!"
    hashed = hash_password(plain)

    assert hashed != plain
    assert verify_password(plain, hashed) is True
    assert verify_password("WrongPassword", hashed) is False


# ---------------------------------------------------------------------------
# 4. JWT token creation / decoding
# ---------------------------------------------------------------------------

def test_jwt_create_and_decode():
    """create_access_token and decode_token must round-trip correctly."""
    from auth import create_access_token, decode_token

    payload = {"sub": "42"}
    token = create_access_token(payload)

    assert isinstance(token, str)
    assert len(token) > 0

    decoded = decode_token(token)
    assert decoded is not None
    assert decoded["sub"] == "42"


def test_jwt_invalid_token():
    """decode_token must return None for a tampered/invalid token."""
    from auth import decode_token

    assert decode_token("this.is.not.a.valid.token") is None


# ---------------------------------------------------------------------------
# 5. Document processor utilities
# ---------------------------------------------------------------------------

def test_clean_text_and_validate():
    """validate_document_content must accept a sufficiently long text."""
    from document_processor import validate_document_content

    long_text = "word " * 100
    ok, msg = validate_document_content(long_text)
    assert ok is True

    short_text = "too short"
    ok, msg = validate_document_content(short_text)
    assert ok is False


def test_is_supported_format():
    """is_supported_format must recognise all advertised extensions."""
    from document_processor import is_supported_format

    for ext in (".pdf", ".docx", ".doc", ".txt", ".pptx"):
        assert is_supported_format(f"file{ext}"), f"{ext} should be supported"

    assert not is_supported_format("file.exe")


# ---------------------------------------------------------------------------
# 6. ML engine – similarity helpers (no model download required)
# ---------------------------------------------------------------------------

def test_calculate_similarity():
    """calculate_similarity must return 1.0 for identical vectors."""
    import numpy as np
    from ml_engine import calculate_similarity

    v = np.array([1.0, 0.0, 0.0])
    assert calculate_similarity(v, v) == 1.0


def test_calculate_similarity_orthogonal():
    """Orthogonal vectors should have similarity 0."""
    import numpy as np
    from ml_engine import calculate_similarity

    v1 = np.array([1.0, 0.0])
    v2 = np.array([0.0, 1.0])
    assert calculate_similarity(v1, v2) == 0.0


def test_originality_score_no_similar():
    """No similar projects → 100% originality."""
    from ml_engine import calculate_originality_score

    assert calculate_originality_score([]) == 100.0


def test_originality_score_with_similar():
    """High similarity → low originality."""
    from ml_engine import calculate_originality_score

    similar = [{"project_id": 1, "similarity": 90.0}]
    score = calculate_originality_score(similar)
    assert score == 10.0
