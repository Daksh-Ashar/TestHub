import { BrowserRouter, Routes, Route } from "react-router-dom";
import Auth from "./Pages/Auth";
import NotFound from "./Pages/NotFound";
import ProtectedRoute from "./Components/ProtectedRoute";
import ErrorBoundary from "./Components/ErrorBoundary";
import DashboardLayout from "./Layout/DashboardLayout";
import CreatorClasses from "./Pages/Creator/CreatorClasses";
import ParticipantClasses from "./Pages/participant/ParticipantClasses";
import ClassDetails from "./Pages/Creator/ClassDetails";
import CreateTest from "./Pages/Creator/CreateTest";
import AddQuestion from "./Components/AddQuestion";
import TakeTest from "./Pages/Exam/TakeTest";
import ParticipantClassDetails from "./Pages/participant/ParticipantClassDetails";
import ResultScreen from "./Pages/Exam/ResultScreen";
import ParticipentsResults from "./Pages/Results/ParticipentsResults";
import CreatorViewAllTest from "./Pages/Exam/CreatorViewAllTest";
import HomeRedirect from "./Components/HomeRedirect";
import { ClassProvider } from "./Pages/Class/Contexts/classContext";
import TestInstructions from "./Pages/Exam/TestInstructions";
import ParticipentsViewAllTest from "./Pages/Exam/ParticipentsViewAllTest";

function App() {
  return (
    <BrowserRouter>
      <ErrorBoundary>
        <Routes>
          <Route path="/" element={<HomeRedirect />} />
          <Route path="/auth" element={<Auth />} />

          <Route
            path="/creator"
            element={
              <ProtectedRoute allowedRole="creator">
                <DashboardLayout />
              </ProtectedRoute>
            }
          >
            <Route path="classes" element={<ClassProvider><CreatorClasses /></ClassProvider >} />
            <Route path="classes/:classId" element={<ClassProvider><ClassDetails /></ClassProvider>} />
            <Route
              path="classes/:classId/tests/create"
              element={<CreateTest />}
            />
            <Route
              path="classes/:classId/tests/:testId/questions"
              element={<AddQuestion />}
            />
            <Route path="tests" element={<CreatorViewAllTest />} />
          </Route>

          <Route
            path="/participant"
            element={
              <ProtectedRoute allowedRole="participant">
                <DashboardLayout />
              </ProtectedRoute>
            }
          >
            <Route
              path="classes/:classId"
              element={<ClassProvider><ParticipantClassDetails /></ClassProvider>}
            />
            <Route
              path="classes/:classId/tests/:testId"
              element={<TakeTest />}
            />
            <Route
              path="classes/:classId/tests/:testId/instructions"
              element={<TestInstructions />}
            />
            <Route
              path="classes/:classId/tests/:testId/result"
              element={<ResultScreen />}
            />
            <Route path="tests" element={<ParticipentsViewAllTest />} />
            <Route path="classes" element={<ClassProvider><ParticipantClasses /></ClassProvider>} />
            <Route path="results" element={<ParticipentsResults />} />
          </Route>
          <Route path="*" element={<NotFound />} />
        </Routes>
      </ErrorBoundary>
    </BrowserRouter>
  );
}

export default App;
