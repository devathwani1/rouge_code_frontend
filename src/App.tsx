import { Routes, Route, Navigate } from "react-router-dom";
import Signup from "./pages/signup";
import Signin from "./pages/signin";
import Forget from "./pages/forget_pass";
import New_pass from "./pages/new_pass";
import Verify from "./pages/verifyEmail";
import Introduction from "./pages/introduction";
function App() {
  return (
    <Routes>
      <Route path="/signup" element={<Signup />} />
      <Route path="/signin" element={<Signin />} />
      <Route path="/forget_pass" element={<Forget />}/>
      <Route path="/new_pass" element={<New_pass />}/>
      <Route path="/verifyEmail" element={<Verify/>}/>
      <Route path="/introduction" element={<Introduction/>}/>
      <Route path="*" element={<Navigate to="/" replace />} />
    </Routes>
  );
}

export default App;
