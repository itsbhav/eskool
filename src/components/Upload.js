import React, { useState } from "react";
import {
  useGetUploadUrlMutation,
  useVideoDataMutation,
} from "../features/notices/noticeApi";
import { PulseLoader } from "react-spinners";
import axios from 'axios';

const Upload = () => {
  const [file, setFile] = useState(null);
  const [title, setTitle] = useState("");
  const [description, setDescription] = useState("");
  const [tags, setTags] = useState("");
  const [upload, { error, isError, isSuccess, isLoading }] =
    useGetUploadUrlMutation();
  const [
    dataUpload,
    {
      error: videoError,
      isError: isVideoError,
      isSuccess: isVideoSuccess,
      isLoading: isVideoLoading,
    },
  ] = useVideoDataMutation();

  const handleAuth = async (e) => {
    const response = await fetch("http://localhost:3500/oauth", {
      method: "GET",
    });
    const data = await response.json();
    window.open(data.url);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      console.log(file)
    const metadata = {
      snippet: {
        categoryId: "22",
        description: "Description of uploaded video.",
        title: "Test video upload."
      },
      status: {
        privacyStatus: "public"
      }
      };

      const formData = new FormData();
    formData.append('metadata', new Blob([JSON.stringify(metadata)]), {
      type: 'application/json'
    });
    formData.append('file', file, {
      filename: file.name,
      contentType: 'video/mp4',
    });
      
      const response = await axios.post('https://www.googleapis.com/upload/youtube/v3/videos?uploadType=multipart&part=snippet%2Cstatus', formData, {
        headers: {
          'Authorization': `Bearer ya29.a0Ad52N3_iYDSSRgbRpbCk7NUIUB4olv4xIIr_bOv_YwcmaUAfZwuAxZ3l1fc0WVCBEuEEvqVCtFqpZiekc5rVmj5UnRaC8j3FOW5IEkY-jcbmdFSYWiqsy2F5k4gqIhc1H_jO16cNHdF22hwnEwXcMFwALcg8Zio8IN8uaCgYKAfcSARISFQHGX2Mi3ZBOnkHATzBHO8PvpmFFSQ0171`,
        },
      });

      console.log(response.data);
    // const config = {
    //   method: "post",
    //   url: "https://www.googleapis.com/upload/youtube/v3/videos?uploadType=multipart&part=snippet%2Cstatus",
    //   headers: {
    //     Authorization: `Bearer ya29.a0Ad52N3_iYDSSRgbRpbCk7NUIUB4olv4xIIr_bOv_YwcmaUAfZwuAxZ3l1fc0WVCBEuEEvqVCtFqpZiekc5rVmj5UnRaC8j3FOW5IEkY-jcbmdFSYWiqsy2F5k4gqIhc1H_jO16cNHdF22hwnEwXcMFwALcg8Zio8IN8uaCgYKAfcSARISFQHGX2Mi3ZBOnkHATzBHO8PvpmFFSQ0171`,
    //     "Content-Type": "application/json; charset=UTF-8",
    //   },
    //   data: data,
    // };
    // const response = await axios(config)
    // console.log(response)
    // console.log(JSON.stringify(response.headers.location));

      // const data = await upload({description , title, tags});
      // if (isError) return;
      // console.log(data);
      // console.log(file)
      // const formData = new FormData();
      // formData.append("file", file);
      // console.log(formData);
      //  const response1= await axios.put(
      //     "https://www.googleapis.com/upload/youtube/v3/videos?uploadType=resumable&part=snippet%2Cstatus&upload_id=ABPtcPpQppFe32p5lNGZeH1bTsF6buydwckpV-dzYT-3M9xgDBrysSk-VPeAF1sD61NbRK1-XvmuO7BKLkUlndlXjvl6jVghxzmOaWu_Lsgr4hRP",
      //     formData,
      // );
      // console.log(response1)
      //   setFile(null);

      //   alert("Video uploaded successfully!");
    } catch (err) {
      console.log(err)
    }
  };

  const handleDescription = (e) => setDescription(e.target.value);
  const handleTitle = (e) => setTitle(e.target.value);
  const handleTags = (e) => setTags(e.target.value);
  const handleFile = (e) => setFile(e.target.files[0]);

  return (
    <>
      {/* <iframe width="560" height="315" src="https://www.youtube.com/embed/Ty7du63T1LA?si=x7URd4eGWQqDxgug" title="YouTube video player" frameBorder="0" allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture; web-share; fullscreen" referrerPolicy="strict-origin-when-cross-origin" allowFullScreen></iframe>
      <iframe width="560" height="315" src="https://www.youtube.com/embed/T_wIeJLzdoI?si=x7URd4eGWQqDxgug" title="YouTube video player" frameBorder="0" allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture; web-share;fullscreen" referrerPolicy="strict-origin-when-cross-origin" allowFullScreen></iframe> */}
      <button onClick={handleAuth}>Auth for Upload</button>
      {isError && <p>{error?.message || error?.data?.message}</p>}
      {isVideoError && (
        <p>{videoError?.message || videoError?.data?.message}</p>
      )}
      <form onSubmit={handleSubmit}>
        <label htmlFor="description">Description</label>
        <textarea
          id="description"
          value={description}
          onChange={handleDescription}
        />
        <label htmlFor="title">Title</label>
        <input type="text" id="title" value={title} onChange={handleTitle} />
        {title}
        <label htmlFor="tags">Tags</label>
        <input type="text" id="tags" value={tags} onChange={handleTags} />
        <label htmlFor="file">File</label>
        <input type="file" name="file" id="file" onChange={handleFile} />
        <button type="submit">
          {(isLoading || isVideoLoading) && <PulseLoader color="black" />}
          {!isLoading && !isVideoLoading && "Upload Video"}
        </button>
      </form>
    </>
  );
};

export default Upload;
