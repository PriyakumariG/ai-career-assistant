import { Routes, Route } from "react-router-dom";
import Landing from "./pages/Landing";
import Login from "./pages/Login";
import Register from "./pages/Register";
import DashboardLayout from "./pages/DashboardLayout";
import Overview from "./pages/dashboard/Overview";
import ResumePage from "./pages/dashboard/ResumePage";
import CoverLetterPage from "./pages/dashboard/CoverLetterPage";
import InterviewPrepPage from "./pages/dashboard/InterviewPrepPage";
import RoadmapPage from "./pages/dashboard/RoadmapPage";
import HistoryPage from "./pages/dashboard/HistoryPage";
import ProtectedRoute from "./components/ProtectedRoute";
import { ResumeProvider } from "./context/ResumeContext";
import ChatPage from "./pages/dashboard/ChatPage";

function App() {
  return (
    <Routes>
      <Route path="/" element={<Landing />} />
      <Route path="/login" element={<Login />} />
      <Route path="/register" element={<Register />} />

      <Route
        path="/dashboard"
        element={
          <ProtectedRoute>
            <ResumeProvider>
              <DashboardLayout />
            </ResumeProvider>
          </ProtectedRoute>
        }
      >
      
        <Route index element={<Overview />} />
        <Route path="resume" element={<ResumePage />} />
        <Route path="chat" element={<ChatPage />} />  
        <Route path="cover-letter" element={<CoverLetterPage />} />
        <Route path="interview-prep" element={<InterviewPrepPage />} />
        <Route path="roadmap" element={<RoadmapPage />} />
        <Route path="history" element={<HistoryPage />} />
      </Route>
    </Routes>
  );
}

export default App;