import "./globals.css";
import { ThemeProvider } from "@/components/ThemeProvider";

export const metadata = {
  title: 'Mtabiri',
  description: 'Get the latest weather',
}

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
          {children}
        </ThemeProvider>
      </body>
    </html>
  );
}
