# FastPoll - Beautiful, Simple, Fast Polling

FastPoll is a modern, elegant polling application designed for quick group decisions with an Apple-inspired interface. Create gorgeous polls and share them with anyone - no sign-up required!

[FastPoll](https://quickgrouppoll.vercel.app/)

## Features

- ✨ Modern, elegant UI with smooth animations
- 🌓 Light and dark mode support
- 📱 Fully responsive design that works on all devices
- 🔗 Share polls with simple links
- 🔒 Anonymous voting with local storage tracking
- 📊 Real-time results with beautiful visualizations
- ⚡ Lightning-fast performance with Next.js App Router
- 👤 **Optional user accounts** - Register and login to manage your polls
- 🛠️ No registration required to create polls (but you can if you want!)

## UI/UX Highlights

- **Intuitive Poll Creation**: Simple, guided interface for creating polls
- **Animated Components**: Smooth transitions and micro-interactions throughout
- **Accessibility**: Designed with a11y best practices
- **Copy to Clipboard**: One-click sharing functionality
- **Smart Form Behaviors**: Auto-adding options as you type
- **Helpful Tooltips**: Contextual help where you need it
- **Mobile-First Design**: Perfect experience on any device

## Authentication

FastPoll now includes optional user authentication! Users can:
- Register for an account with email and password
- Login to access their account
- View their profile in a beautiful dropdown menu
- Associate polls with their account

**The best part?** Authentication is completely optional - you can still create polls without signing up, maintaining the original FastPoll experience. See [AUTHENTICATION.md](./AUTHENTICATION.md) for complete documentation.

## Tech Stack

- **Frontend**:

  - Next.js 14 (App Router)
  - React with TypeScript
  - Tailwind CSS for styling
  - Framer Motion for animations
  - Shadcn UI components
  - Lucide icons

- **Backend**:
  - Next.js API routes
  - Prisma ORM
  - PostgreSQL database
  - JWT authentication with bcryptjs

## Screenshots (Imgur images)

### Home Page

[Home Page](https://imgur.com/w8xWjbB)

### Poll Creation

[Poll Creation](https://imgur.com/DYqhUDY)

### Voting Interface

[Voting Interface](https://imgur.com/undefined)

### Results View

[Results View](https://imgur.com/xk72hOQ)

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
- `JWT_SECRET` (optional): Secret key for JWT tokens. Defaults to a development key if not set, but **must be changed in production**

See [AUTHENTICATION.md](./AUTHENTICATION.md) for detailed authentication documentation.

## UI Customization

The application uses a customized Tailwind CSS theme with Apple-inspired design elements:

- Custom color palette with vibrant primary colors
- Glass-morphism effects for cards and buttons
- Sophisticated animations and transitions
- Responsive design breakpoints

You can modify the design by editing:

- `tailwind.config.ts` - For theme colors and basic settings
- `src/app/globals.css` - For global CSS variables and utilities
- Component-specific styles in their respective files

## License

MIT License - see LICENSE file for details

## Acknowledgements

- [Shadcn UI](https://ui.shadcn.com/) for the component system
- [Tailwind CSS](https://tailwindcss.com/) for styling
- [Framer Motion](https://www.framer.com/motion/) for animations
- [Lucide Icons](https://lucide.dev/) for beautiful icons
- [Next.js](https://nextjs.org/) for the React framework
