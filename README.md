# Spotlight ✦

Your professional portfolio, reimagined. Create a stunning portfolio to highlight your skills, projects, and experience with beautiful customizable templates.


## ✨ Features

- **🎨 Beautiful Templates**: Choose from professionally designed templates to make your portfolio stand out
- **📁 Project Showcase**: Highlight your best work with detailed project descriptions, images, and links
- **🔗 Easy Sharing**: Share your portfolio with a single link and make a lasting impression
- **👤 Detailed Profile**: Add your education, work experience, and social links to create a comprehensive professional profile
- **🔐 Authentication**: Secure authentication powered by Supabase Auth
- **📝 Blog Integration**: Write and publish blog posts directly from your dashboard
- **📱 Responsive Design**: Optimized for all devices and screen sizes
- **⚡ Fast Performance**: Built with Next.js for optimal performance and SEO

## 🚀 Tech Stack

- **Framework**: [Next.js 15](https://nextjs.org/) with App Router
- **Backend & Database**: [Supabase](https://supabase.io/) (PostgreSQL)
- **Authentication**: [Supabase Auth](https://supabase.com/auth) with OAuth support
- **Storage**: [Supabase Storage](https://supabase.com/storage) for images and files
- **Styling**: [Tailwind CSS](https://tailwindcss.com/) with custom design system
- **UI Components**: [Shadcn/UI](https://ui.shadcn.com/) & [Radix UI](https://www.radix-ui.com/)
- **Animations**: [Framer Motion](https://www.framer.com/motion/)
- **Icons**: [Lucide React](https://lucide.dev/) & [Tabler Icons](https://tabler-icons.io/)
- **State Management**: [TanStack Query](https://tanstack.com/query) for server state
- **Forms**: React Hook Form with validation
- **Deployment**: [Vercel](https://vercel.com/), [Netlify](https://netlify.com/), or any platform supporting Next.js

## 🏁 Getting Started

Follow these instructions to get a copy of the project up and running on your local machine for development and testing purposes.

### Prerequisites

- [Node.js](https://nodejs.org/en/) (v18.17.0 or newer)
- [Bun](https://bun.sh/) (recommended) or npm/yarn for package management
- A [Supabase](https://supabase.com/) account for backend, database, and storage

### Installation

1.  **Clone the repository:**
    ```bash
    git clone https://github.com/suryanavv/spotlight.git
    cd spotlight
    ```

2.  **Install dependencies:**
    ```bash
    # Using Bun (recommended)
    bun install

    # Or using npm
    npm install

    # Or using yarn
    yarn install
    ```

3.  **Set up Supabase project:**

    a. Create a new project on [Supabase](https://supabase.com/)

    b. Go to your project's API settings and copy your project URL and anon key

    c. Create a `.env.local` file in the root of your project:

    ```env
    NEXT_PUBLIC_SUPABASE_URL=your-supabase-project-url
    NEXT_PUBLIC_SUPABASE_ANON_KEY=your-supabase-anon-key
    ```

4.  **Set up the database:**

    **Option A: Quick Setup (Recommended for new projects)**

    a. Navigate to the SQL Editor in your Supabase dashboard

    b. Copy and paste the contents of `supabase/schema.sql` and run it

    This will set up your entire database schema in one go!

    **Option B: Individual Migrations**

    a. Navigate to the SQL Editor in your Supabase dashboard

    b. Run the migration files in order:
       - `supabase/migrations/20250101000000_add_username_to_profiles.sql`
       - `supabase/migrations/20250103000000_add_public_portfolio_policies.sql`
       - `supabase/migrations/20250104000000_add_blogs_table.sql`
       - `supabase/migrations/20250105000000_create_storage_bucket.sql`

    c. Or run all migrations at once (if you have Supabase CLI):
    ```bash
    supabase db push
    ```

5.  **Set up storage bucket:**

    The migrations will create a `portfolio` storage bucket. Alternatively, you can create it manually:

    a. Go to Storage in your Supabase dashboard
    b. Create a new bucket named `portfolio`
    c. Enable public access
    d. Set up the storage policies as defined in the migration file

6.  **Run the development server:**
    ```bash
    # Using Bun (recommended)
    bun dev

    # Or using npm
    npm run dev

    # Or using yarn
    yarn dev
    ```

7.  **Build for production:**
    ```bash
    # Using Bun
    bun run build

    # Or using npm
    npm run build
    ```

Open [http://localhost:3000](http://localhost:3000) with your browser to see the result.

## 📂 Project Structure

```
.
├── app/                          # Next.js App Router pages
│   ├── [username]/              # Dynamic portfolio pages
│   │   ├── page.tsx             # Public portfolio view
│   │   ├── blog/                # Blog pages
│   ├── auth/                    # Authentication pages
│   ├── dashboard/               # Protected dashboard pages
│   │   ├── blogs/               # Blog management
│   │   ├── education/           # Education management
│   │   ├── experience/          # Experience management
│   │   ├── overview/            # Dashboard overview
│   │   ├── profile-settings/    # Profile settings
│   │   └── projects/            # Project management
│   └── globals.css              # Global styles
├── components/                   # Reusable React components
│   ├── layout/                  # Layout components
│   │   └── DashboardLayout.tsx  # Main dashboard layout
│   ├── portfolio-templates/     # Portfolio template components
│   ├── providers/               # Context providers
│   │   ├── AuthProvider.tsx     # Authentication provider
│   │   ├── DashboardDataProvider.tsx # Dashboard data provider
│   │   └── QueryProvider.tsx    # TanStack Query provider
│   └── ui/                      # Shadcn/UI components
├── integrations/                # Third-party service integrations
│   └── supabase/                # Supabase client and types
│       ├── client.ts            # Supabase client configuration
│       └── types.ts             # Generated TypeScript types
├── lib/                         # Utility libraries and configurations
│   ├── hooks/                   # Custom React hooks
│   │   └── useQueries.ts        # Data fetching hooks
│   └── utils/                   # Utility functions
│       ├── portfolio-url.ts     # Portfolio URL generation
│       └── utils.ts             # General utilities
├── public/                      # Static assets (images, fonts, etc.)
├── supabase/                    # Supabase configuration and migrations
│   ├── config.toml              # Supabase project configuration
│   ├── migrations/              # Database migrations
│   ├── schema.sql               # Complete consolidated schema (recommended)
│   └── seed.sql                 # Database seed data
├── types/                       # TypeScript type definitions
│   └── database.ts              # Database type definitions
├── .env.example                 # Environment variables template
└── package.json                 # Dependencies and scripts
```

## 📜 Available Scripts

```bash
# Development
bun dev          # Start development server
npm run dev      # Start development server (npm)

# Building
bun run build    # Build for production
npm run build    # Build for production

# Linting
bun run lint     # Run ESLint
npm run lint     # Run ESLint

# Database
supabase db push # Apply database migrations
supabase db reset # Reset database to initial state
```

## 🚀 Deployment

### Vercel (Recommended)

1. **Connect your repository** to [Vercel](https://vercel.com/)
2. **Add environment variables** in Vercel dashboard:
   - `NEXT_PUBLIC_SUPABASE_URL`
   - `NEXT_PUBLIC_SUPABASE_ANON_KEY`
3. **Deploy** - Vercel will automatically build and deploy your app

### Netlify

1. **Connect your repository** to [Netlify](https://netlify.com/)
2. **Set build command**: `npm run build`
3. **Set publish directory**: `.next`
4. **Add environment variables** in Netlify dashboard
5. **Deploy**

### Manual Deployment

```bash
# Build the application
npm run build

# Start production server
npm start
```

## 🔧 Troubleshooting

### Common Issues

**❌ "Bucket not found" error**
- **Solution**: Run the storage bucket migration or create the bucket manually in Supabase dashboard

**❌ Authentication not working**
- **Solution**: Check your environment variables and Supabase project settings

**❌ Database connection issues**
- **Solution**: Verify your Supabase URL and ensure migrations have been run

**❌ Build fails**
- **Solution**: Run `npm run lint` to check for linting errors, then `npm run build`

### Development Tips

- Use `bun dev` for faster development experience
- Check the browser console for detailed error messages
- Use the Supabase dashboard to inspect your database and storage
- Run `supabase db reset` to reset your database during development

## 🤝 Contributing

We love your input! We want to make contributing to Spotlight as easy and transparent as possible.

### Development Process

1. **Fork the Project**
2. **Create your Feature Branch**:
   ```bash
   git checkout -b feature/AmazingFeature
   ```
3. **Make your Changes** and ensure:
   - Code follows the existing style
   - Tests pass (if applicable)
   - No linting errors: `npm run lint`
   - Build succeeds: `npm run build`
4. **Commit your Changes**:
   ```bash
   git commit -m 'feat: add amazing feature'
   ```
5. **Push to the Branch**:
   ```bash
   git push origin feature/AmazingFeature
   ```
6. **Open a Pull Request**

### Guidelines

- **Code Style**: Follow the existing code style and use TypeScript
- **Commits**: Use conventional commits (`feat:`, `fix:`, `docs:`, etc.)
- **Issues**: Check existing issues before creating new ones
- **Tests**: Add tests for new features when possible

## 📄 License

Distributed under the MIT License. See `LICENSE` for more information.

## 🙏 Acknowledgments

- **Next.js** for the amazing framework
- **Supabase** for the backend infrastructure
- **Shadcn/UI** for the beautiful UI components
- **Tailwind CSS** for the utility-first styling
- **Framer Motion** for smooth animations

---

**Made with ❤️ using Next.js, Supabase, and modern web technologies**
