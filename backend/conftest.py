"""
pytest configuration for the backend test suite.

Adds the backend package root to sys.path so that tests can import
backend modules regardless of the directory from which pytest is invoked.
"""
import sys
import os

# Insert the backend root (parent of this conftest.py) at the front of the
# path so that `import auth`, `import database`, etc. always resolve to the
# local source tree.
sys.path.insert(0, os.path.dirname(__file__))
