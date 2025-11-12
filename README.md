# KarZone Proposal

1. Project Title
KarZone – Luxury & Standard Car Rental System

2. Problem Statement
Booking a rental car can often be time-consuming and confusing due to lack of transparency, limited options, and inefficient management systems. Customers struggle to find suitable cars quickly, and admins face challenges in managing bookings, availability, and pricing.
 “KarZone” aims to solve this by providing a centralized car rental platform where users can easily search, filter, and book both luxury and standard cars, while admins can efficiently manage the fleet, track bookings, and control inventory.

3. System Architecture
Architecture Flow:
 Frontend (React.js) → Backend (Express.js + Node.js) → Database (MongoDB)
Example Stack
Frontend: React.js with React Router for multiple pages & Axios for API calls


Backend: Node.js with Express.js framework for RESTful API development


Database: MongoDB (non-relational) for flexible car, user, and booking data storage


Authentication: JWT-based user login/signup with role-based access (User/Admin)


Hosting:


Frontend: Vercel


Backend: Render


Database: MongoDB Atlas



4. System Overview
Users: Can browse, search, sort, and filter cars; view details; and book rentals online.


Admins: Can manage car listings, update availability, handle bookings, and perform CRUD operations.


Both: Secure authentication, responsive UI, and real-time data updates.



5. Key Features
Category
Features
Authentication & Authorization
User registration, login, logout, JWT-based auth, role-based access (admin/user)
CRUD Operations
Admin can create, read, update, delete car listings and bookings
Frontend Routing
Pages: Home, Cars, Luxury Cars, Normal Cars, Car Details, Login, Signup, Booking Page, Admin Dashboard
Pagination
Cars listed with pagination for performance optimization
Searching
Search cars by name, model, or brand
Sorting
Sort cars by price, popularity, or availability
Filtering
Filter cars by category (Luxury/Normal), price range, or fuel type
Admin Panel
Manage users, bookings, car inventory, and pricing
Hosting
Both frontend and backend deployed on cloud platforms with public URLs


6. Tech Stack
Layer
Technologies
Frontend
React.js, React Router, Axios, TailwindCSS
Backend
Node.js, Express.js
Database
MongoDB (MongoDB Atlas)
Authentication
JWT (JSON Web Token)
Hosting
Frontend → Vercel, Backend → Render


7. API Overview
Endpoint
Method
Description
Access
/api/auth/signup
POST
Register a new user
Public
/api/auth/login
POST
Authenticate user and generate JWT
Public
/api/cars
GET
Get all cars (with search, sort, filter, pagination)
Authenticated
/api/cars/:id
GET
Get car details by ID
Authenticated
/api/cars
POST
Add a new car (Admin only)
Admin
/api/cars/:id
PUT
Update car details
Admin
/api/cars/:id
DELETE
Delete a car
Admin
/api/bookings
POST
Create a new booking
Authenticated
/api/bookings
GET
Get all bookings (User/Admin)
Authenticated
/api/bookings/:id
DELETE
Cancel a booking
Authenticated


8. Expected Outcome
A fully functional MERN-stack car rental system that allows:
Smooth car browsing and booking for customers.


Complete admin control over cars and bookings.


Optimized user experience through search, sorting, filtering, and pagination.


Secure authentication and seamless deployment on cloud platforms.


deployment link = https://kar-zone.vercel.app/


