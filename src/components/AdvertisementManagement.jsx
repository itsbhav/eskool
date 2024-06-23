import React from "react";
import {
  useAddNewAdvertisementMutation,
  useGetAllAdvertisementsQuery,
} from "../features/advertisements/advertisementApi";
import useShuffle from "../hooks/useShuffle";
import AddLine from "../features/advertisements/AddLine";
import { PulseLoader } from "react-spinners";
import useAuth from "../hooks/useAuth";
import { useState } from "react";
import { memo } from "react";
import useTitle from "../hooks/useTitle";

const AdvertisementManagement = () => {
  const { useremail, userrole } = useAuth();
  useTitle("Advertisement Management");
  const [addPage, setAddPage] = useShuffle("advertisePage");
  const {
    data: advertisements,
    isSuccess: isAddSuccess,
    isError: isAddError,
    isLoading: isAddLoading,
    error: addError,
  } = useGetAllAdvertisementsQuery(addPage, {});

  const [addAdv, { isSuccess, isError, isLoading, error }] =
    useAddNewAdvertisementMutation();
  const [subject, setSubject] = useState("");
  const [file, setFile] = useState(null);

  let addContent = null;
  let content = null;
  if (!useremail || userrole !== process.env.REACT_APP_ADMIN)
    return (
      <div className="public errmsg">Unauthorized: Please Login Again</div>
    );
  if (isAddSuccess) {
    const { ids } = advertisements;
    if (ids.length === 0)
      addContent = <tr className="table__row">No Advertisements Available</tr>;
    else
      addContent = ids.map((id) => (
        <AddLine key={id} id={id} pageNum={addPage} />
      ));
  }

  const handleAddInc = () => {
    setAddPage(addPage + 1);
  };
  const handleAddDec = () => {
    if (addPage > 1) setAddPage(addPage - 1);
  };
  const handleFileUpload = async (e) => {
    e.preventDefault();
    const formData = new FormData();
    // console.log(file);
    formData.append("myFile", file);
    formData.append("subject", subject);
    formData.append("timestamp", new Date());
    // console.log("formData ", formData);
    const uploader = await addAdv(formData);
    setFile(null);
    setSubject("");
  };

  const handleSubject = (e) => setSubject(e.target.value);
  const handleFile = (e) => setFile(e.target.files[0]);
  content = (
    <section className="public">
      <h3>Advertisements</h3>
      {isAddSuccess && (
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
            <tbody>{addContent}</tbody>
          </table>
          <div>
            <button className="button" onClick={handleAddDec}>
              {"<"}
            </button>
            <button className="button" onClick={handleAddInc}>
              {">"}
            </button>
          </div>
        </>
      )}
      {isAddLoading && <PulseLoader color="#000" />}
      {isAddError && (
        <div className="errmsg">{addError?.data?.message || "Error"}</div>
      )}
      <h3>Add Advertisements</h3>
      <div>
        {isError && <p className="errmsg">{error?.data?.message}</p>}
        <form onSubmit={handleFileUpload}>
          <input type="file" name="myFile" onChange={handleFile} />
          <input
            type="text"
            name="subject"
            value={subject}
            onChange={handleSubject}
            placeholder="Event..."
          />
          <button type="submit">
            {isLoading && <PulseLoader color="black" />}
            {!isLoading && "Submit"}
          </button>
        </form>
      </div>
    </section>
  );
  return <>{content}</>;
};

export default memo(AdvertisementManagement);
