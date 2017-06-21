# suites - A reference counting process group supervisor

## Synopsis

[Suites](https://github.com/damionw/suites) implements
a group process supervision model wherein a set of tasks
is started and managed by a single, reference counted
supervisor.

This utility supplants and obsoletes https://github.com/damionw/process-groups

## Behaviour

When suites is invoked with the --suite=<folder> and --start
options, it will launch a supervisor if there isn't one already
bound to that folder and will add the calling process as a dependency

The suite directory is defined by the set of shell scripts contained
which each must expose at least the function reactor::run().

e.g.

    reactor::depends() {
        echo <required task>
    }

    reactor::run() {
        <service implementation>
    }

The supervisor sources each script and calls reactor::depends()
to determine the execution graph from which it can then deduce
a start order.

Each selected task is started using reactor::run() as a
background process, keeping the list of process ids associated
with each task name.

If a task dies, the supervisor will restart it, maintaining the
expected shape of the task hierarchy. If a task is disabled, the
dependencies will be stopped as well.

If a dependent process disappears, then the supervisor removes it
from the list. Once the number of dependents reaches zero, the
supervisor will stop the managed tasks and exit

This technique is useful for service starting on user login where the
user may be logged in via GUI and/or ssh, or where a set of services are
considered dependent on one or more others such as webservices depending
on a common DBMS.

## Information

The help text, unittests, and included examples should provide decent instruction
on how to use the tool. A provided webserver, written in bash, can be
modified and used to manage the suite it is part of.

## Platform

Currently, this package required bash, awk, etc plus an OS with /proc/... Typically
this requires a modern Linux distro

## License

Suites is licensed under the terms of the GNU GPLv2 License. See the LICENSE file
for details.
