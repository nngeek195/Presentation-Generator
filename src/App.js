import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import './App.css';
import LogIn from './Components/LogIn/LogIn';
import Home from './Components/Home/Home'
import SignUp from './Components/Signup/SignUp';
import Introduction from './Components/Introduction/Introduction';
import User from './Components/User/User'
import AdminPanel from './Components/AdminPanel/AdminPanel';


function App() {
  return (
    <div className="App">
      <Router>
        <Routes>
          <Route path="/" element={<Introduction />} />
          <Route path="/login" element={<LogIn />} />
          <Route path="/home" element={<Home />} />
          <Route path="/signup" element={<SignUp />} />
          <Route path="/user" element={<User />} />
          <Route path="/adminKingSUSL@NirangaKaveeshaIshanGayathri" element={<AdminPanel />} />
        </Routes>
      </Router>
    </div>
  );
}

export default App;
