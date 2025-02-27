# ThoughtBox - Modern Note Taking App

A sleek, modern note-taking application built with Next.js and Supabase. Capture your thoughts, organize with tags, and find them easily.

## Features

- 📝 Create, edit, and delete notes
- 🏷️ Tag-based organization
- 🔍 Powerful search functionality
- 📌 Pin important notes to the top
- 🎨 Colorize notes for visual organization
- 💾 Automatic saving to cloud database
- 📱 Responsive design that works on all devices

## Tech Stack

- **Frontend**: Next.js, React, TypeScript, Tailwind CSS, DaisyUI
- **Animation**: Framer Motion
- **Backend**: Supabase (PostgreSQL, Auth)
- **Icons**: React Icons
- **State Management**: React Hooks

## Deployment

### Deploy to Vercel

The easiest way to deploy this app is using Vercel:

1. Fork or clone this repository to your GitHub account
2. Sign up for a [Vercel account](https://vercel.com/signup) if you don't have one
3. Click the "New Project" button in your Vercel dashboard
4. Import your GitHub repository
5. Vercel will automatically detect the Next.js project
6. Add the following environment variables in the Vercel project settings:
   - `NEXT_PUBLIC_SUPABASE_URL`: Your Supabase URL
   - `NEXT_PUBLIC_SUPABASE_ANON_KEY`: Your Supabase anonymous key
7. Click "Deploy"

Your app will be deployed to a URL like `your-project-name.vercel.app`

### Local Development

To run the project locally:

1. Clone the repository
2. Install dependencies:
   ```bash
   npm install
   ```
3. Create a `.env.local` file with your Supabase credentials:
   ```
   NEXT_PUBLIC_SUPABASE_URL=your-supabase-url
   NEXT_PUBLIC_SUPABASE_ANON_KEY=your-supabase-anon-key
   ```
4. Run the development server:
   ```bash
   npm run dev
   ```
5. Open [http://localhost:3000](http://localhost:3000) in your browser

## Future Enhancements

- User authentication and personal notes
- Note sharing functionality
- Rich text editor with markdown support
- Dark/light theme toggle
- Mobile app with offline support
- Reminders and notifications

## License

MIT
