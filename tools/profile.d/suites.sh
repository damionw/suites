#!/usr/bin/env bash

folders="$(
    find "${HOME}/.suites/" -maxdepth 1 -mindepth 1 -type d ! -name '.*' -print | while read folder
    do
        find "${folder}" -maxdepth 1 -mindepth 1 -type f -exec grep -q -E '^[[:alnum:]]+::run[\(][\)]' {} \; -exec echo ${folder} \;
    done | sort -u
)"

while read folder
do
    if [ -n "${folder}" -a -d "${folder}" ]
    then
        suites --suite="${folder}" --start
    fi
done <<< "${folders}"
