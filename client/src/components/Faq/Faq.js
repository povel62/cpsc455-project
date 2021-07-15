import React from "react";
import "./Faq.css";
import { makeStyles } from "@material-ui/core/styles";
import Accordion from "@material-ui/core/Accordion";
import AccordionSummary from "@material-ui/core/AccordionSummary";
import AccordionDetails from "@material-ui/core/AccordionDetails";
import Typography from "@material-ui/core/Typography";
import ExpandMoreIcon from "@material-ui/icons/ExpandMore";

const useStyles = makeStyles((theme) => ({
  root: {
    width: "100%",
  },
  heading: {
    fontSize: theme.typography.pxToRem(15),
    fontWeight: theme.typography.fontWeightRegular,
  },
}));

const Faq = () => {
  const classes = useStyles();
  return (
    <div className="Faq">
      <div className="containerFaq">
        <h1>Frequently Asked Questions</h1>
        <br />
        <br />

        <div className={classes.root}>
          <Accordion>
            <AccordionSummary
              expandIcon={<ExpandMoreIcon />}
              aria-controls="panel1a-content"
              id="panel1a-header"
            >
              <Typography className={classes.heading}>
                Q: How can I see the system in action?
              </Typography>
            </AccordionSummary>
            <AccordionDetails className="ans">
              <Typography>
                The demo link above allows you to upload didactic examples of
                the kinds of models our system can provide. It will also allow
                you to go through the entire flow of the platform including
                emails to demo prediction links and downloadable prediction
                csvs.
              </Typography>
            </AccordionDetails>
          </Accordion>

          <Accordion>
            <AccordionSummary
              expandIcon={<ExpandMoreIcon />}
              aria-controls="panel1a-content"
              id="panel1a-header"
            >
              <Typography className={classes.heading}>
                Q: What kinds of problems do you support? Can I do image
                classification? Time-series analysis? Regression?
              </Typography>
            </AccordionSummary>
            <AccordionDetails className="ans">
              <Typography>
                For now, we only support tabular data formatted in the way
                described above. Additionally, your target column must be a
                discrete feature, meaning we only support classification tasks
                at the moment. We are working to add other problem types.
              </Typography>
            </AccordionDetails>
          </Accordion>

          <Accordion>
            <AccordionSummary
              expandIcon={<ExpandMoreIcon />}
              aria-controls="panel1a-content"
              id="panel1a-header"
            >
              <Typography className={classes.heading}>
                Q: I am interested in a custom model, but I don&apos;t have the
                data cleaned or formatted, want some additional
                interpretability, or need a more powerful model than one that
                can be trained in the maximum time limit. What can I do?
              </Typography>
            </AccordionSummary>
            <AccordionDetails className="ans">
              <Typography>
                We hear you and are happy to provide a manual solution that
                resolves all of these issues. Please email us at
                help@blackboxml.cs.ubc.ca to set up a meeting with one of our
                data scientists for an initial consultation.
              </Typography>
            </AccordionDetails>
          </Accordion>
          <br />
          <hr />
        </div>
      </div>
    </div>
  );
};

export default Faq;
