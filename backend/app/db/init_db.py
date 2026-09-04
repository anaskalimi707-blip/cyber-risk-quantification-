from app.core.database import engine, Base
import app.models  # Ensure all models are imported so metadata is populated


async def init_db() -> None:
    async with engine.begin() as conn:
        await conn.run_sync(Base.metadata.create_all)
