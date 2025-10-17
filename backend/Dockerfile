FROM python:3.9-slim

WORKDIR /app

COPY pyproject.toml poetry.lock* /app/

RUN pip install poetry
RUN poetry config virtualenvs.create false && poetry install --only main --no-root

COPY . /app/

CMD ["uvicorn", "main:app", "--host", "0.0.0.0", "--port", "8000"]
