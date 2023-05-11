# Dog Puppies API

A RESTful API for managing puppies data. This project is built using Express, Node.js, Typescript, and connected to a MongoDB database. Jest and Supertest are used for testing, while Express validator is used to validate incoming request data.

## Table of Contents

- [Installation](https://github.com/Luega/FirstTryThree.js/blob/main/README.md#installation)
- [Usage](https://github.com/Luega/FirstTryThree.js/blob/main/README.md#usage)
- [Endpoints](https://github.com/Luega/FirstTryThree.js/blob/main/README.md#endpoints)
- [Technologies](https://github.com/Luega/FirstTryThree.js/blob/main/README.md#technologies)
- [Validation](https://github.com/Luega/FirstTryThree.js/blob/main/README.md#validation)
- [Testing](https://github.com/Luega/FirstTryThree.js/blob/main/README.md#testing)
- [License](https://github.com/Luega/FirstTryThree.js/blob/main/README.md#license)

## Installation

1.  Clone the repository

```bash
 git clone https://github.com/Luega/ExpressTS-puppiesAPI.git
```

2. Change the working directory

```bash
  cd /ExpressTS-puppiesAPI
```

3. Install dependencies

```bash
  npm install
```

4. Set up the server port and the MongoDB database by creating a .env file and filling in the necessary information:

```bash
  PORT=your-port
  CONNECTION_STRING_MONGODB=your-connection-string
  MONGODB_DB=your-db
  MONGODB_COLLECTION=your-collection
```

## Usage

1. Build and start the development server

```bash
npm run dev
```

2. After installing and starting the server, you can make HTTP requests to the API endpoints using a tool like curl or a REST client like Postman.

3. The API is equipped with a simple seeder that includes pre-defined dog puppies data. This seeder allows for a quick and effortless initial usage of the API. Upon starting the API, the seeder will populate the MongoDB database with the provided dog puppies data, ensuring there is sample data available for testing and exploration.

However, if you prefer to use the API with your own data, you have the flexibility to remove the seeder section from the mongoDB.ts file. By removing this section, the seeder functionality will be disabled, and the API will not populate the database with the predefined dog puppies data.

This allows you to have full control over the data stored in the database, enabling you to customize and manage the content according to your specific needs and requirements.

## Endpoints

The following endpoints are available in this API:

- GET /api/puppies - Returns a list of all puppies in the database.
- GET /api/puppies/:slug - Returns a single puppy with the specified slug parameter.
- POST /api/puppies - Creates a new puppy and adds it to the database.
- PUT /api/puppies/:slug - Updates an existing puppy with the specified slug parameter.
- DELETE /api/puppies/:slug - Deletes an existing puppy with the specified slug parameter.

POST request body must include the following fields:

```bash
  {
    "breed": "Labrador Retriever",
    "name": "Max",
    "birthDate": "2023-07-15"
  }
```

## Technologies

The Puppy API is built using the following technologies:

- Express: A fast and minimalist web application framework for Node.js.
- Node.js: A JavaScript runtime for building scalable and high-performance applications.
- TypeScript: A superset of JavaScript that adds static typing and other features.
- Jest: A JavaScript testing framework for writing unit tests.
- Supertest: An HTTP testing library for Node.js that works seamlessly with Jest.
- Express Validator: A middleware for validating and sanitizing incoming request data.
- MongoDB: A popular NoSQL database for storing unstructured data.

## Validation

Express Validator is used for validating the data sent in the API requests.

- breed, name, birthDate are required;
- breed must be a string with no digit and no special characters;
- name must be a string with no digit and no special characters;
- birthDate must be a string in a format YYYY-MM-DD;

## Testing

This project uses Jest and Supertest for testing. To run the tests, run the following command:

```bash
npm test
```

This will run all the tests and generate a code coverage report.

## License

This project is licensed under the [MIT](https://choosealicense.com/licenses/mit/) License.
