import React from "react";
import {PulseLoader} from 'react-spinners'
import { useAddNewAdvertisementMutation } from "../features/advertisements/advertisementApi";
import { useState } from "react";
const Advertisement = () => {
  const [addNewAdvertisement, { isError, error, isLoading, isSuccess }] =
    useAddNewAdvertisementMutation();

  const [subject, setSubject] = useState("");
  const [file, setFile] = useState(null);
  const handleFileUpload = async (e) => {
    // console.log("hii");
    e.preventDefault();
    // console.log(e);
    const formData = new FormData();
    formData.append("myFile", file);
    formData.append("subject", subject);
    formData.append("timestamp", new Date());
    console.log(formData)
    const uploader = await addNewAdvertisement(formData);
      setFile(null)
      setSubject("")
  };

  const handleSubject = (e) => setSubject(e.target.value);
  const handleFile=(e)=>setFile(e.target.files[0])
  return (
    <div>
      {isError && <p>{ error?.data?.message}</p>}
      <form onSubmit={handleFileUpload}>
        <input
          type="file"
          name="myFile"
          onChange={handleFile}
        />
        <input
          type="text"
          name="subject"
          value={subject}
          onChange={handleSubject}
        />
        <button type="submit">{isLoading && <PulseLoader color="black" />}{ !isLoading && 'Submit'}</button>
      </form>
    </div>
  );
};

export default Advertisement;
