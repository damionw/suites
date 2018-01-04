INSTALL_PATH := $(shell python -c 'import sys; print sys.prefix if hasattr(sys, "real_prefix") else exit(255)' 2>/dev/null || echo "/usr/local")
MAKE := make
MAKE_PID := $(shell ps --pid=$$$$ --no-heading -o ppid)

.PHONY: tests clean

all: build/bin \
	build/share/Suites/static build/share/Suites/reactors build/share/Suites/plugins build/share/Suites/profile build/share/Suites/examples \
	build/share/Suites/tools/webserve build/share/Suites/static/d3.min.js build/share/Suites/static/ajax.js
	@rsync -azL tools/static/ build/share/Suites/static/
	@rsync -azL tools/reactors/ build/share/Suites/reactors/
	@rsync -azL tools/plugins/ build/share/Suites/plugins/
	@rsync -azL tools/profile.d/ build/share/Suites/profile/
	@rsync -azL examples/ build/share/Suites/examples/
	@install -m 555 suites build/bin

install: tests
	@echo "Installing into directory '$(INSTALL_PATH)'"
	@rsync -az build/ $(INSTALL_PREFIX)/

demo: all
	@PATH=$(shell readlink -f build/bin):$$PATH suites --suite=build/share/Suites/examples/demo --start
	@sleep 3
	@PATH=$(shell readlink -f build/bin):$$PATH suites --suite=build/share/Suites/examples/demo --register $(MAKE_PID)
	@PATH=$(shell readlink -f build/bin):$$PATH suites --suite=build/share/Suites/examples/demo --status
	@bash -c 'read -p "Press any key to exit" -n 1'


build/share/Suites/tools/webserve: build/share/Suites/tools checkouts/webserve
	@rsync -az checkouts/webserve/build/bin/$(notdir $@) $@

build/share/Suites/static/d3.min.js: build/share/Suites/static
	@curl -q -s https://d3js.org/d3.v4.min.js -o $@

build/share/Suites/static/ajax.js: build/share/Suites/static checkouts/recipes
	@cp checkouts/recipes/www/js/ajax/$(notdir $@) $@

checkouts/recipes: checkouts
	@git clone https://github.com/damionw/recipes.git $@
	@touch checkouts/*

checkouts/webserve: checkouts
	@git clone https://github.com/damionw/webserve.git $@
	@$(MAKE) -C $@ tests

checkouts:
	@install -d $@

build/%:
	@install -d $@

build/share/Suites/%: build/share
	@install -d $@

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
