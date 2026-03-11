"""
db.py — MongoDB connection layer for Scriptoria
Database: scriptoria_db   Collection: users
"""

from pymongo import MongoClient
from bson.objectid import ObjectId
from datetime import datetime, timezone

# ── Connection ────────────────────────────────────────────────────────────────
_client = None
_db     = None

def get_db():
    global _client, _db
    if _db is None:
        _client = MongoClient("mongodb://localhost:27017", serverSelectionTimeoutMS=5000)
        _db     = _client["scriptoria_db"]
        # Enforce unique index on email
        _db.users.create_index("email", unique=True)
    return _db


# ── User helpers ───────────────────────────────────────────────────────────────

def create_user(name: str, email: str, password_hash: str) -> str:
    """Insert a new user and return the inserted _id as a string."""
    db  = get_db()
    doc = {
        "name":          name,
        "email":         email.lower().strip(),
        "password_hash": password_hash,
        "created_at":    datetime.now(timezone.utc),
    }
    result = db.users.insert_one(doc)
    return str(result.inserted_id)


def find_user_by_email(email: str) -> dict | None:
    """Return the user document or None."""
    db = get_db()
    return db.users.find_one({"email": email.lower().strip()})


def get_user_by_id(user_id: str) -> dict | None:
    """Return the user document by ObjectId string or None."""
    db = get_db()
    try:
        return db.users.find_one({"_id": ObjectId(user_id)})
    except Exception:
        return None
