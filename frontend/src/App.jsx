import { Route, Routes } from "react-router-dom";
import Login from "./components/Login";
import Register from "./components/Register";
import Dashboard from "./components/Dashboard";
import Navbar from "./components/Navbar";
import Homepage from "./components/HomePage";
import ComplaintForm from "./pages/AddComplaint";
import UserComplaints from "./pages/MyComplaints";
import Footer from "./components/Footer";
import AdminComplaintManagement from "./admin/AdminComplaints";

const App=()=>{
  return(
   <>
   <Navbar/>
   <Routes>
    <Route path="/" element={<Homepage/>}/>
    <Route path="/login" element={<Login/>}/>
    <Route path="/register" element={<Register/>}/>
    <Route path="/dashboard" element={<Dashboard/>}/>
    <Route path="/add-complaint" element={<ComplaintForm/>}/>
    <Route path="/my-complaints" element={<UserComplaints/>}/>
    <Route path="/admin/complaints" element={<AdminComplaintManagement/>}/>
   </Routes>
   <Footer/>
   </>
  )
}
export default App;