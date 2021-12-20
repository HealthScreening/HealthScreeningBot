# Version 1 -> Version 2

The version 1 of HealthScreeningBot was stored in an SQLite database. You will want to most likely export the data from
the database to JSON.

Once in the new database, copy **only** the user id, first name, last name, email and vaccination status into the AutoUser table.

For the AutoDays table, only make new records by supplying the user id.

For the devices table, you can copy from the devices table in v1.
