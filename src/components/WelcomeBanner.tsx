import { useEffect, useState } from "react";

export default function WelcomeBanner() {
  const [visible, setVisible] = useState(true);

  useEffect(() => {
    const timer = setTimeout(() => setVisible(false), 1000);
    return () => clearTimeout(timer);
  }, []);

  if (!visible) return null;

  return (
    <div className="w-full mt-4 mb-6 rounded-xl shadow-lg bg-primary text-primary-foreground animate-fade-in">
      <div className="py-8 px-4 sm:py-12 sm:px-6 text-center text-2xl sm:text-3xl font-bold tracking-wide">
        Welcome to Mtabiri
      </div>
    </div>
  );
}
