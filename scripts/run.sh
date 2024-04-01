#!/usr/bin/env sh
set -e
#!/usr/bin/env sh
set -e


if [ ! -d ./database ]; then
  mkdir database
fi

if [ $MODE = "production" ]; then

  if [ -f ./database/prod.db ]; then
    rm ./database/prod*
    rm ./database/.prod*
  fi

  # Set the directory of the database in a variable
  DB_PATH=./database/prod.db
  # Restore the database if it does not already exist.
  # if [ -f $DB_PATH ]; then
  #   echo "Database already exists, skipping restore"
  # else
    echo "Restoring from replica if exists"
    # Restore backup from litestream if backup exists
    litestream restore -config litestream.yml -if-replica-exists $DB_PATH
  # fi
  # Migrate the database
  npm run db:migrate
else
  # Set the directory of the database in a variable
  DB_PATH=./database/dev.db
  if [ ! -f $DB_PATH ]; then
    echo "Creating development database..."
    npm run db:migrate
  fi
fi

if [ $MODE = "production" ]; then
  echo "Starting production server..."
  # Run litestream with your app as the subprocess.
  exec litestream replicate -exec "npm run start" -config litestream.yml
else
  echo "Starting development server..."
  npm run dev
fi