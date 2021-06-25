import React from "react";
import "./Faq.css";
import Fab from "@material-ui/core/Fab";
import { makeStyles } from "@material-ui/core/styles";
import ArrowBackIosIcon from "@material-ui/icons/ArrowBackIos";
import { useHistory } from "react-router-dom";

const useStyles = makeStyles((theme) => ({
  margin: {
    margin: theme.spacing(1),
  },
}));

const Faq = () => {
  const classes = useStyles();
  let history = useHistory();

  return (
    <div className="Faq">
      <div style={{ float: "left" }}>
        <Fab
          variant="extended"
          color="red"
          aria-label="add"
          className={classes.margin}
          fullWidth
          onClick={() => {
            history.push({
              pathname: "/",
            });
          }}
        >
          <ArrowBackIosIcon />
          Go back
        </Fab>
      </div>
      <div className="containerFaq">
        <h1>BLACK BOX ML: FAQ</h1>
        <p>Q: How can I see the system in action?</p>
        <p>
          A: The demo link above allows you to upload didactic examples of the
          kinds of models our system can provide. It will also allow you to go
          through the entire flow of the platform including emails to demo
          prediction links and downloadable prediction csvs.
        </p>
        <p>
          Q: What kinds of problems do you support? Can I do image
          classification? Time-series analysis? Regression?
        </p>
        <p>
          A: For now, we only support tabular data formatted in the way
          described above. Additionally, your target column must be a discrete
          feature, meaning we only support classification tasks at the moment.
          We are working to add other problem types.{" "}
        </p>
        <p>
          Q: I am interested in a custom model, but I don&apos;t have the data
          cleaned or formatted, want some additional interpretability, or need a
          more powerful model than one that can be trained in the maximum time
          limit. What can I do?
        </p>
        <p>
          A: We hear you and are happy to provide a manual solution that
          resolves all of these issues. Please email us at
          help@blackboxml.cs.ubc.ca to set up a meeting with one of our data
          scientists for an initial consultation.{" "}
        </p>

        <br />
        <hr />
      </div>
    </div>
  );
};

export default Faq;
