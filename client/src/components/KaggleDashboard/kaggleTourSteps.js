import React from "react";

const kaggleTourSteps = [
  {
    content: <h2>Let us begin ourTour</h2>,
    locale: { skip: <strong aria-label="Exit">EXIT</strong> },
    placement: "center",
    target: "body",
  },
  {
    content: "Step 1",
    placement: "left",
    styles: {
      options: {
        width: "30vw",
      },
    },
    target: ".ktour__1",
    title: "1",
  },
  {
    content: "step 2",
    placement: "left",
    styles: {
      options: {
        width: "30vw",
      },
    },
    target: ".ktour__2",
    title: "2",
  },
];

export { kaggleTourSteps as default };
