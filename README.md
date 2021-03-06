# TWITTER-BACKEND-EXPRESS

This is an application similar to Twitter BUT without any user interface (front-end, client, ...).</br>
It's just a backend with a well-formed and expandable API. The API adheres to REST standards with focus on completing the basic functionality.

## TECH STACKS

- Node.js
  - Passport
  - bcrypt
  - JSON Web Tokens
  - nodemon
  - Socket.io
- Express.js
- MongoDB
  - Mongoose
- Jest
  - supertest

## HIERARCHY

```bash
-__tests__          <--- test scripts using jest
-db
  -config
  -schema           <--- the database schema and tables
  index.js          <--- it would run the database server
-routes
  -index           <---|
  -auth            <---|-- api routes
  -user            <---|
  -chat            <---|
```

## SETUP

### PREREQUISITE

- Node.js<br/>
  More [info](https://nodejs.org/en/) for installation.
- MongoDB<br/>
  This database is hosted in Atlas and would be accessible with the credential provided in `.env.example`
- It is highly suggested to have **Insomnia** or **Postman** for evaluating the api

### INITIALIZATION

- Install dependencies by `npm install`
- Copy the `.env.example` and rename it to `.env` or run the code below in the project root:

```sh
cp .env.example .env
```

- Be carefull to add `.env` to the `.gitignore` file
- The required data in `.env.example` are valid, in case of any error let the author know

### START

- To run the program in dev mode enter `npm run dev`, it will refresh anytime you save or change any files

### TEST

- To run the test enter `npm run test`. Note that, it won't affect your developement database and can be run simultaneously

## ROUTES

Active routes:

### `POST: /auth/register`

This route is for registering new user and accepts an object with username, password, name and email. For example:

```javascript
{
	"username":"Speer",
	"name":"John",
	"email":"John@speer.com",
	"password":"veryCompl$%Pa$$w0rD"
}
```

As a response, you can expect status of `200 OK` if it is successful or detailed error message.

### `POST: /auth/login`<br/>

Login would accept a valid username and password as an object (you can use either username or email) and provides appropriate response include a token to be used for keep the user logged in.
**_The token, should be provided in the header, as an `Authorization` attribute in order to be recognized._**

### `GET: /chat`<br/>

Chat route is a way to keep track of the specific conversation (/chat/conversation) or all conversations (/chat/conversation**s**) or new conversation (**_POST_** /chat/conversation)

## FEATURES

✔️ User registration using unique username and a password</br>
✔️ User login (Including session maintenance by jwt)</br>
✔️ Unit tests</br>
✔️ Live chat (not 100% functional :D)</br>
