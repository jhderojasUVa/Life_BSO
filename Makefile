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
	docker-compose up --build

docker-down:
	@if ! docker info > /dev/null 2>&1; then \
		echo "Docker is not running. Please start Docker and try again."; \
		exit 1; \
	fi
	docker-compose down
