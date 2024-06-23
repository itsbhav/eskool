import React from "react";
import {
  useAddNewNoticeMutation,
  useGetAllNoticesQuery,
} from "../features/notices/noticeApi";
import useShuffle from "../hooks/useShuffle";
import NoticeLine from "../features/notices/NoticeLine";
import { PulseLoader } from "react-spinners";
import useAuth from "../hooks/useAuth";
import { useState } from "react";
import { memo } from "react";
import useTitle from "../hooks/useTitle";

const NoticeManagement = () => {
  useTitle("Notice Dash");
  const { useremail, userrole } = useAuth();
  const [notePage, setNotePage] = useShuffle("notePage");
  const {
    data: notices,
    isSuccess: isNoticeSuccess,
    isError: isNoticeError,
    isLoading: isNoticeLoading,
    error: noticeError,
  } = useGetAllNoticesQuery(notePage, {});
  const [addNotice, { isSuccess, isError, isLoading, error }] =
    useAddNewNoticeMutation();
  const [subject, setSubject] = useState("");
  const [file, setFile] = useState(null);

  let noteContent = null;
  let content = null;
  if (!useremail || userrole !== process.env.REACT_APP_ADMIN)
    return (
      <div className="public errmsg">Unauthorized: Please Login Again</div>
    );
  if (isNoticeSuccess) {
    const { ids } = notices;
    if (ids.length === 0)
      noteContent = <tr className="table__row">No Notices Available</tr>;
    else
      noteContent = ids.map((id) => (
        <NoticeLine key={id} id={id} pageNum={notePage} />
      ));
  }
  const handleNoteInc = () => {
    setNotePage(notePage + 1);
  };
  const handleNoteDec = () => {
    if (notePage > 1) setNotePage(notePage - 1);
  };
  const handleFileUpload = async (e) => {
    e.preventDefault();
    const formData = new FormData();
    // console.log(file);
    formData.append("myFile", file);
    formData.append("subject", subject);
    formData.append("timestamp", new Date());
    // console.log("formData ", formData);
    const uploader = await addNotice(formData);
    setFile(null);
    setSubject("");
  };
  const handleSubject = (e) => setSubject(e.target.value);
  const handleFile = (e) => setFile(e.target.files[0]);
  content = (
    <section className="public">
      <h3>Notices</h3>
      {isNoticeSuccess && (
        <>
          <table className="table1">
            <thead className="table__thead">
              <tr>
                <th scope="col" className="table__th">
                  Timestamp
                </th>
                <th scope="col" className="table__th">
                  Description
                </th>
                <th scope="col" className="table__th">
                  Delete
                </th>
              </tr>
            </thead>
            <tbody>{noteContent}</tbody>
          </table>
          <div>
            <button className="button" onClick={handleNoteDec}>
              {"<"}
            </button>
            <button className="button" onClick={handleNoteInc}>
              {">"}
            </button>
          </div>
        </>
      )}
      {isNoticeLoading && <PulseLoader color="#000" />}
      {isNoticeError && (
        <div className="errmsg">{noticeError?.data?.message || "Error"}</div>
      )}
      <h3>Add Notices</h3>
      <div>
        {isError && <p className="errmsg">{error?.data?.message}</p>}
        <form onSubmit={handleFileUpload}>
          <input type="file" name="myFile" onChange={handleFile} />
          <input
            type="text"
            name="subject"
            value={subject}
            onChange={handleSubject}
          />
          <button type="submit">
            {isLoading && <PulseLoader color="black" />}
            {!isLoading && "Submit"}
          </button>
        </form>
      </div>
    </section>
  );
  return content;
};

export default memo(NoticeManagement);
