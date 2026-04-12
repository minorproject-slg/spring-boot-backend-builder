import { Routes, Route } from "react-router";
import Layout from "./Layout.tsx";
import Home from "./pages/Home.tsx";

function App() {
  return (
    <Routes>
      <Route element={<Layout />}>
        <Route path="/" element={<Home/>} />
        <Route path="*" element={<h1>Page Not Found</h1>} />
      </Route>
    </Routes>
  );
}

export default App;
