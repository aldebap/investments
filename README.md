# investments
Backend of a personal investmens record application

*Command-line options*
--version - print the application version
--dataFileName=file name - set the name of data repository file

*Endpoints*

/investment/v1/banks: Get the list of all banks
/investment/v1/banks/{bank}/funds: Get the list of all funds of a particular bank
/investment/v1/types: Get the list of all types

*Python modules*
. Flask
. Connexion
