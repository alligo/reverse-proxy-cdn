#!/bin/dumb-init /bin/sh
INITFOLDER=/opt/run

cd ${INITFOLDER}
slist=$(ls | grep -E '^S[0-9]+\-.*\.sh$' | sort -n)
klist=$(ls | grep -E '^K[0-9]+\-.*\.sh$' | sort -n)

function killscripts {
  echo Running kill scripts...
  for script in ${klist}; do
    echo "Running ${script}..."
    source "$INITFOLDER/${script}"
    echo "Done ${script}."
  done
  echo Done running kill scripts.
}

function startscripts {
  echo Running start scripts...
  for script in ${slist}; do
    echo "Running ${script}..."
    source "$INITFOLDER/${script}"
    echo "Done ${script}."
  done
  echo Done running kill scripts.
}

trap killscripts EXIT
startscripts

