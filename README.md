# My E-commerce REST API Portfolio Project

## Overview
This project is a fully functional e-commerce application REST API built using **Express**, **Node.js**, and **PostgreSQL**. It allows users to register, log in (both via email/password and Google OAuth), browse products, manage shopping carts, place orders, and reset passwords via email. The API supports full CRUD operations on products, users, carts, and orders.

## Project Objectives
- **User Authentication**: Register, log in, and reset passwords via email.
- **Product Management**: Full CRUD operations on product listings.
- **User Account Management**: Manage user profiles and account details.
- **Cart Management**: Add, update, and remove items from shopping carts.
- **Order Management**: Users can place and manage orders.
- **OAuth Integration**: Log in with Google using Passport.js.
- **Password Reset**: Users can reset their passwords via a link sent to their email.
- **API Documentation**: Documented with Swagger for easy testing and exploration.

## Getting Started

### Installation

To run the project locally, follow these steps:

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
    - Use **Postbird** or any PostgreSQL client to create a new database (e.g., `e-commerce_api_db`).
    - Open the SQL file `e-commerce_api_db-1724088414.sql` to create tables and seed initial data.
    - You will need to manually add product categories or an admin user.

#### Example SQL to Create an Admin User:

    ```sql
    INSERT INTO users (first_name, last_name, email, password, phone, role, created_at, updated_at)
    VALUES ('Admin', 'User', 'admin@example.com', '<hashed_password>', '1234567890', 'admin', NOW(), NOW());
    ```

4. **Configure environment variables**:
    - Copy `.env.example` to `.env` and configure the necessary values (PostgreSQL details, JWT secrets, Google OAuth credentials, and email service details).

5. **Start the server**:

    ```bash
    node index.js
    ```

The API should now be running on `http://localhost:3001`.

## Testing the API

You can use **Postman** or **cURL** to test the API endpoints. The API documentation is available using Swagger at `http://localhost:3001/api-docs`.

### Example: Testing the Category Creation Endpoint

1. **Create a New POST Request**:
    - **Method**: POST
    - **URL**: `http://localhost:3001/api/categories`
    - **Headers**:
        - Authorization: `Bearer <your_admin_jwt_token>`
        - Content-Type: `application/json`
    - **Body**:

    ```json
    {
      "category_name": "Electronics"
    }
    ```

2. **Expected Response**: You should receive a `201 Created` response with the new category:

    ```json
    {
      "category_id": 1,
      "category_name": "Electronics"
    }
    ```

3. **Verify the Category**:
    - Send a **GET** request to `http://localhost:3001/api/categories` to list all categories.

## Key Endpoints

### User Authentication
- **POST** `/api/auth/register`: Register a new user.
- **POST** `/api/auth/login`: Log in a user.
- **GET** `/api/auth/google`: Google OAuth login.
- **POST** `/api/auth/password-reset-request`: Request a password reset link.
- **POST** `/api/auth/reset-password`: Reset a user's password.

### Products
- **GET** `/api/products`: List all products.
- **POST** `/api/products`: Create a new product (admin only).
- **PUT** `/api/products/:id`: Update a product (admin only).
- **DELETE** `/api/products/:id`: Delete a product (admin only).

### Cart
- **POST** `/api/cart`: Add a product to the user's cart.
- **GET** `/api/cart`: Retrieve the user's cart.
- **PUT** `/api/cart/:productId`: Update the quantity of a product in the cart.
- **DELETE** `/api/cart/:productId`: Remove a product from the cart.

### Orders
- **POST** `/api/orders`: Place an order.
- **GET** `/api/orders`: Retrieve the user's orders.
- **GET** `/api/orders/:id`: Get details of a specific order.

### User Profile
- **GET** `/api/users/me`: Retrieve the user's profile.
- **PUT** `/api/users/me`: Update the user's profile.

## API Documentation

API documentation is available via **Swagger** at `http://localhost:3001/api-docs`. This interface allows you to explore and test the API interactively.

## Environment Variables (.env)

Ensure the .env is configured check .env.example 

## Troubleshooting

### Common Errors

- **Database Connection Issues**: Ensure the PostgreSQL server is running and check `.env` file details.
- **Invalid JWT Token**: Make sure the token is in the `Authorization` header with `Bearer <token>`.
- **OAuth Issues**: Check Google OAuth credentials and the `.env` configuration.
- **Email Issues**: If password reset emails aren't sent, verify the Gmail SMTP settings in `.env`.

## Features

- **User Registration and Authentication**: Secure account management via email and Google OAuth.
- **Product Management**: Full CRUD operations on products.
- **Shopping Cart**: Add, update, and remove products in a shopping cart.
- **Order Placement**: Place orders and retrieve order details.
- **User Profile Management**: Manage personal details and account information.
- **Password Reset**: Users can reset their password via an email link.

## Technologies Used

- **Node.js**: Server-side JavaScript runtime.
- **Express**: Web framework for building APIs.
- **PostgreSQL**: Relational database for data storage.
- **Passport.js**: OAuth and JWT-based authentication.
- **Nodemailer**: Service for sending password reset emails.
- **Swagger**: API documentation and testing interface.
- **Bcrypt**: Password hashing.
- **JSON Web Token (JWT)**: Authentication and authorization.

## Development Process

- **Version Control**: Managed using Git with feature branches and regular commits.
- **Testing**: Tested locally with Postman and Swagger.
- **Documentation**: Created with Swagger for API exploration.

## Contact

For questions or feedback, feel free to reach out:

- **Email**: [joshua.mclelland2@yahoo.com](mailto:joshua.mclelland2@yahoo.com)
- **GitHub**: [joshua-mcfield99](https://github.com/joshua-mcfield99)