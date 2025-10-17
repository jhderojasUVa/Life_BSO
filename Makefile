# Check for docker-compose vs docker compose
DOCKER_COMPOSE := $(shell command -v docker-compose 2> /dev/null)

.PHONY: install run lint clean docker-up docker-down

install:
	$(MAKE) -C backend install
	$(MAKE) -C frontend/web install

run:
	$(MAKE) -C backend run & $(MAKE) -C frontend/web dev

lint:
	$(MAKE) -C backend lint
	$(MAKE) -C frontend/web lint

clean:
	$(MAKE) -C backend clean

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
