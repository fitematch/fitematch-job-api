## fitematch-job-api

REST API for manage users registrations, autentications and sessions.

- Content:
    - [Stack](#stack)
    - [Installation](#installation)
    - [Running](#running)
    - [Tests](#tests)

## Stack <a name="stack"></a>

- Stack:
  - [Node.js](https://nodejs.org/)
  - [NestJS](https://nestjs.com/)
  - [TypeScript](https://www.typescriptlang.org/)
  - [MongoDB](https://www.mongodb.com/)
  - [Mongoose](https://mongoosejs.com/)
  - [Jest](https://jestjs.io/)

## Installation <a name="installation"></a>

Clone GIT repository.

```bash
# Using SSL method.
$ git clone git@github.com:tsoares1902/fitematch-job-api.git
```

Access workdir of application:

```bash
$ cd fitematch-job-api.git/
```

Make a copy of .env.example for .env. 

```bash
# Copy file.
$ cp .env.example .env
```

## Running <a name="running"></a>

Make sure you have [Docker](https://docs.docker.com/engine/install/) and [Docker Compose](https://docs.docker.com/compose/install/) installed.

For create and run containers.

```bash
# Up and start all application containers.
$ docker compose up -d
```

Install Node.js dependencies with [npm](https://www.npmjs.com/):

```bash
$ docker exec job-api npm install
```

Check API documentation on /docs:

```bash
GET: http://localhost:3002/docs
```

Check MongoDB instance:

```bash
mongodb://localhost:27019/job-api

```

## Test <a name="tests"></a>

For run unit tests:

```bash
# Running unit tests.
$ docker exec job-api npm run test
```


For generate code coverage for unit tests:

```bash
# Running unit tests and generate code coverage.
$ docker exec job-api npm run test:cov
```