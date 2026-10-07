from sqlalchemy import create_engine
from sqlalchemy.orm import declarative_base, sessionmaker

from app.core.config import settings


# ---------------------------------------------------------
# Database URL
# ---------------------------------------------------------

DATABASE_URL = settings.DATABASE_URL


# ---------------------------------------------------------
# Database engine
# ---------------------------------------------------------

connect_args = {}

# SQLite requires this option when used with FastAPI
# because requests can run in different threads.
if DATABASE_URL.startswith("sqlite"):
    connect_args = {
        "check_same_thread": False
    }


engine = create_engine(
    DATABASE_URL,
    connect_args=connect_args,
)


# ---------------------------------------------------------
# Session factory
# ---------------------------------------------------------

SessionLocal = sessionmaker(
    autocommit=False,
    autoflush=False,
    bind=engine,
)


# ---------------------------------------------------------
# Base class for database models
# ---------------------------------------------------------

Base = declarative_base()


# ---------------------------------------------------------
# Database dependency
# ---------------------------------------------------------

def get_db():
    """
    Creates a database session for an API request
    and closes it after the request is finished.
    """

    db = SessionLocal()

    try:
        yield db
    finally:
        db.close()


# ---------------------------------------------------------
# Create database tables
# ---------------------------------------------------------

def create_tables():
    """
    Creates all registered database tables.
    """

    # Import models so SQLAlchemy knows about them.
    from app.models import database_models

    Base.metadata.create_all(bind=engine)