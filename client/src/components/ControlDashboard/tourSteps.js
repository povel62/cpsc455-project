import React from "react";

const demoSteps = [
  {
    content: <h2>Let us begin our Tour</h2>,
    locale: { skip: <strong aria-label="Exit">EXIT</strong> },
    placement: "center",
    target: "body",
  },
  {
    content: "This table contains all jobs associated with your account",
    placement: "left",
    styles: {
      options: {
        width: "30vw",
      },
    },
    target: ".table",
    title: "Jobs Table",
  },
  {
    content:
      "You can submit a new job for Training from here. Non-Premium users can have upto 10 active jobs. Premium Users can have any number of jobs. Upgrade to Premium now!",
    placement: "left",
    styles: {
      options: {
        width: "30vw",
      },
    },
    target: ".demo__2",
    title: "Add a job",
  },
  {
    content: "Here you can find the details of this job",
    placement: "left",
    styles: {
      options: {
        width: "30vw",
      },
    },
    target: ".demo__3",
    title: "Job Details",
  },
  {
    content: "Use this button to view more details about this job",
    placement: "left",
    styles: {
      options: {
        width: "30vw",
      },
    },
    target: ".demo__4",
    title: "Extra Details",
  },
  {
    content:
      "This cell tells that this job is associated with Kaggle. Kaggle integration is only accessible to Premium users. Upgrade now!",
    placement: "left",
    styles: {
      options: {
        width: "30vw",
      },
    },
    target: ".demo__5",
    title: "Job Association",
  },
  {
    content: "Shows the status of the job",
    placement: "left",
    styles: {
      options: {
        width: "30vw",
      },
    },
    target: ".demo__6",
    title: "Job status",
  },
  {
    content:
      "Use this button to submit a test file for prediction and start predicting!",
    placement: "left",
    styles: {
      options: {
        width: "30vw",
      },
    },
    target: ".demo__7",
    title: "Predict Action",
  },
  {
    content:
      "Download prediction results. PREMIUM user has access to all of their prediction results!! Upgrade now!",
    placement: "left",
    styles: {
      options: {
        width: "30vw",
      },
    },
    target: ".demo__12",
    title: "Download Action",
  },
  {
    content:
      "PREMIUM FEATURE! You can share a job with your teammates from here! All you need is their id that is associated with an account with us",
    placement: "left",
    styles: {
      options: {
        width: "30vw",
      },
    },
    target: ".demo__8",
    title: "Share with Collaborators",
  },
  {
    content: "Use this button to delete a job ",
    placement: "left",
    styles: {
      options: {
        width: "30vw",
      },
    },
    target: ".demo__9",
    title: "Delete",
  },
  {
    content:
      "PREMIUM FEATURE! Use this button to view job output and error logs",
    placement: "right",
    styles: {
      options: {
        width: "30vw",
      },
    },
    target: ".demo__10",
    title: "Logs",
  },
  {
    content:
      "PREMIUM FEATURE! The progress bar is a visual indicator of current job status",

    placement: "left",
    styles: {
      options: {
        width: "30vw",
      },
    },
    target: ".demo__11",
    title: "Progress Bar",
  },
];

export { demoSteps as default };
