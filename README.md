# Restaurant Website

A modern restaurant website built with Next.js, React, Tailwind CSS, and Express.js.

## Features

- **Homepage** with hero section, about section, featured menu items, and testimonials
- **Menu page** with filtering by categories and search functionality
- **Contact page** with contact form and information
- **Reservation page** with table booking functionality
- **Support chatbot** powered by OpenAI for instant customer assistance
- **Admin section**:
  - Admin login with Supabase authentication
  - Custom admin tables for fine-grained access control
  - Secure authentication with bcryptjs password hashing
  - Admin dashboard with statistics and quick actions
  - Menu management with CRUD operations ([documentation](./docs/MENU_MANAGEMENT.md))
  - Reservation management
- **Dark/Light Mode** toggle functionality
- **Responsive Design** that works across devices

## Technology Stack

- **Frontend**: Next.js, React, Tailwind CSS
- **Backend**: Express.js, MongoDB, Supabase
- **Authentication**: JWT (JSON Web Tokens)
- **API**: REST API with Next.js API routes
- **AI**: OpenAI API for intelligent chatbot assistant

## Authentication System

The admin authentication system uses a secure Supabase table for storing admin credentials:

- **Admin Table**: Stores admin accounts with secure password hashing
- **Middleware**: Protects admin routes with token-based authentication
- **Auth Utilities**: Provides tools for verifying tokens and checking permissions

See [Admin Authentication System](./docs/ADMIN_AUTH.md) for more details.

## Getting Started

First, run the development server:

```bash
npm run dev
# or
yarn dev
# or
pnpm dev
# or
bun dev
```

Open [http://localhost:3000](http://localhost:3000) with your browser to see the result.

## Project Structure

- `src/app/*`: Next.js app router pages and components
- `src/app/api/*`: API routes for handling data
- `src/app/components/*`: Reusable UI components
- `src/app/context/*`: React context providers
- `src/app/services/*`: API service functions
- `src/app/lib/*`: Utility functions
- `server.js`: Express.js server configuration

## Setup Instructions

1. Clone the repository
2. Install dependencies:
   ```bash
   npm install
   ```
3. Configure environment variables:
   - Create a `.env.local` file with the following:
     ```
     # Database
     MONGODB_URI=your_mongodb_connection_string
     
     # Authentication
     JWT_SECRET=your_jwt_secret
     
     # OpenAI API configuration
     OPENAI_API_KEY=your_openai_api_key
     ```
   - To get an OpenAI API key:
     1. Go to [OpenAI API Keys](https://platform.openai.com/api-keys)
     2. Sign in with your OpenAI account if you haven't already
     3. Generate a new key with appropriate permissions
     4. Copy the key to your `.env.local` file
     ```
4. Run the development server:
   ```bash
   npm run dev
   ```



## Admin Access

- Default admin credentials:
  - Username: admin
  - Password: admin123

## Deployment

### Using Docker

The easiest way to deploy this application is using Docker:

1. Build the Docker image:
   ```bash
   docker build -t restaurant-website .
   ```

2. Run the container:
   ```bash
   docker run -p 3000:3000 \
     -e MONGODB_URI=your_mongodb_uri \
     -e JWT_SECRET=your_jwt_secret \
     -e OPENAI_API_KEY=your_openai_api_key \
     restaurant-website
   ```

### Using Docker Compose

1. Configure your environment variables in `.env` file (copy from `.env.example`)
2. Run the following command:
   ```bash
   docker-compose up -d
   ```

### Manual Deployment

1. Build the application:
   ```bash
   npm run build
   ```

2. Start the production server:
   ```bash
   npm start
   ```

### Deployment Platforms

This application can be deployed on:

- **Vercel**: Connect your GitHub repository and deploy automatically
- **Netlify**: Connect your GitHub repository and deploy automatically
- **AWS**: Deploy using Elastic Beanstalk or EC2
- **Heroku**: Deploy using the Node.js buildpack

## Testing

Run tests using:

```bash
npm test
```

Run specific test categories:

```bash
# API tests
npm run test:api

# Component tests
npm run test:components
```

## API Endpoints

### Menu Items
- `GET /api/menu`: Get all menu items
- `POST /api/menu`: Create a new menu item (admin only)
- `GET /api/menu/:id`: Get a specific menu item
- `PUT /api/menu/:id`: Update a menu item (admin only)
- `DELETE /api/menu/:id`: Delete a menu item (admin only)

### Reservations
- `POST /api/reservation`: Create a new reservation
- `GET /api/reservation`: Get all reservations (admin only)
- `GET /api/reservation/:id`: Get a specific reservation (admin only)
- `PUT /api/reservation/:id`: Update a reservation (admin only)
- `PATCH /api/reservation/:id/status`: Update reservation status (admin only)

### Authentication
- `POST /api/auth/login`: Login for admin access

### Contact
- `POST /api/contact`: Submit a contact form

### Chat
- `POST /api/chat`: Send a message to the AI chatbot and get a response

Open [http://localhost:3000](http://localhost:3000) with your browser to see the result.

You can start editing the page by modifying `app/page.js`. The page auto-updates as you edit the file.

This project uses [`next/font`](https://nextjs.org/docs/app/building-your-application/optimizing/fonts) to automatically optimize and load [Geist](https://vercel.com/font), a new font family for Vercel.

## Learn More

To learn more about Next.js, take a look at the following resources:

- [Next.js Documentation](https://nextjs.org/docs) - learn about Next.js features and API.
- [Learn Next.js](https://nextjs.org/learn) - an interactive Next.js tutorial.

You can check out [the Next.js GitHub repository](https://github.com/vercel/next.js) - your feedback and contributions are welcome!

## Deploy on Vercel

The easiest way to deploy your Next.js app is to use the [Vercel Platform](https://vercel.com/new?utm_medium=default-template&filter=next.js&utm_source=create-next-app&utm_campaign=create-next-app-readme) from the creators of Next.js.

Check out our [Next.js deployment documentation](https://nextjs.org/docs/app/building-your-application/deploying) for more details.
