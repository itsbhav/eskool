import React, { useState } from "react";
import { useGetAllClassQuery } from "../features/classCourse/classCourseApi";
import { useAddClassMutation } from "../features/admin/adminApi";
import useAuth from "../hooks/useAuth";
import { PulseLoader } from "react-spinners";
import { memo } from "react";
import useTitle from "../hooks/useTitle";

const ClassManagement = () => {
  useTitle("Class Management");
  const {
    data: classes,
    isLoading: isClL,
    isError: isClErr,
    error: clErr,
    isSucces: isClSucc,
  } = useGetAllClassQuery();
  // console.log(classes,"hii",isClSucc)
  const [addClass, { isSuccess, isError, isLoading, error }] =
    useAddClassMutation();
  const [name, setName] = useState("");
  const { userrole, useremail } = useAuth();
  if (userrole !== process.env.REACT_APP_ADMIN || !useremail)
    return (
      <div className="public errmsg">Unauthorized: Please Login Again</div>
    );
  let classList = null;
  if (isClErr) {
    classList = <div className="errmsg">{clErr?.data?.message || "Error"}</div>;
  } else if (isClL) {
    classList = (
      <div>
        <PulseLoader style={{ color: "black" }} />
      </div>
    );
  } else {
    const { ids } = classes;
    // console.log(ids, "ids")
    classList = ids.map((id) => (
      <div className="padding">{classes.entities[id].name}</div>
    ));
  }
  const handleAddClass = (e) => {
    e.preventDefault();
    const addCl = addClass({ name });
    if (isSuccess) setName("");
  };
  const handleClassName = (e) => setName(e.target.value);

  return (
    <section className="public">
      <h3>Class List</h3>
      <div className="class-div">{classList}</div>
      <h3>Add Class</h3>
      <div>
        {isError && <p className="errmsg">{error?.data?.message || "Error"}</p>}
        <form onSubmit={handleAddClass}>
          <input
            type="text"
            name="name"
            value={name}
            onChange={handleClassName}
          />
          <button type="submit">
            {isLoading && <PulseLoader color="black" />}
            {!isLoading && "Submit"}
          </button>
        </form>
      </div>
    </section>
  );
};

export default memo(ClassManagement);
