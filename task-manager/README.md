# Task Manager

A Next.js task manager application with authentication, MongoDB persistence, and a role-based dashboard.

## Features

- User signup and login using NextAuth credentials provider
- Admin and Member roles
- Admin-only task creation
- Task status updates via a kanban-style dashboard
- MongoDB backend with Mongoose models
- Tailwind CSS v4 styling

## Project Structure

- `app/`
  - `page.js` - redirects to `/login`
  - `layout.js` - root layout with global styling and providers
  - `providers.js` - NextAuth `SessionProvider`
  - `login/page.js` - login page
  - `signup/page.js` - signup page
  - `dashboard/page.js` - authenticated task dashboard
  - `api/`
    - `auth/[...nextauth]/route.js` - NextAuth authentication route
    - `auth/signup/route.js` - signup API route
    - `tasks/route.js` - task list and create route
    - `tasks/[id]/route.js` - task update route
- `lib/`
  - `mongodb.js` - MongoDB connection helper
  - `authOptions.js` - NextAuth options shared across routes
- `models/`
  - `User.js` - user model
  - `Task.js` - task model
  - `Project.js` - project model (if used)

## Tech Stack

- Next.js 14
- React 18
- NextAuth for authentication
- MongoDB + Mongoose
- Tailwind CSS v4
- Axios for client HTTP requests

## Setup

1. Clone the repository:

```bash
git clone https://github.com/Anam2577/TaskManager.git
cd TaskManager/task-manager
```

2. Install dependencies:

```bash
npm install
```

3. Create a `.env.local` file in the `task-manager` folder with:

```bash
MONGODB_URI=your_mongodb_connection_string
NEXTAUTH_SECRET=your_nextauth_secret
```

4. Run the development server:

```bash
npm run dev
```

5. Open the app:

```text
http://localhost:3000
```

## Deployment Notes

- Ensure your production host is pointed at the `task-manager` subfolder if the repository root contains multiple folders.
- Railway and other platforms must install dependencies from the actual project root.
- Use `npm run build` and `npm start` for production.

## Environment Variables

- `MONGODB_URI` — MongoDB connection string
- `NEXTAUTH_SECRET` — secret key for NextAuth JWT session encryption

## Usage

- Visit `/signup` to create a new account.
- Visit `/login` to sign in.
- Admin users can create tasks from the dashboard.
- Use the dropdown on each task card to update status.

## Troubleshooting

- If Tailwind CSS appears unstyled, verify `postcss.config.js` uses `@tailwindcss/postcss`.
- If login fails, confirm the user exists in MongoDB and the password is correct.
- If tasks cannot be created, ensure the logged-in user has role `Admin`.

## Notes

- The app uses a credentials-based auth provider, so the `User` model stores hashed passwords.
- Task creation currently uses prompt dialogs inside the dashboard for admin flow.
- The signup route is located at `app/api/auth/signup/route.js`.
