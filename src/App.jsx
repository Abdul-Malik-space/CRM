import { Route, Routes } from "react-router-dom";
import MainLayout from "./layouts/MainLayout";

import Dashboard from "./pages/Dashboard";
import Leads from "./pages/Leads";
import Customers from "./pages/Customers";
import FollowUps from "./pages/FollowUps";
import Deals from "./pages/Deals";
import Tasks from "./pages/Tasks";
import Reports from "./pages/Reports";
import Settings from "./pages/Settings";
import ComingSoon from "./pages/ComingSoon";
import Payments from "./pages/Payments";
import Projects from "./pages/Projects";
import Calendar from "./pages/Calendar";
import Documents from "./pages/Documents";
import Team from "./pages/Team";
import Services from "./pages/Services";
import Communications from "./pages/Communications";
import Automations from "./pages/Automations";
import Notifications from "./pages/Notifications";
import ActivityLogs from "./pages/ActivityLogs";
import Ledger from "./pages/Ledger";





function App() {
  return (
    <Routes>
      <Route element={<MainLayout />}>
        <Route path="/" element={<Dashboard />} />
        <Route path="/leads" element={<Leads />} />
        <Route path="/customers" element={<Customers />} />
        <Route path="/follow-ups" element={<FollowUps />} />
        

        <Route path="/deals" element={<Deals />} />
        <Route
          path="/proposals"
          element={
            <ComingSoon
              title="Proposals"
              subtitle="Create, send, track, accept, reject, and convert proposals into deals or invoices."
            />
          }
        />
        <Route path="/payments" element={<Payments />} />

        <Route path="/projects" element={<Projects />} />
        <Route path="/tasks" element={<Tasks />} />
        <Route path="/calendar" element={<Calendar />} />
        <Route path="/documents" element={<Documents />} />

      <Route path="/communications" element={<Communications />} />
        <Route path="/reports" element={<Reports />} />

       <Route path="/team" element={<Team />} />
       <Route path="/automations" element={<Automations />} />
       
        <Route path="/notifications" element={<Notifications />} />
       <Route path="/activity-logs" element={<ActivityLogs />} />

        <Route path="/settings" element={<Settings />} />
        <Route path="/ledger" element={<Ledger />} />

        <Route
          path="*"
          element={
            <ComingSoon
              title="Page Not Found"
              subtitle="This route does not exist yet. Please check your sidebar path or route configuration."
            />
          }
        />
      </Route>
    </Routes>
  );
}

export default App;