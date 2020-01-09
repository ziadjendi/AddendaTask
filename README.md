# setup application

1. Run command npm i
2. Defualt mongoDB address is localhost or change 'db' connection string in config/default.json file.
3. Set addenda_jwtPK environment variable with random value like "AddendaTask"
4. Set PORT environment variable to define application listenning port. (Optional)

# start application
node .

# Test application

1. Register a user: call http://localhost:port/api/users with post method and payload
 { "name": "user1", "email":"example@domain.com", "password":"12345678", "confirmPassword":"12345678"}
 the response is created user object.

2. Login a user: call http://localhost:port/api/auth with post method and payload { "email":"example@domain.com","password":"12345678"}
 the response is JWT (json web token)
 
3. Create a contact: call http://localhost:port/api/contacts/ with post method and payload {"name":"friend1","phone":"123456778"}

4. Update a contact: call http://localhost:port/api/contacts/ with put method and payload  {"name":"new friend","phone":"123456778"}

5. Get all contacts under a logged in user: call http://localhost:prot/api/contacts with get method or with query string pageSize=10&pageNumber=1

- Note: default pageSize & pageNumber in config/default.json file.
