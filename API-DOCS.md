# API Docs

Version v0.0.0-test


# Index

- Structure
- Usage
- List 
    - Award
    - Purchase
    - Shop
    - User
    - AwarUser

# Structure

## Create

Create APIs expect a ``POST`` request with a json body. The structure that  they expect is explained in **Usage**.


## Read

Read APIs expect a ``GET`` request.

### Find all

The standard method is e.g. `/users` for get all the users.

### Find One

The standard method is e.g. `/users/{id}` for get the users by his id.

## Update

Update APIs expect a ``PATCH`` request.\
Update works like create.

## Delete

Delete APIs expect a ``DELETE`` request.\
The standard method is e.g. `/users/{id}` for delete the users by his id.




# Usage

## Usage for create and update

Create and update apis need a json containing data.\
The json structure need to be like this:

```
{
  "field": "value"
}
```

Send only the field that need to be changed.\
If the value is ``null`` the field will be removed.

## Other


# List

## Award

Available methods
## Purchase
## Shop
## User
## AwarUser

