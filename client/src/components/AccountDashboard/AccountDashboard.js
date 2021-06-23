import React, { useState } from "react";
import "./AccountDashboard.css";
import { useSelector } from "react-redux";

const AccountDashboard = () => {
  const login_token = useSelector((state) => state.loginReducer);

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

  const submitEditInfo = (e) => {
    e.preventDefault();
    setEditInfo(!editInfo);

    // const id = parseJWT(login_token);
    // const response = fetch("/api/user/login", {
    //   method: "PUT",
    //   headers: {
    //     "Content-Type": "application/json",
    //   },
    //   body: JSON.stringify({ email: values.username, password: values.pwd }),
    //   params: id,
    // });

    alert(login_token);
  };
  const closeEditInfo = () => {
    setEditInfo(!editInfo);
  };

  return (
    <div className="accountDashboard">
      {editInfo ? (
        <div>
          <button onClick={submitEditInfo}> Submit </button>
          <button onClick={closeEditInfo}> Close </button>
        </div>
      ) : (
        <button onClick={toggleEditInfo}> Edit </button>
      )}
      <div>
        <h1>Email: </h1>
        {editInfo ? (
          <input
            type="text"
            defaultValue={values.email}
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
            defaultValue={values.kusername}
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
            defaultValue={values.kapi}
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
