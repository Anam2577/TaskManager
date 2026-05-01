import "./globals.css";
import Providers from "./providers";

export const metadata = {
  title: "Task Manager",
  description: "Full Stack Task Manager MVP",
};

export default function RootLayout({ children }) {
  return (
    <html lang="en">
      <body className="bg-gray-50">
        <Providers>{children}</Providers>
      </body>
    </html>
  );
}