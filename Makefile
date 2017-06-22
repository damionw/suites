LOCAL_DIR := $(shell pwd)
MAKE := make

.PHONY: tests

all:

tests:
	@PATH="$(LOCAL_DIR):$(PATH)" unittests/testsuite

clean:
	-@rm -rf unittests/*/.log unittests/*/.run
	-@rm -rf examples/*/.log examples/*/*/.run
