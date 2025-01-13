import React from "react";
import { Route, Routes } from "react-router-dom";
import SignIn from "./pages/general/SignIn";

function App() {
  return (
    <Routes>
      {/* Landing page route */}
      <Route path="/" element={<SignIn />} />

      {/* Group routes for user-related pages */}
      {/* <Route
        path="/user/*"
        element={
          <div className="flex h-screen bg-gray-50 dark:bg-gray-900">
            <Sidebar /> 
            <div className="flex-1 flex flex-col">
              <Topbar /> 
              <main className="flex-1 overflow-y-auto">
                <Routes>
                  <Route path="dashboard" element={<DashBoard />} />
                  <Route path="iupc-details" element={<IUPCDetails />} />
                  <Route path="duel" element={<Duel />} />
                  <Route path="duel-room" element={<DuelRoom />} />
                  <Route path="duel-history" element={<DuelHistory />} />
                  <Route path="leaderboard" element={<LeaderBoard />} />
                  <Route path="cf-profile" element={<CFProfile />} />
                  <Route path="contest-details" element={<ContestDetails />} />
                  <Route path="ongoing-challenge" element={<OngoingChallenge />} />
                </Routes>
              </main>
            </div>
          </div>
        }
      /> */}
    </Routes>
  );
}

export default App;
