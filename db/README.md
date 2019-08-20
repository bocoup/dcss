# Local Development
## Tools Required
- PostgreSQL 11.4
  - Mac:
  ```
  brew install postgres
  ```
- Flyway
  - Mac:
  ```
  brew install flyway
  ```
## Local Database Setup
- Start PostgreSQL
  - Mac:
  ```
  brew services start postgresql
  ```

- Initialize database
This script will create the database and a role that can access and modify the database. If experiencing issues with the script, close the terminal, open a new terminal, and try to run the script again.
```
cd db
. ./db_init.sh
```
