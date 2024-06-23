import React, { useEffect } from "react";
import { useGetAllCoursesQuery } from "../features/classCourse/classCourseApi";
import { useGetEnrolledCoursesQuery } from "../features/user/userApi";
import useAuth from "../hooks/useAuth";
import { Link } from "react-router-dom";
import { useAddCourseAsMinorMutation } from "../features/user/userApi";
import { PulseLoader } from "react-spinners";
import { useGetStudentQuery } from "../features/user/userApi";
import { useState } from "react";
import useTitle from "../hooks/useTitle";
import { memo } from "react";

const Course = () => {
  useTitle("Course Page");
  const { useremail, userrole } = useAuth();
  const {
    data: courses,
    isLoading: isCoursesLoading,
    isError: isCoursesError,
  } = useGetAllCoursesQuery();
  const {
    data: enCourses,
    isLoading: isEnCoursesLoading,
    isError: isEnCoursesError,
  } = useGetEnrolledCoursesQuery();
  const [addCourse, { isLoading: isCL, isError: isCE, error: cE }] =
    useAddCourseAsMinorMutation();
  const {
    data: st,
    isLoading: isSTL,
    isError: isSTE,
  } = useGetStudentQuery(undefined);
  const [stR, setStR] = useState("");
  const [cid, setCid] = useState(0);
  useEffect(() => {
    if (!isSTL && !isSTE) {
      const roll = st.ids.map((id) => st.entities[id].roll);

      setStR(roll[0]);
    }
  }, [setStR, stR, st]);
  const handleSubmit = async (e) => {
    try {
      e.preventDefault();
      const result = await addCourse({
        course_id: cid,
        minor: true,
        student_roll: stR,
      });
    } catch (err) {
      console.log(err);
    }
  };
  return (
    <section className="public">
      {userrole === process.env.REACT_APP_USER && (
        <>
          <div>Your Courses</div>
          {!isEnCoursesLoading &&
            !isEnCoursesError &&
            !isCoursesLoading &&
            !isCoursesError &&
            enCourses.ids.map((id) => (
              <div key={id} className="card">
                <Link style={{ color: "black" }} to={`/courses/${id}`}>
                  <h2>{enCourses.entities[id].name}</h2>
                  <div>
                    {enCourses.entities[id].minor
                      ? "Minor Elective"
                      : "Major Course"}
                  </div>
                </Link>
                <Link
                  style={{ color: "black" }}
                  to={`https://chat.whatsapp.com/${enCourses.entities[id].whatsapp}`}
                  target="_blank"
                >
                  Whatsapp Group Link
                </Link>
                <div>Syllabus: {"   " + courses.entities[id].syllabus}</div>
                <div>
                  Prerequisites: {"   " + courses.entities[id].prerequisites}
                </div>
                <div>
                  Description: {"   " + courses.entities[id].description}
                </div>
              </div>
            ))}
        </>
      )}
      <div>Enroll In Our Courses</div>
      {!isCoursesLoading &&
        !isCoursesError &&
        !isEnCoursesLoading &&
        courses.ids
          .filter((id) => !enCourses?.ids?.includes(id))
          .map((id) => (
            <div key={id} className="card">
              {id == cid && isCE && (
                <div className="errmsg">{cE?.data?.message || "Error"}</div>
              )}
              <Link style={{ color: "black" }} to={`/courses/${id}`}>
                <h2>{courses.entities[id].name}</h2>
              </Link>
              <Link
                style={{ color: "black" }}
                to={`https://chat.whatsapp.com/${courses.entities[id].whatsapp}`}
                target="_blank"
              >
                Whatsapp Group Link
              </Link>
              <div>Syllabus: {"   " + courses.entities[id].syllabus}</div>
              <div>
                Prerequisites: {"   " + courses.entities[id].prerequisites}
              </div>
              <div>Description: {"   " + courses.entities[id].description}</div>
              {userrole === process.env.REACT_APP_USER && useremail && (
                <form onSubmit={handleSubmit}>
                  <button
                    className="form__submit-button"
                    onClick={() => setCid(id)}
                  >
                    {isCL && cid == id ? (
                      <PulseLoader />
                    ) : (
                      "Add Course as Minor"
                    )}
                  </button>
                </form>
              )}
            </div>
          ))}
    </section>
  );
};

export default memo(Course);
