#/bin/bash

ENVIRONMENT=$1
CONFIG_FILE=`pwd`/configs/$1.config

source $CONFIG_FILE

 export PGUSER=$DB_USER
 export PGPASSWORD=$DB_PASSWORD
 export PGDATABASE=$DATABASE
 export PGHOST=$HOST
 export PGPORT=$PORT

# Flyway commands

# Show all the migrations 
flyway info -user=$PGUSER -password=$PGPASSWORD \
    -url=jdbc:postgresql://$PGHOST:$PGPORT/$PGDATABASE \
    -locations=filesystem:$(pwd)/migrations \
    -baselineVersion=0 -baselineOnMigrate=true

# Perform the migration
flyway migrate -user=$PGUSER -password=$PGPASSWORD \
    -url=jdbc:postgresql://$PGHOST:$PGPORT/$PGDATABASE \
    -locations=filesystem:$(pwd)/migrations \
    -baselineVersion=0 -baselineOnMigrate=true

# Validate the migration
flyway validate -user=$PGUSER -password=$PGPASSWORD \
    -url=jdbc:postgresql://$PGHOST:$PGPORT/$PGDATABASE \
    -locations=filesystem:$(pwd)/migrations \
    -baselineVersion=0 -baselineOnMigrate=true
