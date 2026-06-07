# Check for docker-compose vs docker compose
DOCKER_COMPOSE := $(shell command -v docker-compose 2> /dev/null)
GRADLE := $(shell command -v gradle 2> /dev/null)
ANDROID_GRADLEW := ./android/gradlew
POETRY := $(shell command -v poetry 2> /dev/null)

.DEFAULT_GOAL := help

.PHONY: install run lint test build clean \
	docker-up docker-down \
	frontend-test backend-test android-test android-build help

help:
	@echo "Life_BSO root Makefile targets"
	@echo ""
	@echo "Core"
	@echo "  make install        Install backend (Poetry) and frontend dependencies"
	@echo "  make run            Run backend + frontend dev servers"
	@echo "  make lint           Lint backend + frontend"
	@echo "  make test           Run frontend + backend + Android tests"
	@echo "  make build          Build frontend + Android debug APK"
	@echo "  make clean          Clean backend artifacts"
	@echo ""
	@echo "Granular"
	@echo "  make frontend-test  Run React component tests"
	@echo "  make backend-test   Run backend tests (Poetry or python3+pytest)"
	@echo "  make android-test   Run Android unit tests (gradlew or gradle)"
	@echo "  make android-build  Build Android debug APK (gradlew or gradle)"
	@echo ""
	@echo "Docker"
	@echo "  make docker-up      Build and start containers"
	@echo "  make docker-down    Stop and remove containers"
	@echo ""
	@echo "Prerequisites summary"
	@echo "  Frontend: Node.js + npm"
	@echo "  Backend: Poetry (recommended) or python3 + pytest"
	@echo "  Android: android/gradlew (preferred) or system Gradle"

install:
	@if [ -n "$(POETRY)" ]; then \
		$(MAKE) -C backend install; \
	else \
		echo "Backend install requires Poetry."; \
		echo "Install Poetry, then run make install again."; \
		exit 1; \
	fi
	$(MAKE) -C frontend/web install

test: frontend-test backend-test android-test

build:
	$(MAKE) -C frontend/web build
	$(MAKE) android-build

run:
	$(MAKE) -C backend run & $(MAKE) -C frontend/web dev

lint:
	$(MAKE) -C backend lint
	$(MAKE) -C frontend/web lint

clean:
	$(MAKE) -C backend clean

frontend-test:
	cd frontend/web && npm run test

backend-test:
	@if [ -n "$(POETRY)" ]; then \
		$(MAKE) -C backend test; \
	elif command -v python3 > /dev/null 2>&1 && python3 -c "import pytest" > /dev/null 2>&1; then \
		cd backend && python3 -m pytest; \
	else \
		echo "Backend tests require Poetry or python3 with pytest installed."; \
		echo "Install Poetry (recommended) or run: python3 -m pip install pytest"; \
		exit 1; \
	fi

android-test:
	@if [ -x "$(ANDROID_GRADLEW)" ]; then \
		cd android && ./gradlew test; \
	elif [ -n "$(GRADLE)" ]; then \
		cd android && gradle test; \
	else \
		echo "Android tests require Gradle."; \
		echo "Options:"; \
		echo "1) Generate wrapper from Android Studio and re-run make android-test"; \
		echo "2) Install Gradle and re-run make android-test"; \
		exit 1; \
	fi

android-build:
	@if [ -x "$(ANDROID_GRADLEW)" ]; then \
		cd android && ./gradlew assembleDebug; \
	elif [ -n "$(GRADLE)" ]; then \
		cd android && gradle assembleDebug; \
	else \
		echo "Android build requires Gradle."; \
		echo "Options:"; \
		echo "1) Generate wrapper from Android Studio and re-run make android-build"; \
		echo "2) Install Gradle and re-run make android-build"; \
		exit 1; \
	fi

docker-up:
	@if ! docker info > /dev/null 2>&1; then \
		echo "Docker is not running. Please start Docker and try again."; \
		exit 1; \
	fi
	@if [ -z "$(DOCKER_COMPOSE)" ]; then \
		docker compose up --build; \
	else \
		docker-compose up --build; \
	fi

docker-down:
	@if ! docker info > /dev/null 2>&1; then \
		echo "Docker is not running. Please start Docker and try again."; \
		exit 1; \
	fi
	@if [ -z "$(DOCKER_COMPOSE)" ]; then \
		docker compose down; \
	else \
		docker-compose down; \
	fi
