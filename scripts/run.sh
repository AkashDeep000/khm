#!/usr/bin/env sh
set -e

# Set the directory of the database in a variable
DB_PATH=./datadase/prod.sqlite

if [ -f $DB_PATH ]; then
		echo "Database already exists, skipping restore"
	else
		echo "No database found, restoring from replica if exists"
		# Restore backup from litestream if backup exists
		litestream restore -if-replica-exists $DB_PATH
fi

echo "Starting $MODE server..."

if [ $MODE = "development" ]; then
	npm dev
else
	# Run litestream with your app as the subprocess.
	exec litestream replicate -exec "npm run start"
fi