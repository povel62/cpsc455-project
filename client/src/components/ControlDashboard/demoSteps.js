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
    content: "You can submit a new job for Training from here",
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
    content: "For more details about the job click on this button",
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
    content: "This cell tells that this job is associated with Kaggle",
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
      "These are the actions available to the user based on the status of the job",
    placement: "left",
    styles: {
      options: {
        width: "30vw",
      },
    },
    target: ".demo__7",
    title: "Actions",
  },
  {
    content:
      "You can share this job with your teammates from here! All you need is their id that is associated with an account with us",
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
    content: "This button lets you delete this job ",
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
    content: " This button lets you view job error logs",
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
    content: "The progress bar is a visual indicator of current job status",
    /* <p>
          TRAINING: Progress bar is still progressing towards the middle with a
          blue color <br />
          TRAINING_COMPLETED: Progress bar is at 50% with a green color
          indicating that training has been completed <br />
          PREDICTING: Progress bar is progressing towards the end with a green
          color
          <br />
          PREDICTING_COMPLETED: Progress bar at 100%, colored green to indicate
          prediction has been completed
        </p> */
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
