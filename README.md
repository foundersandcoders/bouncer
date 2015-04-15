# bouncer

[![Code Climate](https://codeclimate.com/github/foundersandcoders/bouncer/badges/gpa.svg)](https://codeclimate.com/github/foundersandcoders/bouncer) [![Test Coverage](https://codeclimate.com/github/foundersandcoders/bouncer/badges/coverage.svg)](https://codeclimate.com/github/foundersandcoders/bouncer)

login/logout/signup service for clerk

### endpoints

#### GET /login

Requires a valid username and password. These should be passed either in the URL:
``` 
username:password@hosturl.com/login 
```
or as a header:
```
Authorization: Basic <base64-username-and-password-here> 
```

Returns an authorization token as a response header in the ```Authorization``` field.


#### POST /register

Requires an email and password in the request body. Creates a new User in the database with this email and password. Returns an authorization token as a response header in the ```Authorization``` field.


#### GET /validate 

Requires an authorization token in the request body. Verifies whether the token is valid. Returns the matching Session from the database in the response body and the authorization token as a response header in the ```Authorization``` field.

#### GET /logout

If a valid authorization token is set as a response header in the ```Authorization``` field, it is invalidated and cleared from the database.

### developing

1. make sure you have vagrant installed
2. ```vagrant up```; ```vagrant ssh```; ```sudo service elasticsearch start```; ```exit```
3. make sure the elasticsearch instance has a "clerk" index.
4. set default environmental variables with: ```npm run env```
5. install deps with ```npm install```
6. run tests with ```npm test```
7. lint with ```npm run jshint```
8. get coverage report with ```npm run coverage```
9. ```npm start``` to start the server.
