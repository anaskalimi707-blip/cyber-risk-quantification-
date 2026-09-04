FROM python:3.12-slim

WORKDIR /app

# Install system dependencies including CBC solver for PuLP optimization
RUN apt-get update && apt-get install -y --no-install-recommends \
    build-essential \
    curl \
    coinor-cbc \
    coinor-libcbc-dev \
    && rm -rf /var/lib/apt/lists/*

# Install python dependencies
COPY requirements.txt .
RUN pip install --no-cache-dir -r requirements.txt

# Copy application source code
COPY . .

# Create non-root system user for container security
RUN useradd -u 10001 -m cyberoptix && \
    mkdir -p /app/storage /app/logs && \
    chown -R cyberoptix:cyberoptix /app

USER cyberoptix

EXPOSE 8000

HEALTHCHECK --interval=30s --timeout=5s --start-period=10s --retries=3 \
  CMD curl -f http://localhost:8000/health || exit 1

CMD ["uvicorn", "app.main:app", "--host", "0.0.0.0", "--port", "8000", "--workers", "4", "--access-log"]
