import React from "react";
import { useParams } from "react-router-dom";
import { useGetLectureByCourseStudentQuery } from "../features/user/userApi";
import useAuth from "../hooks/useAuth";
import useTitle from "../hooks/useTitle";
import { memo } from "react";
const LecturePage = () => {
  useTitle("Lecture Page");
  const { id, lectureid } = useParams();
  const { useremail, userrole } = useAuth();
  const { video } = useGetLectureByCourseStudentQuery(id, {
    selectFromResult: ({ data }) => ({
      video: data?.entities[lectureid],
    }),
  });
  if (!useremail || !userrole)
    return (
      <div className="public errmsg">Unauthorized, Please Login Again</div>
    );
  // console.log(video)
  return (
    <section className="public no-inv">
      <div style={{ color: "white" }}>Lecture on {video?.topic}</div>
      <iframe
        src={`https://www.youtube.com/embed/${video?.url}`}
        allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture; web-share;fullscreen"
        referrerPolicy="strict-origin-when-cross-origin"
        allowFullScreen
        style={{
          minWidth: "80vw",
          minHeight: "60vh",
        }}
      ></iframe>
      <div style={{ color: "white" }}>{video?.description}</div>
    </section>
  );
};

export default memo(LecturePage);
