import React from "react";
import { Link } from "react-router-dom";
import useTitle from "../hooks/useTitle";

const Instructions = () => {
  useTitle("Instructions");
  return (
    <>
      <>
        <h3 className="user-div">
          Steps to get registered as a Teacher for eSkool
        </h3>
        <ol className="steps">
          <li>Go To Login Page and Create a Teacher Account.</li>
          <li>
            You will recieve an email for verification on registered email id.
            Click the link in the email to get verified.
          </li>
          <li>Relax till you get verified by the eSkool Admin.</li>
          <li>
            You will be informed by the eSkool Admin regarding your verification
            status.
          </li>
          <li>
            Once verified, submit a proposal for the subject you want to teach,
            by email to us at{" "}
            <Link
              to={`mailto:${process.env.REACT_APP_OFFICIAL_MAIL}`}
              style={{ color: "black" }}
            >
              {process.env.REACT_APP_OFFICIAL_MAIL}
            </Link>
          </li>
          <li>
            Proposal should contain an introductory video in about 1080px
            quality of about 2 minutes.
          </li>
          <li>
            Once approved, you will recieve collaboratory invite details of our
            youtube channel, which you should accept.
          </li>
          <li>
            Once accepted, you will get the playlist Id to upload video. You can
            upload videos from our web app, as well from youtube app.
          </li>
          <li>
            In case, you upload videos from youtube app, you need to update the
            details in our site as well.
          </li>
        </ol>
      </>
      <>
        <h3 className="user-div">Steps to enroll our courses</h3>
        <ol className="steps" style={{ minWidth: "96vw" }}>
          <li>Go To Login Page and Create a Student Account.</li>
          <li>
            You will recieve an email for verification on registered email id.
            Click the link in the email to get verified.
          </li>
          <li>
            Now, you will be automatically enrolled to courses of your selected
            class.
          </li>
          <li>
            If you need any other course, you can enroll them as elective/minor
            course.
          </li>
        </ol>
      </>
      <>
        <h3 className="user-div">Steps to Add Marks{"(For Teachers)"}</h3>
        <ol className="steps" style={{ minWidth: "96vw" }}>
          <li>The marks will be added by admin.</li>
          <li>For Above or any other queries, write to us.</li>
        </ol>
      </>
    </>
  );
};

export default Instructions;
