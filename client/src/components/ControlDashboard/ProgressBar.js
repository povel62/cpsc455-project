import React from "react";
import { makeStyles } from "@material-ui/core/styles";
import LinearProgress from "@material-ui/core/LinearProgress";

const useStyles = makeStyles({
  root: {
    width: "100%",
  },
});

export default function ProgressBar({ status }) {
  const classes = useStyles();
  const [progress, setProgress] = React.useState(0);
  const [changeColor, setchangeColor] = React.useState(true);

  React.useEffect(() => {
    const timer = setInterval(() => {
      setProgress((oldProgress) => {
        if (oldProgress === 100) {
          return 0;
        }
        if (status === "TRAINING_COMPLETED") {
          setchangeColor(false);
          return 50;
        }
        const diff = Math.random() * 10;
        return Math.min(oldProgress + diff, 100);
      });
    }, 500);

    return () => {
      clearInterval(timer);
    };
  }, []);

  return (
    <div className={classes.root}>
      <LinearProgress
        variant="determinate"
        value={progress}
        color={changeColor ? "primary" : "secondary"}
      />
    </div>
  );
}
