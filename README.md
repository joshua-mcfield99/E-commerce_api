# My e-commerce REST API portfolio project

## Overview
This project is an e-commerce application REST API built using Express, Node.js, and PostgreSQL. E-commerce applications are crucial in the world of online business, providing the backbone for countless transactions across the internet. This API allows users to perform various CRUD operations such as registering an account, browsing products for sale, managing their carts, and placing orders.

## Project Objectives
- **Build a functioning e-commerce REST API** using Express, Node.js, and PostgreSQL.
- **User Authentication**: Allow users to register and log in via the API.
- **Product Management**: Allow CRUD operations on products.
- **User Account Management**: Allow CRUD operations on user accounts.
- **Cart Management**: Allow CRUD operations on user carts.
- **Order Management**: Allow users to place orders and perform CRUD operations on orders.
- **Version Control**: Use Git for version control.
- **Command Line**: Develop and manage the application via the command line.
- **Local Development**: Develop and test the application locally on your computer.
- **API Documentation**: Document the API using Swagger.

## Getting Started

### Installation
To get started with the project locally, follow these steps:

1. **Clone the repository**:
    ```bash
    git clone https://github.com/your-username/e-commerce-api.git
    cd e-commerce-api
    ```

2. **Install dependencies**:
    ```bash
    npm install
    ```

### Installation
To get started with the project locally, follow these steps:

1. **Clone the repository**:
    ```bash
    git clone https://github.com/your-username/e-commerce-api.git
    cd e-commerce-api
    ```

2. **Install dependencies**:
    ```bash
    npm install
    ```

3. **Set up the PostgreSQL database**:
   - Open **Postbird** (a PostgreSQL client) on your computer.
   - Connect to your PostgreSQL server.
   - Create a new database. You can name it as per your preference or use the name suggested by the provided SQL file (e.g., `e-commerce_api_db`).
   - Open the SQL file named `e-commerce_api_db-1724088414.sql` in Postbird.
   - Execute the SQL script to create the necessary tables and populate the initial data.
   - **Note**:
     - After setting up the database, you will need to manually add categories related to the products you intend to sell. Categories are essential for organizing products and ensuring a smooth browsing experience for users. You can add categories directly via the API or by inserting them into the `categories` table using Postbird.
     - Additionally, create an initial admin user by inserting a record into the `users` table. This user will have the role set to `admin` and can manage the application.

#### Example SQL to Create an Admin User:
```sql
INSERT INTO users (first_name, last_name, email, password, phone, role, created_at, updated_at)
VALUES ('Admin', 'User', 'admin@example.com', '<hashed_password>', '1234567890', 'admin', NOW(), NOW());
```
4. **Configure your database connection**:
   - Create a `.env` file in the root of your project (you can base it on `.env.example`).
   - Update the `.env` file with your PostgreSQL database connection details (use the name of the database you created with Postbird).

5. **Start the server**:
    ```bash
    node index.js
    ```
    The API should now be running on `http://localhost:3000`.

## Testing the API

To ensure the API is functioning correctly, it's recommended to test the endpoints using Postman, a popular tool for testing APIs.

### Example: Testing the Category Creation Endpoint

1. **Install Postman**: If you haven't already, download and install Postman from [https://www.postman.com/downloads/](https://www.postman.com/downloads/).

2. **Create a New POST Request**:
   - **Method**: POST
   - **URL**: `http://localhost:3000/api/categories`
   - **Headers**: 
     - `Authorization`: `Bearer <your_admin_jwt_token>`
     - `Content-Type`: `application/json`
   - **Body**: Select "raw" and choose "JSON" format. Use the following example JSON to create a category:
     ```json
     {
       "category_name": "Electronics"
     }
     ```

3. **Send the Request**:
   - Click the "Send" button in Postman to execute the request.
   - **Expected Response**: You should receive a `201 Created` status with the new category object in the response body:
     ```json
     {
       "category_id": 1,
       "category_name": "Electronics"
     }
     ```

