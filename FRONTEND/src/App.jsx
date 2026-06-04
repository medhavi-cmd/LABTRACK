import { Routes, Route } from "react-router-dom";

import RegisterProjectTeam from "./pages/TeamLeader/RegisterProjectTeam";
import AddMembers from "./pages/TeamLeader/AddMembers";
import ReviewTeamDetails from "./pages/TeamLeader/ReviewTeamDetails";
import Login from "./pages/Auth/Login";

function App() {
  return (
    <Routes>
      <Route
        path="/login"
        element={<Login />}
      />
      <Route
        path="/Team-Management"
        element={<RegisterProjectTeam />}
      />

      <Route
        path="/Team-Management/Add-Members"
        element={<AddMembers />}
      />

      <Route
        path="/Team-Management/Review-Team"
        element={<ReviewTeamDetails />}
      />
    </Routes>
  );
}

export default App;