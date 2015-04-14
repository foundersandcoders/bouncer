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


#### POST /validate 

Requires an authorization token in the request body. Verifies whether the token is valid. Returns the matching Session from the database in the response body and the authorization token as a response header in the ```Authorization``` field.
