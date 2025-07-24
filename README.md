# Spotlight ✦

Your professional portfolio, reimagined. Create a stunning portfolio to highlight your skills, projects, and experience with beautiful customizable templates.

![Spotlight Preview]

## ✨ Features

- **Beautiful Templates**: Choose from professionally designed templates to make your portfolio stand out.
- **Project Showcase**: Highlight your best work with detailed project descriptions, images, and links.
- **Easy Sharing**: Share your portfolio with a single link and make a lasting impression.
- **Detailed Profile**: Add your education, work experience, and social links to create a comprehensive professional profile.
- **Authentication**: Secure authentication powered by Supabase Auth.

## 🚀 Tech Stack

- **Framework**: [Next.js](https://nextjs.org/)
- **Backend & Database**: [Supabase](https://supabase.io/)
- **Authentication**: [Supabase Auth](https://supabase.com/auth)
- **Styling**: [Tailwind CSS](https://tailwindcss.com/)
- **UI Components**: [Shadcn/UI](https://ui.shadcn.com/) & [Radix UI](https://www.radix-ui.com/)
- **Animations**: [Framer Motion](https://www.framer.com/motion/)
- **Icons**: [Lucide React](https://lucide.dev/)
- **Deployment**: Vercel, Netlify, or any other platform that supports Next.js.

## 🏁 Getting Started

Follow these instructions to get a copy of the project up and running on your local machine for development and testing purposes.

### Prerequisites

- [Node.js](https://nodejs.org/en/) (v18 or newer)
- [Bun](https://bun.sh/) or npm/yarn for package management
- A [Supabase](https://supabase.com/) account for the database.
- A [Supabase](https://supabase.com/) account for backend and authentication.

### Installation

1.  **Clone the repository:**
    ```bash
    git clone https://github.com/your-username/spotlight.git
    cd spotlight
    ```

2.  **Install dependencies:**
    ```bash
    bun install
    # or
    npm install
    ```

3.  **Set up environment variables:**

    Create a `.env.local` file in the root of your project and add the following environment variables. You can get these from your Supabase project settings.

    ```env
    # Supabase
    NEXT_PUBLIC_SUPABASE_URL=your-supabase-project-url
    NEXT_PUBLIC_SUPABASE_ANON_KEY=your-supabase-anon-key
    ```

4.  **Set up Supabase database:**

    You will need to set up your database schema. The application expects tables like `user_profiles`, `education`, `experience`, etc. You can find the required schema in `types/database.ts` or by inspecting the queries in the application.

5.  **Run the development server:**
    ```bash
    bun dev
    # or
    npm run dev
    ```

Open [http://localhost:3000](http://localhost:3000) with your browser to see the result.

## 📂 Project Structure

Here's an overview of the key directories in this project:

```
.
├── app/                  # Main application folder (App Router)
│   ├── dashboard/        # Dashboard pages
│   ├── portfolio/        # Public portfolio pages
│   └── ...
├── components/           # Reusable components
│   ├── ui/               # UI components from Shadcn/UI
│   └── layout/           # Layout components
├── integrations/         # Third-party integrations
│   └── supabase/         # Supabase client and types
├── public/               # Static assets
├── supabase/             # Supabase local development configuration
└── types/                # TypeScript type definitions
```

## 🤝 Contributing

Contributions are what make the open source community such an amazing place to learn, inspire, and create. Any contributions you make are **greatly appreciated**.

If you have a suggestion that would make this better, please fork the repo and create a pull request. You can also simply open an issue with the tag "enhancement".

1.  Fork the Project
2.  Create your Feature Branch (`git checkout -b feature/AmazingFeature`)
3.  Commit your Changes (`git commit -m 'Add some AmazingFeature'`)
4.  Push to the Branch (`git push origin feature/AmazingFeature`)
5.  Open a Pull Request

## 📄 License

Distributed under the MIT License. See `LICENSE` for more information. (You should add a LICENSE file).
