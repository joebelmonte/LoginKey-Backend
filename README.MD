LoginKey Back End
=====
**By Joe Belmonte**

# Table of contents

- [Overview](#overview)
- [Configuration](#configuration)
- [Glossary of Terms](#glossary-of-terms)
- [Authentication](#authentication)
- [Account endpoints](#account-endpoints)
  - [Create an account](#create-an-account)
  - [Log in](#log-in)
  - [Get User Profile](#get-user-profile)
  - [Update User Profile](#update-user-profile)
  - [Log out of current device](#log-out-of-current-device)
  - [Log out of all devices](#log-out-of-all-devices)
  - [Delete an account](#delete-an-account)
- [Group endpoints](#group-endpoints)
  - [Create a group](#create-a-group)
  - [Clone a group with optional changes](#clone-a-group-with-optional-changes)
  - [Read a group](#read-a-group)
  - [Read all groups](#read-all-groups)
  - [Update group](#update-group)
  - [Delete group](#delete-group)
  - [Delete all groups](#delete-all-groups)
- [To Dos:](#to-dos)
  - [Password reset](#password-reset)
  - [Email validation](#email-validation)

# Overview

This API demonstrates a means to authenticate to certain services from [Glance Networks](https://ww2.glance.net) by generating a login key server side.  It is meant to be used in conjunction with a Glance account (or accounts). For more information, see [here](https://help.glance.net/integrations/login-key/).

This API is written in Node, using Express, Mongoose, and MongoDB. 

User passwords are hashed.  Group API Keys are encryped in the database.  

# Configuration

The following environment variables must be defined:

| Variable               | Definition                                              |
|------------------------|---------------------------------------------------------|
| PORT                   | Port that the server listens on.                        |
| JWT_SECRET             | Key used for hashing JWT authentication tokens.         |
| MONGODB_URL            | Database URL.                                           |
| API_KEY_ENCRYPTION_KEY | Secret key used for encrypting and decrypting API Keys. |
| FRONTENDORIGIN         | Origin of the front end app, for CORS                   |

# Glossary of Terms

| Term          | Definition                                                                                                                                                                                                                                                                                                | Value                                                   |
|---------------|-----------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------|---------------------------------------------------------|
| name          | Name of the group - can be any arbitary value.                                                                                                                                                                                                                                                            | String, required                                        |
| partnerId     | The partnerId is the same as your Glance group id. This is assigned by Glance.                                                                                                                                                                                                                            | Numeric, required                                       |
| apiKey        | Secret key for the group.                                                                                                                                                                                                                                                                                 | String, required                                        |
| partnerUserId | A unique user identifier.                                                                                                                                                                                                                                                                                 | String, required                                        |
| timeout       | Sets the length of time for which the login key will be valid. <br><br>Values of <= 86,400 (1 day) are interpreted as relative, in seconds from now.<br><br>Values of > 86,400 are interpreted as absolute, in UNIX Epoch time. <br><br>The maximum time in the future for a valid expiration is one day. | Numeric, optional (defaults to 3600 seconds, or 1 hour) |
| loginKey      | A time-limited token used to authenticate a user to various Glance services.                                                                                                                                                                                                                              | String (returned from API only)                         |
| agentJoin     | URL which will open and authenticate to the Agent Join page on glance.net.                                                                                                                                                                                                                                | String (returned from API only)                         |
| glanceClient  | URL which will open and authenticate to the Glance client (if installed).                                                                                                                                                                                                                                 | String (returned from API only)                         |

All API endpoints accept and return JSON.

# Authentication

This API uses the JSON Web Token (JWT) standard for creating, signing, and verifying authorization tokens.  All REST API endpoints (other than account creation and logging in) expect an authorization token to be sent in an Authorization header as follows:

`Authorization : Bearer [authorization token]`

Tokens can be obtained by creating an account or logging in with email/password.  Once issued, tokens are valid for 1 day.

# Account endpoints

## Create an account
POST to `/users`

**Example request body:**

```json
{
    "email":"joe@example.com",
    "password":"myPasswordWillBeHashed"
}
```
Both fields required.  Password must be at least 6 characters in length.

**Example response body:**

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

## Log in
POST to `/users/login`

**Example request body:**

```json
{
    "email":"joe@example.com",
    "password":"myPasswordWillBeHashed"
}
```
Both fields required. 

**Example response body:**

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

## Get User Profile
GET to `/users/me`

**Request:**

No request body required, only authentication token needed.

**Example response body:**

```json
{
    "_id": "5f333dde6b105b08a4ab3717",
    "email": "joe@example.com",
    "__v": 2
}
```

## Update User Profile
PATCH to `/users/me`

**Example request body:**

```json
{
    "email":"bob@example.com",
    "password": "mynewpassword"
}
```

*email* and *password* are the only allowed fields.  They are both optional.

**Example response body:**

```json
{
    "_id": "5f333dde6b105b08a4ab3717",
    "email": "bob@example.com",
    "__v": 2
}
```



## Log out of current device
POST to `/users/logout`

This will delete the token being used to authenticate.

**Request:**

No request body required, only authentication token needed.

**Response:**

No response body.

Response status 200 indicates successful log out.

Response status 500 indicates log out failure.

## Log out of all devices
POST to `/users/logoutAll`

This will delete all authentication tokens associated with the user.

**Request:**

No request body required, only authentication token needed.

**Response:**

No response body.

Response status 200 indicates successful log out.

Response status 500 indicates log out failure.

## Delete an account
DELETE to `/users/me`

**Request:**

No request body required, only authentication token needed.

**Example response body:**

```json
{
    "_id": "5f010ae1e3896d316674a2b6",
    "email": "joe@example.com",
    "__v": 2
}
```

# Group endpoints
## Create a group
POST to `/groups`

**Example request body:**

```json
{
    "name":"Example Group",
    "partnerId":12345,
    "apiKey":"mySecretApiKey",
    "partnerUserId": "uniqueUserIdentifier",
    "timeout": 3600
}
```
*timeout* is optional and defaults to 3600 seconds (1 hour) if not included.  All other fields required.

**Example response body:**

```json
{
    "timeout": 3600,
    "agentJoin": "https://www.glance.net/agentjoin/AgentJoin.aspx?partnerid=12345&partneruserid=uniqueUserIdentifier&loginkey=$1$1593908430$Wf7vDWWv1Ci5VrcUvtWuJh_jLgZIfectGUPkg6DbZws",
    "glanceClient": "glancepanorama://authenticate?partnerid=12345&partneruserid=uniqueUserIdentifier&loginkey=$1$1593908430$Wf7vDWWv1Ci5VrcUvtWuJh_jLgZIfectGUPkg6DbZws",
    "loginKey": "$1$1593908430$Wf7vDWWv1Ci5VrcUvtWuJh_jLgZIfectGUPkg6DbZws",
    "_id": "5f010ebee3896d316674a2bc",
    "name": "Example Group",
    "partnerId": 12345,
    "partnerUserId": "uniqueUserIdentifier",
    "owner": "5f010d00e3896d316674a2b9",
    "__v": 0
}
```

## Clone a group with optional changes
POST to `/groups/clone/:groupID`

All parameters are optional.

Creates an exact copy of the group specified by `:groupID` and then overwrites existing properties with the parameters specified, if any.  

If no parameters are specified, an exact copy will be created.

**Example request body:**

```json
{
    "name":"New Name, Duplicate Everything Else"
}
```

**Example response body:**

```json
{
    "timeout": 3600,
    "agentJoin": "https://www.glance.net/agentjoin/AgentJoin.aspx?partnerid=12345&partneruserid=uniqueUserIdentifier&loginkey=initialValue",
    "glanceClient": "glancepanorama://authenticate?partnerid=12345&partneruserid=uniqueUserIdentifier&loginkey=initialValue",
    "loginKey": "$1$1597595372$GR4bRX693m72g5Vttn5g2TyQsfy4Si6IvbESFs2PFLI",
    "_id": "5f3950dcf0a83332cc506a65",
    "name": "New Name, Duplicate Everything Else",
    "partnerId": 12345,
    "partnerUserId": "uniqueUserIdentifier",
    "owner": "5f37e6674eaf63fbdb0fc30a",
    "__v": 0
}
```


## Read a group
GET to `/groups/:groupID`

No request body required.

**Example response body:**

```json
{
    "timeout": 3600,
    "agentJoin": "https://www.glance.net/agentjoin/AgentJoin.aspx?partnerid=12345&partneruserid=uniqueUserIdentifier&loginkey=$1$1593908590$XCD2ygOUWB892h1xVRy7X0DkUf0w-J8DwnZOWXWCAoY",
    "glanceClient": "glancepanorama://authenticate?partnerid=12345&partneruserid=uniqueUserIdentifier&loginkey=$1$1593908590$XCD2ygOUWB892h1xVRy7X0DkUf0w-J8DwnZOWXWCAoY",
    "loginKey": "$1$1593908590$XCD2ygOUWB892h1xVRy7X0DkUf0w-J8DwnZOWXWCAoY",
    "_id": "5f010ebee3896d316674a2bc",
    "name": "Example Group",
    "partnerId": 12345,
    "partnerUserId": "uniqueUserIdentifier",
    "owner": "5f010d00e3896d316674a2b9",
    "__v": 0
}
```

## Read all groups
GET to `/groups`

No request body required, only authentication token needed.

**Example response body:**

```json
[
    {
        "timeout": 3600,
        "agentJoin": "https://www.glance.net/agentjoin/AgentJoin.aspx?partnerid=12345&partneruserid=uniqueUserIdentifier&loginkey=$1$1593908675$cwgx4A5akR6jkKMODEvNOzucjenBMQdP2aD-1wz0msc",
        "glanceClient": "glancepanorama://authenticate?partnerid=12345&partneruserid=uniqueUserIdentifier&loginkey=$1$1593908675$cwgx4A5akR6jkKMODEvNOzucjenBMQdP2aD-1wz0msc",
        "loginKey": "$1$1593908675$cwgx4A5akR6jkKMODEvNOzucjenBMQdP2aD-1wz0msc",
        "_id": "5f010d51e3896d316674a2bb",
        "name": "Example Group",
        "partnerId": 12345,
        "partnerUserId": "uniqueUserIdentifier",
        "owner": "5f010d00e3896d316674a2b9",
        "__v": 0
    },
    {
        "timeout": 3600,
        "agentJoin": "https://www.glance.net/agentjoin/AgentJoin.aspx?partnerid=12345&partneruserid=uniqueUserIdentifier&loginkey=$1$1593908675$cwgx4A5akR6jkKMODEvNOzucjenBMQdP2aD-1wz0msc",
        "glanceClient": "glancepanorama://authenticate?partnerid=12345&partneruserid=uniqueUserIdentifier&loginkey=$1$1593908675$cwgx4A5akR6jkKMODEvNOzucjenBMQdP2aD-1wz0msc",
        "loginKey": "$1$1593908675$cwgx4A5akR6jkKMODEvNOzucjenBMQdP2aD-1wz0msc",
        "_id": "5f010ebee3896d316674a2bc",
        "name": "Example Group 2",
        "partnerId": 12346,
        "partnerUserId": "uniqueUserIdentifier",
        "owner": "5f010d00e3896d316674a2b9",
        "__v": 0
    },
    {
        "timeout": 3600,
        "agentJoin": "https://www.glance.net/agentjoin/AgentJoin.aspx?partnerid=12345&partneruserid=uniqueUserIdentifier&loginkey=$1$1593908675$cwgx4A5akR6jkKMODEvNOzucjenBMQdP2aD-1wz0msc",
        "glanceClient": "glancepanorama://authenticate?partnerid=12345&partneruserid=uniqueUserIdentifier&loginkey=$1$1593908675$cwgx4A5akR6jkKMODEvNOzucjenBMQdP2aD-1wz0msc",
        "loginKey": "$1$1593908675$cwgx4A5akR6jkKMODEvNOzucjenBMQdP2aD-1wz0msc",
        "_id": "5f010f90e3896d316674a2bd",
        "name": "Example Group 3",
        "partnerId": 12347,
        "partnerUserId": "uniqueUserIdentifier",
        "owner": "5f010d00e3896d316674a2b9",
        "__v": 0
    }
]
```

## Confirm API Key
POST to `/groups/apikey/confirm/:groupID`

Returns `true` if the API Key passed in the request matches what's currently stored for the group in the database.  Returns `false` if they do not match.

**Example request body:**

```json
{
    "apiKey":"mySecretApiKey"
}
```

**Example response body:**

```json
{
    "match": true
}
```

## Update group
PATCH to `/groups/:groupID`

**Example request body:**

```json
{
    "name":"Example Group Updated Name",
    "partnerId":54321,
    "apiKey":"newSecretApiKey",
    "partnerUserId": "newUniqueUserIdentifier",
    "timeout": 1000
}
```

All fields optional.

**Example response body:**

```json
{
    "timeout": 1000,
    "agentJoin": "https://www.glance.net/agentjoin/AgentJoin.aspx?partnerid=54321&partneruserid=newUniqueUserIdentifier&loginkey=$1$1593906477$wncY1-sgNS11n_T9oqrGBRAQOUXeoLpvs7z0DzHdI7k",
    "glanceClient": "glancepanorama://authenticate?partnerid=54321&partneruserid=newUniqueUserIdentifier&loginkey=$1$1593906477$wncY1-sgNS11n_T9oqrGBRAQOUXeoLpvs7z0DzHdI7k",
    "loginKey": "$1$1593906477$wncY1-sgNS11n_T9oqrGBRAQOUXeoLpvs7z0DzHdI7k",
    "_id": "5f010ebee3896d316674a2bc",
    "name": "Example Group Updated Name",
    "partnerId": 54321,
    "partnerUserId": "newUniqueUserIdentifier",
    "owner": "5f010d00e3896d316674a2b9",
    "__v": 0
}
```

## Delete group
DELETE to `/groups/:groupID`

**Request:**

No request body required, only authentication token needed.

**Example response body:**

```json
{
    "timeout": 1000,
    "agentJoin": "initialvalue",
    "glanceClient": "initialvalue",
    "loginKey": "initialValue",
    "_id": "5f010ebee3896d316674a2bc",
    "name": "Example Group Updated Name",
    "partnerId": 54321,
    "partnerUserId": "newUniqueUserIdentifier",
    "owner": "5f010d00e3896d316674a2b9",
    "__v": 0
}
```

## Delete all groups
DELETE to `/groups`

**Request:**

No request body required, only authentication token needed.

**Example response body:**

```json
{
    "n": 4,
    "ok": 1,
    "deletedCount": 4
}
```


# To Dos:
## Password reset
## Email validation