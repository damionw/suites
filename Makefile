INSTALL_PREFIX := /usr/local
MAKE := make

.PHONY: tests clean

all: build build/share/Suites/tools/webserve build/share/Suites/static/d3.min.js build/share/Suites/static/ajax.js
	@rsync -az tools/static/ build/share/Suites/static/
	@rsync -az tools/plugins/ build/share/Suites/plugins/
	@rsync -az tools/profile.d/ build/share/Suites/profile/
	@rsync -az examples/ build/share/Suites/examples/

install: tests
	@rsync -az build/ $(INSTALL_PREFIX)/

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
	@PATH="$(shell readlink -f build/bin):$(PATH)" unittests/testsuite

clean:
	-@rm -rf unittests/*/.log
	-@rm -rf unittests/*/.run
	-@rm -rf examples/*/.log
	-@rm -rf examples/*/.run
	-@rm -rf build checkouts
