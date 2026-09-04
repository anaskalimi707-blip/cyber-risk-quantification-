import pytest
import asyncio
from typing import AsyncGenerator
from httpx import AsyncClient, ASGITransport
from app.core.database import Base, engine, get_db, AsyncSessionLocal
from app.main import app
from app.db.init_db import init_db
from app.db.seed_data import seed_all_data


@pytest.fixture(scope="session", autouse=True)
async def setup_test_db():
    await init_db()
    await seed_all_data()
    yield


@pytest.fixture
async def client() -> AsyncGenerator[AsyncClient, None]:
    async with AsyncClient(transport=ASGITransport(app=app), base_url="http://test") as ac:
        yield ac

