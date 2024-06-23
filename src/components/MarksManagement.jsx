import React, { useState } from "react";
import {
  useAddMarksMutation,
  useDeleteMarksMutation,
  useModifyMarksMutation,
} from "../features/admin/adminApi";
import { useGetYourMarksQuery } from "../features/user/userApi";
import useAuth from "../hooks/useAuth";
import Papa from "papaparse";
import { PulseLoader } from "react-spinners";
import useTitle from "../hooks/useTitle";
import { memo } from "react";
const MarksManagement = () => {
  useTitle("Marks Dash");
  const [
    addMark,
    { isError: isAE, error: aE, isSuccess: isAS, isLoading: isAL },
  ] = useAddMarksMutation();
  const [
    modifyMark,
    { isError: isME, error: mE, isSuccess: isMS, isLoading: isML },
  ] = useModifyMarksMutation();
  const [
    delMark,
    { isError: isDE, error: dE, isSuccess: isDS, isLoading: isDL },
  ] = useDeleteMarksMutation();
  const {
    data: myMarks,
    isSuccess,
    isError,
    isLoading,
    error,
  } = useGetYourMarksQuery();
  const { userrole, useremail } = useAuth();
  const [addData, setAddData] = useState([]);
  let markContent = null;
  if (
    !useremail ||
    (userrole !== process.env.REACT_APP_ADMIN &&
      userrole !== process.env.REACT_APP_USER)
  )
    return (
      <div className="public errmsg">Unauthorized: Please Login Again</div>
    );
  if (isSuccess) {
    const { ids } = myMarks;
    if (ids.length === 0) {
      <tr className="table__row">No Marks Available</tr>;
    } else {
      markContent = ids.map((id) => (
        <tr className="table__row" key={id}>
          <td className="table__cell">{myMarks.entities[id].name}</td>
          <td className="table__cell">{myMarks.entities[id].marks_obtained}</td>
          <td className="table__cell">{myMarks.entities[id].marks_total}</td>
          <td className="table__cell">
            {myMarks.entities[id].pass ? "PASS✅" : "FAIL❌"}
          </td>
          <td className="table__cell">
            {myMarks.entities[id].minor ? "✅" : "❌"}
          </td>
          <td className="table__cell">{myMarks.entities[id].sem_no}</td>
          <td className="table__cell">{myMarks.entities[id].credit}</td>
        </tr>
      ));
    }
  } else if (isLoading) {
    markContent = <PulseLoader color="black" />;
  } else if (isError) {
    markContent = (
      <div className="public errmsg">{error?.data?.message || "Error"}</div>
    );
  }
  const handleFileUpload = async (e) => {
    e.preventDefault();
    try {
      await addMark({ data: addData });
    } catch (err) {
      console.log(err);
    }
  };
  const handleMFileUpload = async (e) => {
    e.preventDefault();
    try {
      await modifyMark({ data: addData });
    } catch (err) {
      console.log(err);
    }
  };
  const handleDFileUpload = async (e) => {
    e.preventDefault();
    try {
      await delMark({ data: addData });
    } catch (err) {
      console.log(err);
    }
  };
  const handleAddFile = (event) => {
    Papa.parse(event.target.files[0], {
      complete: function (results) {
        var data1 = results.data;
        var x = [];
        for (var i = 1; i < data1.length; i++) {
          var dict = {};
          for (var j = 0; j < data1[0].length; j++) {
            if (data1[i][j].toLowerCase() === "true") {
              dict[data1[0][j]] = true;
            } else if (data1[i][j].toLowerCase() === "false") {
              dict[data1[0][j]] = false;
            } else {
              dict[data1[0][j]] = data1[i][j];
            }
          }
          x.push(dict);
        }
        // console.log(x);
        setAddData(x);
      },
    });
  };
  return (
    <section className="public">
      {userrole === process.env.REACT_APP_ADMIN && (
        <>
          <div>Add Marks</div>
          <div>
            {isAE && <p className="errmsg">{aE?.data?.message}</p>}
            <form onSubmit={handleFileUpload}>
              <input
                type="file"
                name="myFile"
                accept=".csv"
                onChange={handleAddFile}
              />
              <button type="submit">
                {isAL && <PulseLoader color="black" />}
                {!isAL && "Submit"}
              </button>
            </form>
          </div>
          <div>Modify Marks</div>
          <div>
            {isME && <p className="errmsg">{mE?.data?.message}</p>}
            <form onSubmit={handleMFileUpload}>
              <input
                type="file"
                name="myFile"
                accept=".csv"
                onChange={handleAddFile}
              />
              <button type="submit">
                {isML && <PulseLoader color="black" />}
                {!isML && "Submit"}
              </button>
            </form>
          </div>
          <div>Delete Marks</div>
          <div>
            {isDE && <p className="errmsg">{dE?.data?.message}</p>}
            <form onSubmit={handleDFileUpload}>
              <input
                type="file"
                name="myFile"
                accept=".csv"
                onChange={handleAddFile}
              />
              <button type="submit">
                {isDL && <PulseLoader color="black" />}
                {!isDL && "Submit"}
              </button>
            </form>
          </div>
        </>
      )}
      {userrole === process.env.REACT_APP_USER && (
        <>
          <table className="table2">
            <thead className="table__thead">
              <tr>
                <th scope="col" className="table__th">
                  Course Name
                </th>
                <th scope="col" className="table__th">
                  Marks Obtained
                </th>
                <th scope="col" className="table__th">
                  Marks Total
                </th>
                <th scope="col" className="table__th">
                  Status
                </th>
                <th scope="col" className="table__th">
                  Minor
                </th>
                <th scope="col" className="table__th">
                  Sem No.
                </th>
                <th scope="col" className="table__th">
                  Credit
                </th>
              </tr>
            </thead>
            <tbody>{markContent}</tbody>
          </table>
        </>
      )}
    </section>
  );
};

export default memo(MarksManagement);
