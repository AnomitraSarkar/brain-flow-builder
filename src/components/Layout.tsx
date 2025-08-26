import { Outlet } from "react-router-dom";
import { Navbar } from "./Navbar";
import { Footer } from "./Footer";

export const Layout = () => {
  return (
    <div className="min-h-screen bg-gradient-to-br from-background via-background to-background neural-pattern">
      <Navbar />
      <main>
        <Outlet />
      </main>
      <Footer />
    </div>
  );
};