import React from "react";
import useAuth from "../hooks/useAuth";
import { useGetStudentQuery } from "../features/user/userApi";
import { useGetTeacherQuery } from "../features/teacher/teacherApi";
import useTitle from "../hooks/useTitle";
import { memo } from "react";
const Profile = () => {
  useTitle("Profile");
  const { useremail, userrole } = useAuth();
  const { data, isLoading, isError, error, isSuccess } = useGetStudentQuery();
  const {
    data: t,
    isLoading: istL,
    isError: istE,
    error: tE,
    isSuccess: istS,
  } = useGetTeacherQuery();
  if (!userrole || !useremail)
    return (
      <div className="public errmsg">Unauthorized, Please Login Again</div>
    );
  return (
    <section className="profile-flex">
      <div>Email: {useremail}</div>
      <div>
        Role:{" "}
        {userrole === process.env.REACT_APP_ADMIN
          ? "Admin"
          : userrole === process.env.REACT_APP_USER
          ? "Student"
          : "Teacher"}
      </div>
      {userrole === process.env.REACT_APP_USER &&
        !isError &&
        !isLoading &&
        data.ids.map((id) => (
          <>
            <div>Roll: {data.entities[id].roll}</div>
            <div>Name: {data.entities[id].name}</div>
            <div>
              {data.entities[id].email_verified
                ? "Verified User"
                : "User Not Verified, Contact Us"}
            </div>
          </>
        ))}
      {userrole === process.env.REACT_APP_TEACHER &&
        !istE &&
        !istL &&
        t.ids.map((id) => (
          <>
            <div>Name: {t.entities[id].name}</div>
            <div>Institute: {t.entities[id].institution} </div>
            <div style={{ textAlign: "center" }}>Verification Details</div>
            <div className="public" style={{ border: "2px solid" }}>
              <div>
                {t.entities[id].email_verified
                  ? "Verified User"
                  : "User Not Verified, Contact Us"}
              </div>
              <div>
                {t.entities[id].verified_by_admin
                  ? "Admin Verified User"
                  : "User Not Verified, Contact Us"}
              </div>
              <div>
                {t.entities[id].verified_by_teacher
                  ? "Self Verified User"
                  : "User Not Verified, Contact Us"}
              </div>
            </div>
          </>
        ))}
      {userrole === process.env.REACT_APP_USER && isError && (
        <div>{error.data?.message || "Error"}</div>
      )}
      {userrole === process.env.REACT_APP_TEACHER && istE && (
        <div>{tE.data?.message || "Error"}</div>
      )}
    </section>
  );
};

export default memo(Profile);
