
# Application Installation and Usage Guide

## Prerequisites

Before you begin, ensure you have the following installed on your machine:

- [Docker](https://www.docker.com/get-started)
- [Docker Compose](https://docs.docker.com/compose/install/)

## Getting Started

Follow these steps to set up and run the application:

### 1. Clone the Repository

Clone the repository containing the application code to your local machine:

```bash
git clone git@github.com:parmeet10/url-shortner.git
cd <url-shortner
```
### 2. Set up Environment Variables
```bash
POSTGRES_CONNECTION_STRING=your_postgres_connection_string
POSTGRES_HOST=your_postgres_host
POSTGRES_PORT=your_postgres_port
POSTGRES_USER=your_postgres_user
POSTGRES_PASSWORD=your_postgres_password
GOOGLE_CLIENT_ID=your_google_client_id
GOOGLE_CLIENT_SECRET=your_google_client_secret
GOOGLE_CALLBACK_URL=your_google_callback_url
DEVELOPMENT_HOST=your_development_host
PRODUCTION_HOST=your_production_host
NODE_ENV=development # or production
```

### 3. Build and Run the Application

use Docker Compose to build and run the application along with the Redis service:
```
docker-compose up --build
```
This command will build the Docker image based on the Dockerfile and start both the application and Redis service

### 4. Access the Application
Once the application is running, you can access it at http://localhost:3000 in your web browser.

###  5. To Stop the Application
To stop the application, press CTRL + C in the terminal where you ran docker-compose up. If you need to remove the containers, run:
```
docker-compose down
```

### 6. Additional Commands
- To view logs for the application, use:
 ```
docker-compose logs url-shortner-app-1
 ```
- To access the Redis CLI, you can run:
```
docker exec -it redis redis-cli
```
### 7. Troubleshooting
- if you encounter any issues while running the application, check the following:
- Ensure that Docker is running and that you have the necessary permissions.
- Verify your environment variable values in the .env file.
- Check the application logs for any error messages.
- constact me at sparmeet162000@gmail.com

# API Documentation

## 1. Authentication Providers

### Endpoint
`GET /auths/providers`

### Description
This endpoint retrieves a list of authentication providers available for the application.

### Request

#### cURL Example
```bash
curl --location 'http://urlshortner.kesug.com/auths/providers' \
--header 'x-device-id: 1' \
--header 'x-origin: 1' \
--header 'x-platform: 1' \
--header 'x-version: 1'
```

### Example Response
```json
{
    "code": "success",
    "error": false,
    "message": "Successful",
    "data": {
        "providers": [
            {
                "id": 1,
                "provider": "Google",
                "code": "google",
                "active": true
            }
        ]
    }
}
```

### Error Response Example
```json
{
    "code": "error",
    "error": true,
    "message": "An error occurred while fetching providers.",
    "data": null
}
```

### Possible Error Codes
- **400**: Bad Request - The request was invalid or improperly formatted.
- **401**: Unauthorized - The request lacks valid authentication credentials.
- **500**: Internal Server Error - An error occurred on the server while processing the request.

### Notes
- Ensure that the required headers are included in the request.
- The `x-device-id`, `x-origin`, `x-platform`, and `x-version` headers are necessary for the server to process the request correctly.

---

## 2. Social Authentication Request

### Endpoint
`GET /auths/requests/social`

### Description
This endpoint initiates a social authentication request using the specified provider ID.

### Query Parameters
- **provider_id** (required): The ID of the authentication provider.
- **state** (required): A unique string to maintain state between the request and callback.

### Request

#### cURL Example
```bash
curl --location 'http://urlshortner.kesug.com/auths/requests/social?provider_id=1&state=1234'
```

### Example Response
```json
{
  "code": "success",
  "error": false,
  "message": "Successful",
  "data": {
    "user": {
      "id": 2,
      "email": "sparmeet162000@gmail.com",
      "first_name": null,
      "role": {
        "id": 1,
        "role": "user"
      }
    },
    "session": {
      "id": 1,
      "email": "sparmeet162000@gmail.com",
      "role_id": "1",
      "token": "168b91c71e004a8b8fd01d2452a25137",
      "user_id": "2",
      "expiry": "2025-03-25T19:00:47.503Z",
      "active": true,
      "device_id": 1,
      "identifier": "default.device",
      "origin_id": "1",
      "platform_id": "1",
      "app_version": "1",
      "user_agent": "Node.js/23.0.0 (OS X; arm64)"
    }
  }
}
```

### Error Response Example
```json
{
    "code": "error",
    "error": true,
    "message": "An error occurred while initiating social authentication.",
    "data": null
}
```

### Possible Error Codes
- **400**: Bad Request - The request was invalid or missing required parameters.
- **401**: Unauthorized - The request lacks valid authentication credentials.
- **500**: Internal Server Error - An error occurred on the server while processing the request.

### Notes
- Ensure that the `provider_id` and `state` query parameters are included in the request.

## 3. URL Shortening

### Endpoint
`POST /api/shorten`

### Description
This endpoint allows users to shorten a long URL.

### Request

#### cURL Example
```bash
curl --location 'http://34.68.184.28:3000/api/shorten' \
--header 'x-device-id: 1' \
--header 'x-origin: 1' \
--header 'x-platform: 1' \
--header 'x-version: 1' \
--header 'x-auth: 168b91c71e004a8b8fd01d2452a25137' \
--header 'Content-Type: application/json' \
--data '{\
    "longUrl":"https://supabase.com"\
}' 
```

### Request Body
| Field     | Type   | Required | Description                   |
|-----------|--------|----------|-------------------------------|
| longUrl   | string | Yes      | The long URL to be shortened. |

### Example Response
```json
{
    "code": "success",
    "error": false,
    "message": "Successful",
    "data": {
        "urlData": {
            "short_url": "http://34.68.184.28:3000/api/shorten/1l",
            "created_at": "2024-12-25T19:05:03.937Z"
        }
    }
}
```

### Response Fields
| Field            | Type    | Description                           |
|------------------|---------|---------------------------------------|
| code             | string  | Status code of the response.          |
| error            | boolean | Indicates if there was an error.      |
| message          | string  | Descriptive message about the result. |
| data             | object  | Contains the shortened URL data.      |
| urlData          | object  | Details of the shortened URL.         |
| short_url        | string  | The shortened URL.                    |
| created_at       | string  | Timestamp of when the URL was created.|

### Error Response Example
```json
{
    "code": "error",
    "error": true,
    "message": "An error occurred while redirection.",
    "data": null
}
```

### Possible Error Codes
- **400**: Bad Request - The request was invalid or improperly formatted.
- **401**: Unauthorized - The request lacks valid authentication credentials.
- **500**: Internal Server Error - An error occurred on the server while processing the request.

### Notes
- Ensure that the required headers are included in the request.
- The `x-device-id`, `x-origin`, `x-platform`, `x-version`, `x-auth` headers are necessary for the server to process the request correctly.

---


## 4 URL Redirection

### Endpoint
`GET api/shorten/:alias`

### Description
This endpoint redirects short url to a long url saved into the sytstem

### Request Params 
| Type   | Required | Description      |
|--------|----------|------------------|
| string | Yes      | short url alias. |

#### cURL Example
```bash
curl --location 'http://34.68.184.28:3000/api/shorten/1l' \
--header 'x-device-id: 1' \
--header 'x-origin: 1' \
--header 'x-platform: 1' \
--header 'x-version: 1' \
--header 'x-auth: 168b91c71e004a8b8fd01d2452a25137' \
--data ''
```

### Example Response
```html
<!DOCTYPE html>
<html lang="en">
<head>
    <meta charset="utf-8" />
    <!-- Further HTML content will follow -->
</head>
<body>
    <!-- Redirect content -->
</body>
</html>
```



### Error Response Example
```json
{
    "code": "error",
    "error": true,
    "message": "An error occurred while redirection.",
    "data": null
}
```

### Possible Error Codes
- **400**: Bad Request - The request was invalid or improperly formatted.
- **401**: Unauthorized - The request lacks valid authentication credentials.
- **500**: Internal Server Error - An error occurred on the server while processing the request.

### Notes
- Ensure that the required headers are included in the request.
- The `x-device-id`, `x-origin`, `x-platform`, `x-version`, `x-auth` headers are necessary for the server to process the request correctly.

---
## 5.URL Analytics

### Endpoint
`GET api/analytics/:alias`

### Description
This endpoint provides analytics of the alias

### Request Params 
| Type   | Required | Description      |
|--------|----------|------------------|
| string | Yes      | short url alias. |

#### cURL Example
```bash
curl --location 'http://34.68.184.28:3000/api/analytics/1l' \
--header 'x-device-id: 1' \
--header 'x-origin: 1' \
--header 'x-platform: 1' \
--header 'x-version: 1' \
--header 'x-auth: 168b91c71e004a8b8fd01d2452a25137'
```

### Example Response
```json
{
    "code": "success",
    "error": false,
    "message": "Successful",
    "data": {
        "analytics": {
            "totalClicks": 9,
            "uniqueClicks": 2,
            "clicksByDate": [
                {
                    "date": "2024-12-25T00:00:00.000Z",
                    "clicks": 9
                }
            ],
            "osType": [
                {
                    "osType": "unknown os",
                    "uniqueclicks": 2,
                    "uniqueUsers": 1
                }
            ],
            "deviceType": [
                {
                    "deviceType": "unknown device",
                    "uniqueclicks": 9,
                    "uniqueUsers": 1
                }
            ]
        }
    }
}
```

### Response Fields

| Field            | Type    | Description                                                   |
|------------------|---------|---------------------------------------------------------------|
| code             | string  | Status code of the response.                                  |
| error            | boolean | Indicates if there was an error.                              |
| message          | string  | Descriptive message about the result.                         |
| data             | object  | Contains the analytics data for the shortened URL.           |
| analytics        | object  | Detailed analytics information.                               |
| totalClicks      | number  | Total number of clicks on the shortened URL.                 |
| uniqueClicks     | number  | Total number of unique clicks on the shortened URL.          |
| clicksByDate     | array   | List of click counts grouped by date.                         |
| date             | string  | The date of the clicks in ISO 8601 format.                  |
| clicks           | number  | The number of clicks on that specific date.                  |
| osType           | array   | List of operating system types and their click statistics.    |
| osType           | string  | The type of operating system.                                 |
| uniqueclicks     | number  | Number of unique clicks from that operating system.          |
| uniqueUsers      | number  | Number of unique users from that operating system.           |
| deviceType       | array   | List of device types and their click statistics.             |
| deviceType       | string  | The type of device.                                          |


### Error Response Example
```json
{
    "code": "error",
    "error": true,
    "message": "An error occurred while redirection.",
    "data": null
}
```

### Possible Error Codes
- **400**: Bad Request - The request was invalid or improperly formatted.
- **401**: Unauthorized - The request lacks valid authentication credentials.
- **500**: Internal Server Error - An error occurred on the server while processing the request.

### Notes
- Ensure that the required headers are included in the request.
- The `x-device-id`, `x-origin`, `x-platform`, `x-version`, `x-auth` headers are necessary for the server to process the request correctly.

---

##  6.URL Topic Analytics

### Endpoint
`GET api/analytics/topic/:topic`

### Description
This endpoint provides analytics of the topic

### Request Params 
| Type   | Required | Description      |
|--------|----------|------------------|
| string | Yes      | topic. |

#### cURL Example
```bash
curl --location 'http://34.68.184.28:3000/api/analytics/topic/unknown' \
--header 'x-device-id: 1' \
--header 'x-origin: 1' \
--header 'x-platform: 1' \
--header 'x-version: 1' \
--header 'x-auth: 168b91c71e004a8b8fd01d2452a25137'
```

### Example Response
```json
{
    "code": "success",
    "error": false,
    "message": "Successful",
    "data": {
        "topicAnalytics": {
            "totalClicks": 9,
            "uniqueClicks": 1,
            "urls": [
                {
                    "shortUrl": "http://34.68.184.28:3000/api/shorten/1l",
                    "totalClicks": 9,
                    "uniqueClicks": 1
                }
            ]
        }
    }
}
```

### Response Fields

| Field            | Type    | Description                                                   |
|------------------|---------|---------------------------------------------------------------|
| code             | string  | Status code of the response.                                  |
| error            | boolean | Indicates if there was an error.                              |
| message          | string  | Descriptive message about the result.                         |
| data             | object  | Contains the analytics data for the shortened URL.           |
| topicAnalytics   | object  | Detailed analytics information.                               |
| totalClicks      | number  | Total number of clicks on the shortened URL.                 |
| uniqueClicks     | number  | Total number of unique clicks on the shortened URL.          |
| urls             | array   | List of urls.                                                 |
| totalClicks      | number  | Total number of clicks on the shortened URL.                 |
| uniqueClicks     | number  | Total number of unique clicks on the shortened URL.          |


### Error Response Example
```json
{
    "code": "error",
    "error": true,
    "message": "An error occurred while redirection.",
    "data": null
}
```

### Possible Error Codes
- **400**: Bad Request - The request was invalid or improperly formatted.
- **401**: Unauthorized - The request lacks valid authentication credentials.
- **500**: Internal Server Error - An error occurred on the server while processing the request.

### Notes
- Ensure that the required headers are included in the request.
- The `x-device-id`, `x-origin`, `x-platform`, `x-version`, `x-auth` headers are necessary for the server to process the request correctly.

---

##  7.URL Overall Analytics

### Endpoint
`GET api/analytics/overall`

### Description
This endpoint provides analytics of the topic

### Request Params 

#### cURL Example
```bash
curl --location 'http://34.68.184.28:3000/api/analytics/overall' \
--header 'x-device-id: 1' \
--header 'x-origin: 1' \
--header 'x-platform: 1' \
--header 'x-version: 1' \
--header 'x-auth: 168b91c71e004a8b8fd01d2452a25137'
```

### Example Response
```json
{
    "code": "success",
    "error": false,
    "message": "Successful",
    "data": {
        "overallAnalytics": {
            "totalUrls": 1,
            "totalClicks": 9,
            "uniqueClicks": 2,
            "clicksByDate": [
                {
                    "date": "2024-12-25T00:00:00.000Z",
                    "clicks": 9
                }
            ],
            "osType": [
                {
                    "osType": "unknown os",
                    "uniqueclicks": 2,
                    "uniqueUsers": 1
                }
            ],
            "deviceType": [
                {
                    "deviceType": "unknown device",
                    "uniqueclicks": 9,
                    "uniqueUsers": 1
                }
            ]
        }
    }
}
```

### Response Fields

| Field            | Type    | Description                                                   |
|------------------|---------|---------------------------------------------------------------|
| code             | string  | Status code of the response.                                  |
| error            | boolean | Indicates if there was an error.                              |
| message          | string  | Descriptive message about the result.                         |
| data             | object  | Contains the analytics data for the shortened URL.           |
| overallAnalytics | object  | Detailed analytics information.                               |
| totalUrls      | number  | Total number of urls registerd by user.                       |
| totalClicks      | number  | Total number of clicks on the shortened URL.                 |
| uniqueClicks     | number  | Total number of unique clicks on the shortened URL.          |
| clicksByDate     | array   | List of click counts grouped by date.                         |
| date             | string  | The date of the clicks in ISO 8601 format.                  |
| clicks           | number  | The number of clicks on that specific date.                  |
| osType           | array   | List of operating system types and their click statistics.    |
| osType           | string  | The type of operating system.                                 |
| uniqueclicks     | number  | Number of unique clicks from that operating system.          |
| uniqueUsers      | number  | Number of unique users from that operating system.           |
| deviceType       | array   | List of device types and their click statistics.             |
| deviceType       | string  | The type of device.                                          |


### Error Response Example
```json
{
    "code": "error",
    "error": true,
    "message": "An error occurred while redirection.",
    "data": null
}
```

### Possible Error Codes
- **400**: Bad Request - The request was invalid or improperly formatted.
- **401**: Unauthorized - The request lacks valid authentication credentials.
- **500**: Internal Server Error - An error occurred on the server while processing the request.

### Notes
- Ensure that the required headers are included in the request.
- The `x-device-id`, `x-origin`, `x-platform`, `x-version`, `x-auth` headers are necessary for the server to process the request correctly.
