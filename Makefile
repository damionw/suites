LOCAL_DIR := $(shell pwd)
BUILD_DIR := $(LOCAL_DIR)/build
INSTALL_PREFIX := /usr/local
MAKE := make

.PHONY: tests build

all: tests build

install: build
	cd $(BUILD_DIR)/. && find . -print | cpio -pdum $(INSTALL_PREFIX)/.

build:
	@install -d $(BUILD_DIR)/bin $(BUILD_DIR)/share/Suites
	@install -m 555 suites $(BUILD_DIR)/bin
	@cp -r examples tools $(BUILD_DIR)/share/Suites/.

tests:
	@PATH="$(LOCAL_DIR):$(PATH)" unittests/testsuite

clean:
	-@rm -rf unittests/*/.log
	-@rm -rf unittests/*/.run
	-@rm -rf examples/*/.log
	-@rm -rf examples/*/.run
	-@rm -rf $(BUILD_DIR)
