# Auth Docs

The auth system works with JWT (Json Web Token).\
Each request that needs authentication must have field named `Bearer` in the header that has a JWT in value.

JWT must be stored for each user.\
JWT has an expiration time.
