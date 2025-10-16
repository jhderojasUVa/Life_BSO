.PHONY: install run clean lint test

install:
	poetry install

run:
	poetry run uvicorn main:app --reload

clean:
	rm -rf dist .venv

lint:
	poetry run ruff check .

test:
	poetry run pytest
