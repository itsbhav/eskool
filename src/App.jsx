import { Routes, Route } from "react-router-dom";
import Public from "./components/Public";
import Layout from "./components/Layout";
import Instructions from "./components/Instructions";
import Login from "./features/auth/Login";
import Register from "./features/auth/Register";
import PersistLogin from "./features/auth/PersistLogin";
import Dashboard from "./components/Dashboard";
import Course from "./components/Course";
import AdvertisementManagement from "./components/AdvertisementManagement";
import NoticeManagement from "./components/NoticeManagement";
import ClassManagement from "./components/ClassManagement";
import CourseManagement from "./components/CourseManagement";
import FeeManagement from "./components/FeeManagement";
import MarksManagement from "./components/MarksManagement";
import Profile from "./components/Profile";
import Prefetch from "./features/auth/Prefetch";
import ForgotPass from "./components/ForgotPass";
import DataNotFound from "./components/DataNotFound";
import CourseDetail from "./components/CourseDetail";
import LecturePage from "./components/LecturePage";
import Account from "./components/Account";
function App() {
  return (
    <Routes>
      <Route path="/" element={<Layout />}>
        <Route index element={<Public />} />
        <Route path="instructions" element={<Instructions />} />
        <Route path="login" element={<Login />} />
        <Route path="register" element={<Register />} />
        <Route path="recoverPassword" element={<ForgotPass />} />
        {/* <Route path="welcome" element={<Welcome />} /> */}
        {/* Protected Routes */}
        <Route path="course" element={<Course />} />
        <Route element={<Prefetch />}>
          <Route element={<PersistLogin />}>
            <Route path="courses" element={<Course />} />
            <Route path="profile" element={<Profile />} />
            <Route path="dash" element={<Dashboard />} />
            <Route path="accounts" element={<Account />} />
            <Route path="advertisement" element={<AdvertisementManagement />} />
            <Route path="notice" element={<NoticeManagement />} />
            <Route path="class" element={<ClassManagement />} />
            <Route path="managec" element={<CourseManagement />} />
            <Route path="fee" element={<FeeManagement />} />
            <Route path="marks" element={<MarksManagement />} />
            <Route path="courses/:id" element={<CourseDetail />} />
            <Route path="courses/:id/:lectureid" element={<LecturePage />} />
          </Route>
        </Route>
        <Route path="*" element={<DataNotFound />} />
      </Route>
    </Routes>
  );
}

export default App;
