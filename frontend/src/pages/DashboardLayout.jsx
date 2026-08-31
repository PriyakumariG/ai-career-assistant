import { Outlet } from "react-router-dom";
import Navbar from "../components/Navbar";
import Sidebar from "../components/Sidebar";
import MobileNavBar from "../components/MobileNavBar";

export default function DashboardLayout() {
  return (
    <div className="min-h-screen bg-base flex flex-col">
      <Navbar />
      <MobileNavBar />
      <div className="flex flex-1">
        <Sidebar />
        <main className="flex-1 px-4 sm:px-8 py-8 max-w-4xl">
          <Outlet />
        </main>
      </div>
    </div>
  );
}