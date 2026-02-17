import { Routes, Route } from "react-router-dom";
import { Toaster } from "react-hot-toast";
import Signup from "./pages/signup";
import Signin from "./pages/signin";
import Forget from "./pages/forget_pass";
import Verify from "./pages/verifyEmail";
import Introduction from "./pages/introduction";
import Admin from "./pages/Admin";

import Language from "./pages/language";
import Difficulty from "./pages/difficulty";
import Question from "./pages/question";
import Levels from "./pages/levels";


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
        <Route path="/levels/:difficulty/day/:day" element={<Question />} />
        <Route path="/difficulty" element={<Difficulty />} />
        <Route path="/verifyEmail" element={<Verify />} />
        <Route path="/levels/:difficulty" element={<Levels />} />
      </Routes>
    </>
  );
}

export default App;
