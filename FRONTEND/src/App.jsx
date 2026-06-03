import { Routes, Route } from "react-router-dom";

import RegisterProjectTeam from "./pages/TeamLeader/RegisterProjectTeam";

function App() {
  return (
    <Routes>
      <Route
        path="/Team-Management"
        element={<RegisterProjectTeam />}
      />
    </Routes>
  );
}

export default App;