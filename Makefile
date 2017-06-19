LOCAL_DIR := $(shell pwd)
BINARY_NAME := suites
VERSION := $(shell $(LOCAL_DIR)/source/$(BINARY_NAME) --version)
PACKAGE_NAME := $(notdir $(LOCAL_DIR))
PACKAGE_DIR := $(LOCAL_DIR)/packages
PACKAGE_BASE := $(PACKAGE_DIR)/$(PACKAGE_NAME)-$(VERSION)
PREREQUISITES := 
MAKE := make

.PHONY: prep compile tests

all: tests

prep:
	@mkdir "$(PACKAGE_DIR)" >/dev/null 2>&1 || test -d "$(PACKAGE_DIR)"

build:
	install -d build/bin build/share/$(PACKAGE_NAME)/examples/service_suite

compile: build
	@install -m 555 source/suites build/bin
	@install -m 555 source/examples/service_suite/* build/share/$(PACKAGE_NAME)/examples/service_suite

tests: compile
	@PATH="$(shell readlink -f "build/bin"):$(PATH)" source/unittests/testsuite

clean:
	@rm -rf $(PACKAGE_DIR) build source/unittests/*/.log source/unittests/*/.???* source/examples/*/.???*
