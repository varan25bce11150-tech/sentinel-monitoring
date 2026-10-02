FROM python:3.11-slim

WORKDIR /app

# Configure pip for slow or unstable network connections
ENV PIP_DEFAULT_TIMEOUT=100 \
    PIP_RETRIES=5

COPY requirements.txt ./
RUN pip install --no-cache-dir -r requirements.txt

COPY . .

EXPOSE 8000

CMD ["uvicorn", "app.main:app", "--host", "0.0.0.0", "--port", "8000"]