import { store } from "../../app/store";
import { useEffect } from "react";
import { Outlet } from "react-router-dom";
import { advertisementsApiSlice } from "../advertisements/advertisementApi";
import { noticesApiSlice } from "../notices/noticeApi";
import { classCoursesApiSlice } from "../classCourse/classCourseApi";
import { teachersApiSlice } from "../teacher/teacherApi";
import { studentsApiSlice } from "../user/userApi";

const Prefetch = () => {
  useEffect(() => {
    store.dispatch(
      advertisementsApiSlice.util.prefetch("getAllAdvertisements", 1, {
        force: true,
      })
    );
    store.dispatch(
      noticesApiSlice.util.prefetch("getAllNotices", 1, { force: true })
    );
    store.dispatch(
      classCoursesApiSlice.util.prefetch("getAllClass", undefined, {
        force: true,
      })
    );
    store.dispatch(
      classCoursesApiSlice.util.prefetch("getAllCourses", undefined, {
        force: true,
      })
    );
    store.dispatch(
      teachersApiSlice.util.prefetch("getTeachers", undefined, { force: true })
    );
    store.dispatch(
      studentsApiSlice.util.prefetch("getStudent", undefined, { force: true })
    );
  }, []);
  return <Outlet />;
};
export default Prefetch;
