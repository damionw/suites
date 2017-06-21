LOCAL_DIR := $(shell pwd)
MAKE := make

.PHONY: tests

all: tests

tests:
	@PATH="$(LOCAL_DIR):$(PATH)" unittests/testsuite
