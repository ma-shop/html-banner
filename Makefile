.DEFAULT_GOAL:= build
PATH := ./node_modules/.bin:$(PATH)
SHELL := /bin/bash

# normal npm install + install production dependencies only in the dist/node_modules directory
install:
	@if type yarn 2>/dev/null; then \
		yarn install; \
		npm install ma-shop/lint-rules#v0.0.6; \
	else \
		npm install; \
	fi;

# remove all files from the compiled built folders
clean:
	@rm -rf dist/*

# remove all files that are ignored by git
deep-clean:
	@make clean
	@rm -rf node_modules/ npm-debug.log yarn-error.log

# reinstall the node_modules and start with a fresh node build
reinstall setup:
	@make deep-clean install

# build the source files
build compile:
	@make clean
	@fly

# Watch files for changes and build the files
watch:
	@fly watch

# lint test files
lint:
	@eslint 'app' 'test';

# lint test files
test:
	@make lint

# start a simple http server for easy testing
start:
	http-server dist -s --cors -p 5000