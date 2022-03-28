# Movie App

This api have two service

1. movie service
2. auth service

## Movie service

Movie service is for creating and getting list of movies created with nestjs framework which is framework for nodejs and typescript. Typorm and mysql is used to handle data layer.

Movie service have end point The token should be passed in request's Authorization header. Token can be retrieved from auth service.

```
Authorization: Bearer <token>
```

1. POST /movies

    Allows creating a movie object based on movie title passed in the request body.
    Based on the title additional movie details is fetched from https://omdbapi.com/ and saved to the database. Data from OMDb API:

    ```
    Title: string
    Released: date
    Genre: string
    Director: string
    ```

    Only authorized users can create a movie. Basic users are restricted to create 5 movies per month (calendar month). Premium users have no limits.

2. GET /movies

    Should fetch a list of all movies created by an authorized user.User's authorization token is verified before processing the request.

## Auth service

Auth service is used as git submodule from https://github.com/netguru/nodejs-recruitment-task this repo. Have only one endpoint

1. POST /auth

    Get user token by sending username and password as request body. For example

    ```
    {
        "username": "basic-thomas",
        "password": "sR-_pcoow-27-6PAwCD8"
    }
    ```

## Installation

The app is properly dockerized and the environment variable is set on the .env file. Clone this repo and run

```
docker-compose up
```

Then you can find

```
Movie service on http://localhost:3001
Auth service on  http://localhost:3003
```
