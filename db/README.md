# Local Development
## Tools Required
- PostgreSQL 11.4
  - Mac:
  ```
  brew install postgres
  ```
- Flyway
  - Mac:  
*PostgreSQL 11.x is only compatible with Flyway 6.0.0. Flyway 6.0.0 is not available in Homebrew yet, so Mac users will have to do a manual download*
  - Download Flyway CLI [https://repo1.maven.org/maven2/org/flywaydb/flyway-commandline/6.0.0/flyway-commandline-6.0.0-linux-x64.tar.gz]()
  - **The next instructions are for users who are not familiar with adding flyway to `/usr/local/bin` or their terminal's execution path**
    - Extract `flyway-commandline-6.0.0-linux-x64.tar.gz`
    - Create a place in `/usr/local` for the flyway directory
    ```
    sudo mkdir /usr/local/software
    ```
    - Move the `flyway-6.0.0` folder
    ```
    sudo mv path/to/flyway-6.0.0 /usr/local/software/
    ```
    - Link `flyway` binary to `/usr/local/bin`
    ```
    ln -sf /usr/local/software/flyway-6.0.0/flyway /usr/local/bin/flyway
    ```

## Local Database Setup
- Start PostgreSQL
  - Mac:
  ```
  brew services start postgresql
  ```

- Initialize database - **Run one time, only during project setup.**  
 This script will create the database and a role that can access and modify the database. If experiencing issues with the script, close the terminal, open a new terminal, and try to run the script again.
```
cd db
. ./db_init.sh development
```

- Run the flyway migrations
```
cd db
bash flyway.sh development
```

## Making changes to the Database Schema
```
cd db
```
- All new changes to the database schema should be detailed in a new version script in the /migrations folder. New script filenames should start with V[number of migration]__. For example, see migrations/V1__Setup_users_table.sql. More information on file naming conventions in flyway, see [https://flywaydb.org/documentation/migrations#naming]()
