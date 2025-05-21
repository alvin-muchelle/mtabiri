export const metadata = {
  title: 'Mtabiri',
  description: 'Get the latest weather',
}


import "./globals.css";
import { ThemeProvider } from "@/components/ThemeProvider";
import { ModeToggle } from "@/components/ModeToggle";

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="en" suppressHydrationWarning className="h-full">
      <meta name="viewport" content="width=device-width, initial-scale=1" />
      <body>
        <ThemeProvider
          attribute="class"                    
          defaultTheme="system"
          enableSystem
          disableTransitionOnChange
        >
          <ModeToggle />       
          {children}
        </ThemeProvider>
      </body>
    </html>
  );
}
