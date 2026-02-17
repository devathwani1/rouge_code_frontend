import { Routes, Route, Navigate } from "react-router-dom";
import { Toaster } from "react-hot-toast";
import Signup from "./pages/signup";
import Signin from "./pages/signin";
import Forget from "./pages/forget_pass";
import New_pass from "./pages/new_pass";
import Verify from "./pages/verifyEmail";
import Introduction from "./pages/introduction";
import Admin from "./pages/Admin";

import Language from "./pages/language";
import Difficulty from "./pages/difficulty";
import Questions from "./pages/question";
import LandingPage from "./pages/landing_page";

function App() {
  return (
    <>
      <Toaster position="top-right" reverseOrder={false} />
      <Routes>
        <Route path="/introduction" element={<Introduction />} />
        <Route path="/signup" element={<Signup />} />
        <Route path="/signin" element={<Signin />} />
        <Route path="/forget_pass" element={<Forget />} />
        <Route path="/admin/*" element={<Admin />} />
        <Route path="/language" element={<Language />} />
        <Route path="/question" element={<Questions />} />
        <Route path="/difficulty" element={<Difficulty />} />
        <Route path="/verifyEmail" element={<Verify/>}/>
        <Route path="/" element={<LandingPage/>}/>
      </Routes>
    </>
  );
}

export default App;
