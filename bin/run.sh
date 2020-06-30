#!  /usr/bin/ksh

export  CURRENT_DIRECTORY="$( pwd )"
export  BASE_DIR=$( dirname "${CURRENT_DIRECTORY}/$0" )
export  BASE_DIR=$( dirname "${BASE_DIR}" )
export  PYTHONPATH="${BASE_DIR}/src"
export  DATAPATH="${BASE_DIR}/data"
export  DATAFILENAME=investimentos.json

cd "${PYTHONPATH}"
./main.py --dataFileName="${DATAPATH}/${DATAFILENAME}"
cd "${CURRENT_DIRECTORY}"
