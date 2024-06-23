import React from "react";
import useAuth from "../hooks/useAuth";
import { useState } from "react";
import { Link } from "react-router-dom";
import {
  useAddCourseMutation,
  useAddClassCourseMapMutation,
  useRemoveClassCourseMapMutation,
} from "../features/admin/adminApi";
import {
  useGetAllClassQuery,
  useGetAllCoursesQuery,
} from "../features/classCourse/classCourseApi";
import { useGetCoursesByYouQuery } from "../features/teacher/teacherApi";
import { useGetEnrolledCoursesQuery } from "../features/user/userApi";
import { useGetTeachersQuery } from "../features/admin/adminApi";
import { PulseLoader } from "react-spinners";
import { memo } from "react";
import useTitle from "../hooks/useTitle";
const CourseManagement = () => {
  useTitle("Course Management");
  const { useremail, userrole } = useAuth();
  const [
    addCourse,
    {
      isSuccess: isAddCourseSuccess,
      isError: isAddCourseError,
      isLoading: isAddCourseLoading,
      error: addCourseError,
    },
  ] = useAddCourseMutation();
  const {
    data: teachers,
    isLoading: isTeachersLoading,
    isError: isTeachersError,
    isSuccess: isTeachersSuccess,
    error: teacherError,
  } = useGetTeachersQuery();
  const {
    data: enrolledCourses,
    isLoading: isEnrolledCoursesLoading,
    isError: isEnrolledCoursesError,
    isSuccess: isEnrolledCoursesSuccess,
    error: enrolledCoursesError,
  } = useGetEnrolledCoursesQuery();
  const {
    data: yCourses,
    isLoading: isYCoursesLoading,
    isError: isYCoursesError,
    isSuccess: isYCoursesSuccess,
    error: yCoursesError,
  } = useGetCoursesByYouQuery();
  const {
    data: classes,
    isLoading: isClassesLoading,
    isError: isClassesError,
    isSuccess: isClassesSuccess,
    error: classesError,
  } = useGetAllClassQuery();
  const {
    data: courses,
    isLoading: isCoursesLoading,
    isError: isCoursesError,
    isSuccess: isCoursesSuccess,
    error: coursesError,
  } = useGetAllCoursesQuery();
  const [
    addCourseMap,
    {
      isSuccess: isAddCourseMapSuccess,
      isError: isAddCourseMapError,
      isLoading: isAddCourseMapLoading,
      error: addCourseMapError,
    },
  ] = useAddClassCourseMapMutation();
  const [
    remCourseMap,
    {
      isSuccess: isRemCourseMapSuccess,
      isError: isRemCourseMapError,
      isLoading: isRemCourseMapLoading,
      error: remCourseMapError,
    },
  ] = useRemoveClassCourseMapMutation();
  const [name, setName] = useState("");
  const [description, setDescription] = useState("This course is about");
  const [syllabus, setSyllabus] = useState("");
  const [prerequisites, setPrerequisites] = useState("");
  const [playlist, setPlaylist] = useState("");
  const [teacherid, setTeacherId] = useState(0);
  const [whatsapp, setWhatsapp] = useState("");
  const [courseid, setCourseid] = useState(0);
  const [classid, setClassid] = useState(0);
  if (!useremail || !userrole)
    return (
      <div className="errmsg public">Unauthorized, Please Login Again</div>
    );
  const handleAddCourse = async (e) => {
    e.preventDefault();
    try {
      const result = await addCourse({
        name,
        description,
        syllabus,
        prerequisites,
        teacher_id: teacherid,
        whatsapp,
        playlist,
      });
      setName("");
      setDescription("This course is about");
      setSyllabus("");
      setPlaylist("");
      setTeacherId(0);
      setPrerequisites("");
      setWhatsapp("");
    } catch (err) {
      console.log(err);
    }
  };
  const handleAddCourseClassMap = async (e) => {
    e.preventDefault();
    try {
      const result = await addCourseMap({
        course_id: courseid,
        class_id: classid,
      });
      setClassid(0);
      setCourseid(0);
    } catch (err) {
      console.log(err);
    }
  };

  const handleRemCourseClassMap = async (e) => {
    e.preventDefault();
    try {
      const result = await remCourseMap({
        course_id: courseid,
        class_id: classid,
      });
      setClassid(0);
      setCourseid(0);
    } catch (err) {
      console.log(err);
    }
  };
  const handleName = (e) => setName(e.target.value);
  const handleDesc = (e) => setDescription(e.target.value);
  const handleSyllabus = (e) => setSyllabus(e.target.value);
  const handlePrereq = (e) => setPrerequisites(e.target.value);
  const handleTeacherId = (e) => setTeacherId(e.target.value);
  const handlePlaylist = (e) => setPlaylist(e.target.value);
  const handleWhatsapp = (e) => setWhatsapp(e.target.value);
  const handleCourses = (e) => setCourseid(e.target.value);
  const hanldeClasses = (e) => setClassid(e.target.value);

  return (
    <section className="public">
      {userrole === process.env.REACT_APP_ADMIN && (
        <>
          <div>Add New Course</div>
          {isAddCourseError && (
            <div className="errmsg">
              {addCourseError?.data?.message || "Error"}
            </div>
          )}
          <form className="form" onSubmit={handleAddCourse}>
            <label htmlFor="name" className="form__title-row">
              Course Name
              <input
                className="form__input"
                type="text"
                id="name"
                value={name}
                onChange={handleName}
                autoComplete="off"
                required
              />
            </label>
            <label htmlFor="description" className="form__title-row">
              Course Description
              <textarea
                name="description"
                id="description"
                value={description}
                onChange={handleDesc}
                className="form__input"
                required
              />
            </label>
            <label htmlFor="syllabus" className="form__title-row">
              Syllabus
              <textarea
                name="syllabus"
                id="syllabus"
                value={syllabus}
                onChange={handleSyllabus}
                className="form__input"
                required
              />
            </label>
            <label htmlFor="prerequisites" className="form__title-row">
              Prerequisites
              <textarea
                name="prerequisites"
                id="prerequisites"
                value={prerequisites}
                onChange={handlePrereq}
                className="form__input"
                required
              />
            </label>
            <label htmlFor="teacherid" className="form__title-row">
              Teacher
              <select
                name="teacherid"
                id="teacherid"
                onChange={handleTeacherId}
                className="form__input"
              >
                <option value="0">--Select*--</option>
                {!isTeachersError &&
                  !isTeachersLoading &&
                  teachers.ids.map((id) => (
                    <option value={id} key={id}>
                      {teachers.entities[id].name}
                    </option>
                  ))}
              </select>
            </label>
            <label htmlFor="playlist" className="form__title-row">
              Playlist Id
              <input
                type="text"
                name="playlist"
                id="playlist"
                value={playlist}
                onChange={handlePlaylist}
                className="form__input"
                required
              />
            </label>
            <label htmlFor="whatsapp" className="form__title-row">
              Whatsapp Link
              <input
                type="text"
                name="whatsapp"
                id="whatsapp"
                value={whatsapp}
                onChange={handleWhatsapp}
                className="form__input"
                required
              />
            </label>
            <button className="form__submit-button">
              {isAddCourseLoading ? (
                <PulseLoader color="black" />
              ) : (
                "Add The Course"
              )}
            </button>
          </form>
          <div>Assign Courses To Classes</div>
          {isAddCourseMapError && (
            <div className="errmsg">
              {addCourseMapError?.data?.message || "Error"}
            </div>
          )}
          <form className="form" onSubmit={handleAddCourseClassMap}>
            <label htmlFor="classid" className="form__title-row">
              Class
              <select
                name="classid"
                id="classid"
                onChange={hanldeClasses}
                className="form__input"
              >
                <option value="0">--Select*--</option>
                {!isClassesError &&
                  !isClassesLoading &&
                  classes.ids.map((id) => (
                    <option value={id} key={id}>
                      {classes.entities[id].name}
                    </option>
                  ))}
              </select>
            </label>
            <label htmlFor="courseid" className="form__title-row">
              Course
              <select
                name="courseid"
                id="courseid"
                onChange={handleCourses}
                className="form__input"
              >
                <option value="0">--Select*--</option>
                {!isCoursesError &&
                  !isCoursesLoading &&
                  courses.ids.map((id) => (
                    <option value={id} key={id}>
                      {courses.entities[id].name}
                    </option>
                  ))}
              </select>
            </label>
            <button className="form__submit-button">
              {isAddCourseMapLoading ? <PulseLoader color="black" /> : "Assign"}
            </button>
          </form>
          <div>Remove Courses From Classes</div>
          {isRemCourseMapError && (
            <div className="errmsg">
              {remCourseMapError?.data?.message || "Error"}
            </div>
          )}
          <form className="form" onSubmit={handleRemCourseClassMap}>
            <label htmlFor="classid" className="form__title-row">
              Class
              <select
                name="classid"
                id="classid"
                onChange={hanldeClasses}
                className="form__input"
              >
                <option value="0">--Select*--</option>
                {!isClassesError &&
                  !isClassesLoading &&
                  classes.ids.map((id) => (
                    <option value={id} key={id}>
                      {classes.entities[id].name}
                    </option>
                  ))}
              </select>
            </label>
            <label htmlFor="courseid" className="form__title-row">
              Course
              <select
                name="courseid"
                id="courseid"
                onChange={handleCourses}
                className="form__input"
              >
                <option value="0">--Select*--</option>
                {!isCoursesError &&
                  !isCoursesLoading &&
                  courses.ids.map((id) => (
                    <option value={id} key={id}>
                      {courses.entities[id].name}
                    </option>
                  ))}
              </select>
            </label>
            <button className="form__submit-button">
              {isRemCourseMapLoading ? <PulseLoader color="black" /> : "Remove"}
            </button>
          </form>
        </>
      )}
      {userrole === process.env.REACT_APP_USER && (
        <>
          <div>My Enrolled Courses</div>
          {!isEnrolledCoursesError &&
            !isEnrolledCoursesLoading &&
            enrolledCourses.ids.map((id) => (
              <div key={id} className="card">
                <Link style={{ color: "black" }} to={`/courses/${id}`}>
                  <h2>{enrolledCourses.entities[id].name}</h2>
                  <div>
                    {enrolledCourses.entities[id].minor
                      ? "Minor Elective"
                      : "Major Course"}
                  </div>
                </Link>
                <Link
                  style={{ color: "black" }}
                  to={`https://chat.whatsapp.com/${enrolledCourses.entities[id].whatsapp}`}
                  target="_blank"
                >
                  Whatsapp Group Link
                </Link>
              </div>
            ))}
        </>
      )}
      {userrole === process.env.REACT_APP_TEACHER && (
        <>
          <div>My Courses</div>
          {!isYCoursesError &&
            !isYCoursesLoading &&
            yCourses.ids.map((id) => (
              <div key={id} className="card">
                <Link style={{ color: "black" }} to={`/courses/${id}`}>
                  <h2>{yCourses.entities[id].name}</h2>
                  <div>
                    {yCourses.entities[id].minor
                      ? "Minor Elective"
                      : "Major Course"}
                  </div>
                </Link>
                <Link
                  style={{ color: "black" }}
                  to={`https://chat.whatsapp.com/${yCourses.entities[id].whatsapp}`}
                  target="_blank"
                >
                  Whatsapp Group Link
                </Link>
              </div>
            ))}
        </>
      )}
    </section>
  );
};

export default memo(CourseManagement);
