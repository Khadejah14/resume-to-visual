import "../../styles/globals.css";

export const metadata = {
  title: "Resume to Visual",
  description: "Convert resumes into visual experiences",
};

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="en">
      <body>{children}</body>
    </html>
  );
}