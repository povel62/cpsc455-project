import React, { useState, useEffect } from "react";
import { connect } from "react-redux";
import { bindActionCreators } from "redux";
import * as actions from "../../redux/actions/actions";
import logo from "./../../logo.svg";
import PropTypes from "prop-types";

const Home = (props) => {
  const [values, setValues] = useState({
    response: "",
    post: "",
    responseToPost: "",
  });

  useEffect(() => {
    callApi()
      .then((res) => setValues({ ...values, response: res.express }))
      .catch((err) => console.log(err));
  }, []);

  const callApi = async () => {
    const response = await fetch("/api/hello");
    const body = await response.json();
    if (response.status !== 200) throw Error(body.message);

    return body;
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    const response = await fetch("/api/world", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({ post: values.post }),
    });
    const body = await response.text();

    setValues({ ...values, responseToPost: body });
  };

  return (
    <div className="App">
      <header className="App-header">
        <img src={logo} className="App-logo" alt="logo" />
        <p>
          Edit <code>src/App.js</code> and save to reload.
        </p>
        <a
          className="App-link"
          href="https://reactjs.org"
          target="_blank"
          rel="noopener noreferrer"
        >
          Learn React
        </a>
      </header>
      <p>{values.response}</p>
      <form onSubmit={handleSubmit}>
        <p>
          <strong>Post to Server:</strong>
        </p>
        <input
          type="text"
          value={values.post}
          onChange={(e) => {
            setValues({ ...values, post: e.target.value });
            props.actions.saveNumber(props.number + 1);
          }}
        />
        <button type="submit">Submit</button>
      </form>
      <p>{values.responseToPost}</p>
      <br />
      <p>REDUX &quot;NUMBER&quot; variable: {props.number}</p>
    </div>
  );
};

Home.propTypes = {
  actions: PropTypes.object.isRequired,
  number: PropTypes.number.isRequired,
};

function mapStateToProps(state) {
  return {
    number: state.reducer.number,
  };
}

function mapDispatchToProps(dispatch) {
  return {
    actions: bindActionCreators(actions, dispatch),
  };
}

export default connect(mapStateToProps, mapDispatchToProps)(Home);
