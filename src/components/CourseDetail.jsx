import React, { useState } from "react";
import { useParams } from "react-router-dom";
import {
  useAddLectureMutation,
  useGetLecturesByCourseQuery,
  useAddToPlaylistMutation,
  useUploadVideoMutation,
  useGetCoursesByYouQuery,
  useAddYTCredQuery,
  useGetStudentsByCourseQuery,
  useGetAssignmentByCourseTeacherQuery,
  useDeleteAssignmentMutation,
  useAddAssignmentMutation,
} from "../features/teacher/teacherApi";
import { Link } from "react-router-dom";
import {
  useGetLectureByCourseStudentQuery,
  useGetAssignmentsByCourseQuery,
} from "../features/user/userApi";
import useAuth from "../hooks/useAuth";
import { PulseLoader } from "react-spinners";
import axios from "axios";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faTrashAlt } from "@fortawesome/free-solid-svg-icons";
import useTitle from "../hooks/useTitle";
import { memo } from "react";
const CourseDetail = () => {
  useTitle("Course Detail");
  const { id } = useParams();
  const { useremail, userrole } = useAuth();
  const [topic, setTopic] = useState("");
  const [url, setUrl] = useState("");
  const [description, setDescription] = useState("");
  const [file, setFile] = useState(null);
  const [atopic, setATopic] = useState("");
  const [aSDate, setASDate] = useState("");
  const [assFile, setAssFile] = useState(null);
  const [
    addLect,
    { isLoading: isAL, isSuccess: isAS, isError: isAE, error: aE },
  ] = useAddLectureMutation();
  const [
    addPlay,
    { isLoading: isAPL, isSuccess: isAPS, isError: isAPE, error: aPE },
  ] = useAddToPlaylistMutation();
  const [
    uploadVideo,
    { isLoading: isUL, isSuccess: isUS, isError: isUE, error: aUE },
  ] = useUploadVideoMutation();
  const { data: callbackUrl } = useAddYTCredQuery();
  const { playlistid } = useGetCoursesByYouQuery(undefined, {
    selectFromResult: ({ data }) => ({
      playlistid: data?.entities[id].playlist,
    }),
  });
  const [addAss, { isLoading: isAddAL, isError: isAddAE, error: addAE }] =
    useAddAssignmentMutation();
  const {
    data: tL,
    isSuccess: isTS,
    isLoading: isTL,
    isError: isTE,
    error: tE,
  } = useGetLecturesByCourseQuery(id);
  const {
    data: sL,
    isSuccess: isSS,
    isLoading: isSL,
    isError: isSE,
    error: sE,
  } = useGetLectureByCourseStudentQuery(id);
  const {
    data: sLT,
    isSuccess: isSLT,
    isError: isSLTE,
    error: sLTE,
    isLoading: isSLLL,
  } = useGetStudentsByCourseQuery(id);
  const {
    data: Ass,
    isSuccess: isAssS,
    isError: isAssE,
    error: assE,
    isLoading: isAssL,
  } = useGetAssignmentsByCourseQuery(id);
  const {
    data: AssT,
    isSuccess: isAssTS,
    isError: isAssTE,
    error: assTE,
    isLoading: isAssTL,
  } = useGetAssignmentByCourseTeacherQuery(id);
  const [
    delAss,
    { isSuccess: isDAS, isLoading: isDL, isError: isDE, error: dE },
  ] = useDeleteAssignmentMutation();
  if (!useremail || !userrole)
    return (
      <div className="public errmsg">Unauthorized, Please Login Again</div>
    );
  const handleAddLect = async (e) => {
    e.preventDefault();
    try {
      await addLect({ videoId: url, description, topic, course_id: id });
    } catch (err) {
      console.log(err);
    }
    setUrl("");
    setDescription("");
    setTopic("");
  };
  const addToPlay = async (e) => {
    e.preventDefault();
    try {
      await addPlay({ videoId: url, playlistId: playlistid });
    } catch (err) {
      console.log(err);
    }
    setUrl("");
  };
  const handleUpload = async (e) => {
    e.preventDefault();
    try {
      const result = await uploadVideo();
      const metadata = {
        snippet: {
          categoryId: "22",
          description: description,
          title: topic,
        },
        status: {
          privacyStatus: "public",
        },
      };

      const formData = new FormData();
      formData.append("metadata", new Blob([JSON.stringify(metadata)]), {
        type: "application/json",
      });
      formData.append("file", file, {
        filename: topic,
        contentType: "video/mp4",
      });

      const response = await axios.post(
        process.env.REACT_APP_UPLOADURI,
        formData,
        {
          headers: {
            Authorization: `Bearer ${result.data?.auth}`,
          },
        }
      );
      // console.log(response);
      await addPlay({ videoId: response.data.id, playlistId: playlistid });
      await addLect({
        videoId: response.data.id,
        description,
        topic,
        course_id: id,
      });
    } catch (err) {
      console.log(err);
    }
  };
  const handleTopic = (e) => setTopic(e.target.value);
  const handleDesc = (e) => setDescription(e.target.value);
  const handleUrl = (e) => setUrl(e.target.value);
  const handleFile = (e) => setFile(e.target.files[0]);
  const handleDelete = async (data) => {
    try {
      await delAss(data);
    } catch (err) {
      console.log(err);
    }
  };

  const handleAssignmentUpload = async (e) => {
    e.preventDefault();
    const formData = new FormData();
    // console.log(atopic, aSDate);
    formData.append("topic", atopic);
    formData.append("created_date", new Date());
    formData.append("submission_date", aSDate);
    formData.append("course_id", id);
    formData.append("myFile", assFile);
    // console.log("formData ", formData);

    const uploader = await addAss(formData);
    setATopic("");
    setASDate("");
    setAssFile(null);
  };
  const handleAssTopic = (e) => setATopic(e.target.value);
  const handleAssSDate = (e) => setASDate(e.target.value);
  const handleAssFile = (e) => setAssFile(e.target.files[0]);

  // process.env.REACT_APP_P="jdjfejk"
  // console.log(process.env.REACT_APP_P)
  return (
    <section className="public">
      {userrole === process.env.REACT_APP_TEACHER && (
        <>
          <div>Add Assignment</div>
          {isAddAE && (
            <div className="errmsg">{addAE?.data?.message || "Error"}</div>
          )}
          <form onSubmit={handleAssignmentUpload} className="form">
            <label htmlFor="topic" className="form__title-row">
              Topic:
              <input
                type="text"
                className="form__input"
                id="topic"
                value={atopic}
                onChange={handleAssTopic}
                required
              />
            </label>
            <input type="file" name="myFile" onChange={handleAssFile} />
            <label htmlFor="topic" className="form__title-row">
              Submission Date:
              <input
                type="date"
                className="form__input"
                id="topic"
                value={aSDate}
                onChange={handleAssSDate}
                required
              />
            </label>
            <button className="form__submit-button">
              {isAddAL ? <PulseLoader /> : "Final Upload"}
            </button>
          </form>
          <div>Add Lecture {"(Already Uploaded to YouTube)"}</div>
          {isAE && <div className="errmsg">{aE?.data?.message || "Error"}</div>}
          <form onSubmit={handleAddLect} className="form">
            <label htmlFor="topic" className="form__title-row">
              Topic:
              <input
                type="text"
                className="form__input"
                id="topic"
                value={topic}
                onChange={handleTopic}
                required
              />
            </label>
            <label htmlFor="desc" className="form__title-row">
              Description:
              <input
                type="text"
                className="form__input"
                id="desc"
                value={description}
                onChange={handleDesc}
                required
              />
            </label>
            <label htmlFor="url" className="form__title-row">
              Video ID:
              <input
                type="text"
                className="form__input"
                id="url"
                value={url}
                onChange={handleUrl}
                required
              />
            </label>
            <button className="form__submit-button">
              {isAL ? <PulseLoader /> : "Final Upload"}
            </button>
          </form>
          <div>
            Before Uploading or adding to PlayList, please Connect To Youtube
          </div>
          <button className="form__submit-button">
            <Link
              to={callbackUrl?.url}
              target="_blank"
              style={{ color: "black" }}
            >
              Connect To Youtube
            </Link>
          </button>
          <div>Add To Playlist</div>
          <form className="form" onSubmit={addToPlay}>
            {isAPE && (
              <div className="errmsg">{aPE?.data?.message || "Error"}</div>
            )}
            <label htmlFor="url" className="form__title-row">
              Video ID:
              <input
                type="text"
                className="form__input"
                id="url"
                value={url}
                onChange={handleUrl}
                required
              />
            </label>
            <button className="form__submit-button">
              {isAPL ? <PulseLoader /> : "Add To Playlist"}
            </button>
          </form>
          <div>Add Lecture {"(Not Uploaded To YouTube)"}</div>
          {isUE && (
            <div className="errmsg">{aUE?.data?.message || "Error"}</div>
          )}
          <form onSubmit={handleUpload} className="form">
            <label htmlFor="topic" className="form__title-row">
              Topic:
              <input
                type="text"
                className="form__input"
                id="topic"
                value={topic}
                onChange={handleTopic}
                required
              />
            </label>
            <label htmlFor="desc" className="form__title-row">
              Description:
              <input
                type="text"
                className="form__input"
                id="desc"
                value={description}
                onChange={handleDesc}
                required
              />
            </label>
            <label htmlFor="file">
              File
              <input type="file" name="file" id="file" onChange={handleFile} />
            </label>
            <button className="form__submit-button">
              {isUL ? <PulseLoader /> : "Final Upload"}
            </button>
          </form>
          <div>Your Uploaded Lectures</div>
          <table className="table">
            <thead className="table__thead">
              <tr>
                <th scope="col" className="table__th">
                  Topic
                </th>
                <th scope="col" className="table__th">
                  Description
                </th>
              </tr>
            </thead>
            <tbody>
              {isTS &&
                tL.ids.map((id) => (
                  <tr className="table__row" key={id}>
                    <td className="table__cell">
                      {" "}
                      <Link to={`./${id}`} style={{ color: "black" }}>
                        {tL.entities[id].topic}
                      </Link>
                    </td>
                    <td className="table__cell">
                      <Link to={`./${id}`} style={{ color: "black" }}>
                        {tL.entities[id].description}
                      </Link>
                    </td>
                  </tr>
                ))}
            </tbody>
          </table>
          <div>Assignments</div>
          <table className="table1">
            <thead className="table__thead">
              <tr>
                <th scope="col" className="table__th">
                  Topic
                </th>
                <th scope="col" className="table__th">
                  Due Date
                </th>
                <th scope="col" className="table__th">
                  Delete
                </th>
              </tr>
            </thead>
            <tbody>
              {isAssTS &&
                AssT.ids.map((id) => (
                  <tr className="table__row" key={id}>
                    <td className="table__cell">
                      {" "}
                      <Link
                        to={AssT.entities[id].url}
                        target="blank"
                        style={{ color: "black" }}
                      >
                        {AssT.entities[id].topic}
                      </Link>
                    </td>
                    <td className="table__cell">
                      <Link
                        to={AssT.entities[id].url}
                        target="blank"
                        style={{ color: "black" }}
                      >
                        {new Date(
                          AssT.entities[id].submission_date
                        ).toLocaleString(undefined, {
                          timeZone: "Asia/Kolkata",
                        })}
                      </Link>
                    </td>
                    <td className="table__cell">
                      {!isDL && !isDE && (
                        <button
                          className="icon-button1"
                          title="Delete"
                          onClick={handleDelete}
                        >
                          <FontAwesomeIcon icon={faTrashAlt} />
                        </button>
                      )}
                      {isDE && <PulseLoader color="#000" />}
                      {isDE && (
                        <div className="errmsg">
                          {dE?.data?.message || "Error"}
                        </div>
                      )}
                    </td>
                  </tr>
                ))}
              {isAssTE && <div>{assTE?.data?.message || "Error"}</div>}
            </tbody>
          </table>
          <div>Students Enrolled</div>
          <table className="table1">
            <thead className="table__thead">
              <tr>
                <th scope="col" className="table__th">
                  Roll
                </th>
                <th scope="col" className="table__th">
                  Name
                </th>
                <th scope="col" className="table__th">
                  Class
                </th>
              </tr>
            </thead>
            <tbody>
              {isSLT &&
                sLT.ids.map((id) => (
                  <tr className="table__row" key={id}>
                    <td className="table__cell">{sLT.entities[id].roll}</td>
                    <td className="table__cell">{sLT.entities[id].name}</td>
                    <td className="table__cell">
                      {sLT.entities[id]?.class || "Minor"}
                    </td>
                  </tr>
                ))}
            </tbody>
          </table>
        </>
      )}
      {userrole === process.env.REACT_APP_USER && (
        <>
          <div>Lectures</div>
          <table className="table">
            <thead className="table__thead">
              <tr>
                <th scope="col" className="table__th">
                  Topic
                </th>
                <th scope="col" className="table__th">
                  Description
                </th>
              </tr>
            </thead>
            <tbody>
              {isSS &&
                sL.ids.map((id) => (
                  <tr className="table__row" key={id}>
                    <td className="table__cell">
                      {" "}
                      <Link to={`./${id}`} style={{ color: "black" }}>
                        {sL.entities[id].topic}
                      </Link>
                    </td>
                    <td className="table__cell">
                      <Link to={`./${id}`} style={{ color: "black" }}>
                        {sL.entities[id].description}
                      </Link>
                    </td>
                  </tr>
                ))}
              {isSE && <div>{sE?.data?.message || "Error"}</div>}
            </tbody>
          </table>
          <div>Assignments</div>
          <table className="table1">
            <thead className="table__thead">
              <tr>
                <th scope="col" className="table__th">
                  Topic
                </th>
                <th scope="col" className="table__th">
                  Due Date
                </th>
                <th scope="col" className="table__th">
                  Created Date
                </th>
              </tr>
            </thead>
            <tbody>
              {isAssS &&
                Ass.ids.map((id) => (
                  <tr className="table__row" key={id}>
                    <td className="table__cell">
                      {" "}
                      <Link
                        to={Ass.entities[id].url}
                        target="blank"
                        style={{ color: "black" }}
                      >
                        {Ass.entities[id].topic}
                      </Link>
                    </td>
                    <td className="table__cell">
                      <Link
                        to={Ass.entities[id].url}
                        target="blank"
                        style={{ color: "black" }}
                      >
                        {new Date(
                          Ass.entities[id].submission_date
                        ).toLocaleString(undefined, {
                          timeZone: "Asia/Kolkata",
                        })}
                      </Link>
                    </td>
                    <td className="table__cell">
                      <Link
                        to={Ass.entities[id].url}
                        target="blank"
                        style={{ color: "black" }}
                      >
                        {new Date(Ass.entities[id].created_date).toLocaleString(
                          undefined,
                          {
                            timeZone: "Asia/Kolkata",
                          }
                        )}
                      </Link>
                    </td>
                  </tr>
                ))}
              {isAssE && <div>{assE?.data?.message || "Error"}</div>}
            </tbody>
          </table>
        </>
      )}
    </section>
  );
};

export default memo(CourseDetail);
