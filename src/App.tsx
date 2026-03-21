import { Routes, Route } from "react-router-dom";
import { Toaster } from "react-hot-toast";
import Signup from "./pages/signup";
import Signin from "./pages/signin";
import Forget from "./pages/forget_pass";
import Newpass from "./pages/new_pass";
import Verify from "./pages/verifyEmail";
import Introduction from "./pages/introduction";
import Admin from "./pages/Admin";

import Language from "./pages/language";
import Difficulty from "./pages/difficulty";
import Question from "./pages/question";
import Levels from "./pages/levels";

import LandingPage from "./pages/landing_page";
import TodayQuestions from "./pages/today-questions";
import TopBar from "./components/TopBar";
import LivesZeroRedirect from "./components/LivesZeroRedirect";
import Profile from "./pages/profile";
import GameOver from "./pages/game-over";

function App() {
  return (
    <>
      <Toaster position="top-right" reverseOrder={false} />
      <TopBar />
      <LivesZeroRedirect />
      <div className="pt-16">
        <Routes>
          <Route path="/introduction" element={<Introduction />} />
          <Route path="/signup" element={<Signup />} />
          <Route path="/signin" element={<Signin />} />
          <Route path="/forget_pass" element={<Forget />} />
          <Route path="/new_pass" element={<Newpass />} />
          <Route path="/admin/*" element={<Admin />} />
          <Route path="/language" element={<Language />} />
          <Route path="/question/:questionId" element={<Question />} />
          <Route path="/difficulty" element={<Difficulty />} />
          <Route path="/verifyEmail" element={<Verify />} />
          <Route path="/levels/:difficulty" element={<Levels />} />
          <Route path="/levels" element={<Levels />} />
          <Route path="/daily-plan/:planId" element={<TodayQuestions />} />
          <Route path="/profile" element={<Profile />} />
          <Route path="/game-over" element={<GameOver />} />
          <Route path="/" element={<LandingPage />} />
        </Routes>
      </div>
    </>
  );
}

export default App;
