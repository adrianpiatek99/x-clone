.PHONY: dev install clean

dev:
	@echo "Starting development environment with backend and frontend..."
	@cd backend && cargo run &
	@sleep 2
	@cd frontend && yarn dev

clean:
	@echo "Cleaning up..."
	@cd backend && cargo clean &
	@sleep 2
	@cd frontend && rm -rf .next node_modules