4. **Verify the Category**:
   - You can verify that the category was created by sending a GET request to:
     - **Method**: GET
     - **URL**: `http://localhost:3000/api/categories`
   - **Expected Response**: You should receive a `200 OK` status with a list of all categories, including the one you just created.

### Additional Testing

Feel free to use Postman to test other endpoints, such as user registration, product management, and order placement. The API documentation available at `http://localhost:3000/api-docs` provides detailed information on all available endpoints and how to use them.

### Note

Make sure your server is running and the database is properly configured before testing the endpoints. If you encounter any issues, refer to the console output for debugging information.

## Troubleshooting

If you encounter issues during setup or while running the API, here are some common problems and solutions:

### 1. Database Connection Error
- **Symptom**: The server fails to start, or you receive an error related to the database connection.
- **Solution**: Double-check your `.env` file to ensure all PostgreSQL connection details are correct (host, port, database name, username, and password). Ensure your PostgreSQL server is running and accessible.

### 2. Migrations Fail or Database Errors
- **Symptom**: Errors during database migrations or when executing SQL scripts.
- **Solution**: Ensure the SQL script provided is executed correctly in Postbird, and there are no syntax errors. If using migrations, ensure all necessary migration files are in place and executed in the correct order.

### 3. Server Crashes or Fails to Start
- **Symptom**: The server crashes immediately after starting, or you receive errors in the terminal.
- **Solution**: Check for missing environment variables, syntax errors in your code, or missing dependencies. Running `npm install` again might help if dependencies are missing.

### 4. JWT Authentication Errors
- **Symptom**: Authorization failures when accessing protected routes.
- **Solution**: Ensure the JWT token is being sent correctly in the `Authorization` header as `Bearer <token>`. Verify that the token is valid and not expired. Use [jwt.io](https://jwt.io/) to decode and verify the token contents.

### 5. Invalid SQL Queries
- **Symptom**: Errors when performing CRUD operations (e.g., creating, updating, or deleting records).
- **Solution**: Review the SQL queries in your controllers to ensure they match your database schema. Ensure that the data types and constraints in your queries align with your database schema.

### 6. Testing Issues with Postman
- **Symptom**: Unexpected results or errors when testing with Postman.
- **Solution**: Ensure that the correct HTTP method, URL, headers, and body are being used in Postman. Double-check that the server is running and the API endpoint is correct.

### API Documentation
API documentation is provided using Swagger. To view the documentation:

1. Ensure the server is running.
2. Open your web browser and navigate to `http://localhost:3000/api-docs`.

This will provide you with an interactive interface to explore and test the API endpoints.

## Features
- **User Registration and Authentication**: Users can create accounts and log in securely.
- **Product Browsing and Management**: CRUD operations for managing product listings.
- **Shopping Cart**: Users can add items to their cart, update quantities, and remove items.
- **Order Placement and Management**: Users can place orders and manage them.
- **User Profile Management**: CRUD operations for managing user information.
- **Address Management**: Users can add addresses to their profile, which will be associated with their user account.

## Entity-Relationship Diagram (ERD)
Below is the ERD that represents the structure of the database for the e-commerce application:

![Database ERD (Entity-Relationship Diagram)](./images/e-commerce_api_db.png)

## Technologies Used
- **Node.js**: JavaScript runtime environment for server-side development.
- **Express.js**: Web framework for building the REST API.
- **PostgreSQL**: Relational database management system.
- **Sequelize**: ORM for database management and migrations.
- **Swagger**: API documentation tool.
- **Git**: Version control system.

## Development Process
This project was developed using a local development environment. Key development practices include:

- **Version Control**: Git was used for version control with a focus on feature branches and regular commits.
- **Testing**: The API was tested locally using tools like Postman and automated tests.
- **Documentation**: Swagger was used to document the API for ease of use and reference.

## Contact
If you have any questions or feedback, feel free to reach out:

- **Email**: joshua.mclelland2@yahoo.com
- **GitHub**: [joshua-mcfield99](https://github.com/joshua-mcfield99)
