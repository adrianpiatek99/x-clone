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

generate-types:
	@echo "Removing existing TypeScript types..."
	@cd frontend && rm -rf src/types
	@sleep 2
	@echo "Generating TypeScript types..."
	@cd backend && cargo test export_bindings
	@sleep 2
	@echo "Formatting TypeScript types..."
	@cd frontend && yarn prettier --write src/types/**/*.ts