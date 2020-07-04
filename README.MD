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

## Authentication

## Endpoints



## To Dos:
- Password reset