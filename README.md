# FastPoll - Quick Anonymous Group Decisions

FastPoll is a lightweight, anonymous polling application designed for quick group decisions. Create instant polls and share them with your group - no sign-up required!

## Features

- Create polls instantly with multiple options
- Share via simple links
- Anonymous voting
- Real-time results
- Mobile-friendly interface
- No registration required

## Tech Stack

- Next.js 14 (App Router)
- TypeScript
- Prisma ORM
- PostgreSQL
- Tailwind CSS
- Shadcn UI

## Local Development Setup

1. **Clone the repository**

   ```bash
   git clone <your-repo-url>
   cd fastpoll
   ```

2. **Install dependencies**

   ```bash
   npm install
   ```

3. **Set up environment variables**

   - Copy `.env.example` to `.env`
   - Update `DATABASE_URL` with your PostgreSQL connection string

4. **Set up the database**

   ```bash
   npx prisma generate
   npx prisma db push
   ```

5. **Run the development server**

   ```bash
   npm run dev
   ```

   The application will be available at [http://localhost:3000](http://localhost:3000)

## Deployment

### Prerequisites

- A Vercel account
- A PostgreSQL database (e.g., Vercel Postgres, Supabase, or any other provider)

### Deployment Steps

1. **Prepare your database**

   - Create a production PostgreSQL database
   - Get the connection string

2. **Deploy to Vercel**

   - Connect your GitHub repository to Vercel
   - Add the following environment variables in Vercel's dashboard:
     - `DATABASE_URL`: Your production database connection string
   - Deploy the project

3. **Run database migrations**
   ```bash
   npx prisma db push
   ```

## Environment Variables

Required environment variables:

- `DATABASE_URL`: PostgreSQL connection string

## License

MIT License - see LICENSE file for details
