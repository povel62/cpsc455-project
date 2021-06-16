import React from "react";
import "./Signin.css";
/*import { useDispatch } from "react-redux";
import { has_login_token } from "../../redux/actions/actions";
import Button from "@material-ui/core/Button";*/

const Signin = () => {
  return (
    <div>
      <br />
      <br />
      <div className="container">
        <form>
          <input type="text" name="username" placeholder="Username" required />
          <input
            type="password"
            name="password"
            placeholder="Password"
            required
          />
          <input type="submit" value="Login" />
        </form>
      </div>

      <div className="bottom-container">
        <div className="row">
          <div className="col">
            <a style="color:white" className="btn">
              Sign up
            </a>
          </div>
          <div className="col">
            <a style="color:white" className="btn">
              Forgot password?
            </a>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Signin;
