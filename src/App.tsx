import { Route, Routes } from "react-router";
import Home from "./pages/Home";
import NewProjectPage from "./pages/projects/NewProjectPage";
import Designer from "./pages/projects/Designer";
import ProjectReviewPage from "./pages/projects/ProjectReviewPage";
import MissingProjectRoutePage from "./pages/projects/MissingProjectRoutePage";

function App() {
  return (
    <Routes>
      <Route path="/" element={<Home />} />
      <Route path="/projects/new" element={<NewProjectPage />} />
      <Route path="/projects/:projectId/designer" element={<Designer />} />
      <Route path="/projects/:projectId/review" element={<ProjectReviewPage />} />
      <Route path="/projects/designer" element={<MissingProjectRoutePage />} />
      <Route path="/projects/review" element={<MissingProjectRoutePage />} />
      <Route path="*" element={<h1>Page Not Found</h1>} />
    </Routes>
  );
}

export default App;
