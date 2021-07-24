import React, { useState } from "react";
import { makeStyles } from "@material-ui/core/styles";
import LinearProgress from "@material-ui/core/LinearProgress";

const useStyles = makeStyles({
  root: {
    width: "100%",
  },
});

export default function ProgressBar({ status }) {
  const classes = useStyles();
  const [progress, setProgress] = useState(0);
  const [progressColor, setProgressColor] = useState("primary");

  React.useEffect(() => {
    const timer = setInterval(() => {
      setProgress((oldProgress) => {
        if (status == "TRAINING" && oldProgress >= 40) {
          return 0;
        }
        if (status == "TRAINING_COMPLETED") {
          setProgressColor("secondary");
          return 50;
        }
        const diff = Math.random();
        return Math.min(oldProgress + diff, 100);
      });
    }, 3000);

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
