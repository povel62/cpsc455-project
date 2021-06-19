import React, { useState } from "react";
import "./AccountDashboard.css";

const AccountDashboard = () => {
  const [values, setValues] = useState({
    response: "",
    post: "",
    responseToPost: "",
    email: "test@email",
    guest: false,
    pwd: "",
    kusername: "test K user",
    kapi: "test k api",
  });

  const [editInfo, setEditInfo] = useState(false);

  const toggleEditInfo = () => setEditInfo(!editInfo);

  const submitEditInfo = () => {
    setEditInfo(!editInfo);
    alert("should submit a put req");
  };

  return (
    <div className="accountDashboard">
      {editInfo ? (
        <button onClick={submitEditInfo}> Submit </button>
      ) : (
        <button onClick={toggleEditInfo}> Edit </button>
      )}
      <div>
        <h1>Email: </h1>
        {editInfo ? (
          <input
            type="text"
            placeholder={values.email}
            onChange={(e) => setValues({ ...values, email: e.target.value })}
          ></input>
        ) : (
          <p>{values.email}</p>
        )}
        <h1>Password: </h1>
        {editInfo ? (
          <input
            type="text"
            onChange={(e) => setValues({ ...values, pwd: e.target.value })}
          ></input>
        ) : (
          "*********"
        )}
        <h1>kaggle username: </h1>
        {editInfo ? (
          <input
            type="text"
            placeholder={values.kusername}
            onChange={(e) =>
              setValues({ ...values, kusername: e.target.value })
            }
          ></input>
        ) : (
          <p>{values.kusername}</p>
        )}
        <h1>kaggle Api: </h1>
        {editInfo ? (
          <input
            type="text"
            placeholder={values.kapi}
            onChange={(e) => setValues({ ...values, kapi: e.target.value })}
          ></input>
        ) : (
          <p>{values.kapi}</p>
        )}
      </div>
    </div>
  );
};

export default AccountDashboard;
