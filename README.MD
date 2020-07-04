# LoginKey Back End
### By Joe Belmonte

## Definitions

| Term          | Definition                                                                     | Value                    |
|---------------|--------------------------------------------------------------------------------|--------------------------|
| name          | Name of the group - can be any arbitary value.                                 | String                   |
| partnerId     | The partnerId is the same as your Glance group id. This is assigned by Glance. | Numeric                  |
| apiKey        | Secret key for the group.                                                      | String                   |
| partnerUserId | A unique user identifier.                                                      | String                   |
| timeout       | Duration for which the login key will be valid. Expressed in seconds from now. | Numeric                  |
| loginKey      | A time-limited token used to authenticate a user to various Glance services.   | (returned from API only) |
| agentJoin     | URL which will open and authenticate to the Agent Join page on glance.net.     | (returned from API only) |
| glanceClient  | URL which will open and authenticate to the Glance client (if installed).      | (returned from API only) |

All API endpoints accept and return JSON.

## Authentication

All REST API endpoints expect an authorization token to be send in an Authorization header as follows:

`Authorization : Bearer [authorization token]`

Tokens can be obtained by creating an account or logging in with email/password.  Once issues, tokens are valid for 1 day.

### Creating an Account
POST to `/users`

Example request body:

```json
{
    "email":"joe@example.com",
    "password":"myPasswordWillBeHashed"
}
```

Example response body:

```json
{
    "user": {
        "_id": "5f010ae1e3896d316674a2b6",
        "email": "joe@example.com",
        "__v": 1
    },
    "token": "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJfaWQiOiI1ZjAxMGFlMWUzODk2ZDMxNjY3NGEyYjYiLCJpYXQiOjE1OTM5MDM4NDEsImV4cCI6MTU5Mzk5MDI0MX0.OtJFIGTXE3pg28_ht6PPlABTN__wthnRtsDKNKV0ITg"
}
```

### Logging in
POST to `/users/login`

Example request body:

```json
{
    "email":"joe@example.com",
    "password":"myPasswordWillBeHashed"
}
```

Example response body:

```json
{
    "user": {
        "_id": "5f010ae1e3896d316674a2b6",
        "email": "joe@example.com",
        "__v": 2
    },
    "token": "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJfaWQiOiI1ZjAxMGFlMWUzODk2ZDMxNjY3NGEyYjYiLCJpYXQiOjE1OTM5MDQwMjUsImV4cCI6MTU5Mzk5MDQyNX0.3dCq8HDaWVE8x5qt1WWnuB0N7XOfopJuJ0n6jLJoaKo"
}
```

### Deleting an account
DELETE to `/users/me`

No parameters required on submission other than authorization token.

Example response body:

```json
{
    "_id": "5f010ae1e3896d316674a2b6",
    "email": "joe@example.com",
    "__v": 2
}
```

## Endpoints



## To Dos:
- Password reset