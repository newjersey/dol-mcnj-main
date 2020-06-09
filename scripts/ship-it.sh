#!/usr/bin/env bash

cd $(git rev-parse --show-toplevel)

set -e

npm --prefix=frontend run prettier
npm --prefix=backend run prettier

# check if uncommited changes
changed_files=$(git status --porcelain | wc -l)
if [ $changed_files -ne 0 ]; then
  git status
  echo
  echo "^^^YOU GOT SOME UNCOMMITTED CHANGED IN 'ERE"
  echo
  exit 1
fi

# run tests, feature tests, and push
./scripts/test-all.sh && ./scripts/build.sh && ./scripts/feature-tests.sh && git push

echo ""
echo "███████╗██╗  ██╗██╗██████╗ ██████╗ ███████╗██████╗     ██╗████████╗██╗"
echo "██╔════╝██║  ██║██║██╔══██╗██╔══██╗██╔════╝██╔══██╗    ██║╚══██╔══╝██║"
echo "███████╗███████║██║██████╔╝██████╔╝█████╗  ██║  ██║    ██║   ██║   ██║"
echo "╚════██║██╔══██║██║██╔═══╝ ██╔═══╝ ██╔══╝  ██║  ██║    ██║   ██║   ╚═╝"
echo "███████║██║  ██║██║██║     ██║     ███████╗██████╔╝    ██║   ██║   ██╗"
echo "╚══════╝╚═╝  ╚═╝╚═╝╚═╝     ╚═╝     ╚══════╝╚═════╝     ╚═╝   ╚═╝   ╚═╝"
echo "                                                                      "
