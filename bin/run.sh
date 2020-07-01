#!  /usr/bin/ksh

export  CURRENT_DIRECTORY="$( pwd )"
export  BASE_DIR=$( dirname "${CURRENT_DIRECTORY}/$0" )
export  BASE_DIR=$( dirname "${BASE_DIR}" )
export  PYTHONPATH="${BASE_DIR}/src"
export  DATAPATH="${BASE_DIR}/data"
export  DATAFILENAME=investimentos.json

if [ -d 'flask' ]
then
    source flask/bin/activate
    echo source flask/bin/activate
fi

cd "${PYTHONPATH}"
./main.py --dataFileName="${DATAPATH}/${DATAFILENAME}"
#export  FLASK_APP=main.py
#flask run
cd "${CURRENT_DIRECTORY}"
