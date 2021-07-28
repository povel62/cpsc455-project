import React, { useState } from "react";
import { makeStyles } from "@material-ui/core/styles";
import LinearProgress from "@material-ui/core/LinearProgress";

const useStyles = makeStyles({
  root: {
    width: "100%",
  },
});

export default function ProgressBar({ status, progressColor, start }) {
  const classes = useStyles();
  const [progress, setProgress] = useState(start);

  React.useEffect(() => {
    const timer = setInterval(() => {
      setProgress((oldProgress) => {
        if (status == "TRAINING" && oldProgress >= 40) {
          return 0;
        }
        if (status == "PREDICTING" && oldProgress >= 80) {
          return 50;
        }
        if (status == "TRAINING_COMPLETED") {
          return 50;
        }
        if (status == "PREDICTING_COMPLETED") {
          return 100;
        }
        const diff = Math.random();
        return Math.min(oldProgress + diff, 100);
      });
    }, 2000);

    return () => {
      clearInterval(timer);
    };
  }, []);

  return (
    <div className={classes.root}>
      <LinearProgress
        variant="determinate"
        value={progress}
        color={progressColor}
      />
    </div>
  );
}
