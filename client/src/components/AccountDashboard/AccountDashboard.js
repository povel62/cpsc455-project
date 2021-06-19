import React, { useState } from "react";

const AccountDashboard = () => {
  const [values, setValues] = useState({
    response: "",
    post: "",
    responseToPost: "",
    email: "",
    guest: false,
    pwd: "",
  });

  const [editInfo, setEditInfo] = useState(false);

  const toggleEditInfo = () => setEditInfo(!editInfo);

  return (
    <div class="container">
      <button onClick={toggleEditInfo}> {editInfo ? "Edit" : "Submit"} </button>
      <div>
        <h1>Email: </h1>
        {editInfo ? (
          <h1>admin@admin</h1>
        ) : (
          <input
            type="text"
            onChange={(e) => setValues({ ...values, email: e.target.value })}
          ></input>
        )}
      </div>
    </div>
  );
};

export default AccountDashboard;
