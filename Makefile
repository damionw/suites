INSTALL_PREFIX := /usr/local
MAKE := make
MAKE_PID := $(shell ps --pid=$$$$ --no-heading -o ppid)

.PHONY: tests clean

all: build build/share/Suites/tools/webserve build/share/Suites/static/d3.min.js build/share/Suites/static/ajax.js
	@rsync -az tools/static/ build/share/Suites/static/
	@rsync -az tools/reactors/ build/share/Suites/reactors/
	@rsync -az tools/plugins/ build/share/Suites/plugins/
	@rsync -az tools/profile.d/ build/share/Suites/profile/
	@rsync -az examples/ build/share/Suites/examples/
	@rsync -az suites build/bin/

install: tests
	@rsync -az build/ $(INSTALL_PREFIX)/

demo: all
	@PATH=$(shell readlink -f build/bin):$$PATH suites --suite=build/share/Suites/examples/demo --start
	@sleep 3
	@PATH=$(shell readlink -f build/bin):$$PATH suites --suite=build/share/Suites/examples/demo --register $(MAKE_PID)
	@PATH=$(shell readlink -f build/bin):$$PATH suites --suite=build/share/Suites/examples/demo --status
	@bash -c 'read -p "Press any key to exit" -n 1'

build/share/Suites/tools/webserve: build checkouts/webserve
	@rsync -az checkouts/webserve/build/bin/$(notdir $@) $@

build/share/Suites/static/d3.min.js: build
	@curl -q -s https://d3js.org/d3.v4.min.js -o $@

build/share/Suites/static/ajax.js: build checkouts/recipes
	@cp checkouts/recipes/www/js/ajax/$(notdir $@) $@

checkouts/recipes: checkouts
	@git clone https://github.com/damionw/recipes.git $@
	@touch checkouts/*

checkouts/webserve: checkouts
	@git clone https://github.com/damionw/webserve.git $@
	@$(MAKE) -C $@ tests

build:
	@install -d build/bin build/share/Suites build/share/Suites/static build/share/Suites/tools
	@install -m 555 suites build/bin

checkouts:
	@mkdir checkouts

tests: all
	@echo "Running testsuite..."
	@PATH="$(shell readlink -f build/bin):$(PATH)" unittests/testsuite
	@echo "Done running testsuite"

clean:
	-@rm -rf unittests/*/.log
	-@rm -rf unittests/*/.run
	-@rm -rf examples/*/.log
	-@rm -rf examples/*/.run
	-@rm -rf build checkouts
