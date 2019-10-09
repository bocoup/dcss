# Teacher Moments

## Development

### Local Setup
0. Make sure you have Node (https://nodejs.org/en/download/) and Yarn (https://yarnpkg.com/lang/en/docs/install) installed.


1. Install Dependencies
   `yarn install`

2. Set up local database  
Follow the instructions here: [https://github.com/bocoup/threeflows#local-database-setup](https://github.com/bocoup/threeflows#local-database-setup)

3. Start the development server
If you are using Mac or Linux, export the required environment variables first:

`export $(cat config/dev)`

And then run the dev server with

`yarn dev`

You should see your local site at http://localhost:3000.

This is the list of all environment variables that are are pre-populated in `config/dev`, need to be exported prior to running the Teacher Moments server:

```
PGUSER=
PGPASSWORD=
PGDATABASE=
PGHOST=
PGPORT=

export AWS_PROFILE=
export S3_BUCKET=
```

 `export $(cat config/dev); yarn dev`

*Windows instructions TBD*


### Build

`yarn build`

### Linting Code

This project uses [Eslint](https://eslint.org/) for linting. To catch syntax and style errors, run

`yarn lint`

### Local Database Setup

- Install PostgreSQL
  - Mac:
  ```
  brew install postgres
  ```
  - Ubuntu (based on https://www.digitalocean.com/community/tutorials/how-to-install-and-use-postgresql-on-ubuntu-18-04)
  ```
  sudo apt-get update && sudo apt-get install postgresql postgresql-contrib
  ```
  Make sure that the Postgres version installed is 11.4.
- Start PostgreSQL and make yourself a default d
  - Mac:
  ```
  brew services start postgresql
  createdb # creates a default database under your user name
  ```
  - Linux
  ```
  sudo su postgres
  createuser --interactive # enter your username and make yourself a super user
  su yourusername
  createdb # creates a default database under the current user
  ```
- Initialize local database
The following  should be run with a PGUSER/PGPASSWORD for a super user who can create databases and roles.

On linux, you'll need to run `export PGUSE=${yourusername}`;
```
yarn db-init-local
```

This command creates a database called `teachermoments` and then sets up a role called tm and then creates all of the tables in `teachermoments`. To do this manually, create a databse called `teachermoments`: `$createdb teachermoments`, then create the role `tm` with a password `teachermoments`, then run `db-migrate up`.

### Creating Database Migrations

```
yarn create-migration <migration name>

# Example
yarn create-migration create-users-table
```

db-migrate tool will subsequently create a JS migration file that can be edited in the `migrations` folder.

### Applying Database Migrations

```
yarn db-migrate-up
```

This command can be customized with the following options: [https://db-migrate.readthedocs.io/en/latest/Getting%20Started/usage/#running-migrations]()

Example:
Passing a count: `npm run db-migrate-down -- -c 1`

### Reverting Database Migrations

```
yarn db-migrate-down
```

This command can be customized with the following options [https://db-migrate.readthedocs.io/en/latest/Getting%20Started/commands/#down]()

### S3 Integration
The AWS bucket used for development is called **v2-moments-dev**. For access, please contact the AWS administrator for TSL.

The app uses for credentials either
* **default** credential in your home directory at ~/.aws/credentials with this file format:
```
[default] #TSL
aws_access_key_id = <your access key id>
aws_secret_access_key = <your secret access key id>
```
* *or* set the environment variable **AWS_PROFILE**
```
export AWS_PROFILE=tsl
```
