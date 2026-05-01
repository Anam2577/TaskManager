import "./globals.css";

export const metadata = {
  title: "Task Manager",
  description: "Full Stack Task Manager MVP",
};

export default function RootLayout({ children }) {
  return (
    <html lang="en">
      <body className="bg-gray-50">{children}</body>
    </html>
  );
}