import { useEffect, useState } from "react";

export default function WelcomeBanner() {
  const [visible, setVisible] = useState(true);

  useEffect(() => {
    const timer = setTimeout(() => setVisible(false), 3000);
    return () => clearTimeout(timer);
  }, []);

  if (!visible) return null;

  return (
    <div className="w-full rounded-xl shadow-lg bg-primary text-primary-foreground animate-slide-fade-in py-16 px-4 sm:px-8 md:px-12 text-center text-4xl font-bold tracking-wide">
      Welcome to Mtabiri
    </div>
  );
}
