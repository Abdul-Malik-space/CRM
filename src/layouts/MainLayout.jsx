import { useState } from "react";
import { Outlet } from "react-router-dom";
import Sidebar from "../components/Sidebar";
import Topbar from "../components/Topbar";

function MainLayout() {
  const [sidebarOpen, setSidebarOpen] = useState(true);

  return (
    <div className="min-h-screen w-full overflow-x-hidden bg-slate-100">
      <div
        className={`grid min-h-screen w-full overflow-x-hidden transition-all duration-300 ${
          sidebarOpen ? "lg:grid-cols-[18%_82%]" : "lg:grid-cols-[0%_100%]"
        } grid-cols-1`}
      >
        <Sidebar
          isOpen={sidebarOpen}
          closeSidebar={() => setSidebarOpen(false)}
        />

        <main className="min-w-0 w-full overflow-x-hidden">
          <Topbar toggleSidebar={() => setSidebarOpen((prev) => !prev)} />

          <div className="w-full max-w-full overflow-x-hidden p-5">
            <Outlet />
          </div>
        </main>
      </div>
    </div>
  );
}

export default MainLayout;