import React from "react";

const K1 =
  "Here you can choose where to get training/testing data. The competitions and personal datasets are split into two different drawers for your convenience.";
const K2 =
  "You can search to filter your results, the search bar will work for both categories.";
const K3 =
  "You can also filter the content to help you narrow down your results if you wish.";
const K4 =
  "Here you can browse Kaggle competitions. You may have to agree to the competition terms and conditions. A popup will help you if you need to agree to terms.";
const K5 =
  "Here you can browse Kaggle dataset sources, please be mindful of dataset licenses.";
const K6 =
  "After you select a data source, dataset files will appear here for you to select, download, train a model, or make a prediction.";
const K7 =
  "Here is where you perform all your actions regarding, training, prediction, submission, upload, download, and viewing data source information. Options will dynamically appear based on your selections of a data source and a data file, please watch for updates to see what actions you can perform.";
const kaggleTourSteps = [
  {
    content: <h2>Let us begin our tour of the Kaggle dashboard!</h2>,
    locale: { skip: <strong aria-label="Exit">EXIT</strong> },
    placement: "center",
    target: "body",
  },
  {
    content: K1,
    placement: "right",
    styles: {
      options: {
        width: "30vw",
      },
    },
    target: ".ktour__1",
    title: "Data Sources",
  },
  {
    content: K2,
    placement: "right",
    styles: {
      options: {
        width: "30vw",
      },
    },
    target: ".ktour__2",
    title: "Search",
  },
  {
    content: K3,
    placement: "right",
    styles: {
      options: {
        width: "30vw",
      },
    },
    target: ".ktour__3",
    title: "Categories",
  },
  {
    content: K4,
    placement: "right",
    styles: {
      options: {
        width: "30vw",
      },
    },
    target: ".ktour__4",
    title: "Kaggle competitions",
  },
  {
    content: K5,
    placement: "right",
    styles: {
      options: {
        width: "30vw",
      },
    },
    target: ".ktour__5",
    title: "Kaggle datasets",
  },
  {
    content: K6,
    placement: "bottom",
    styles: {
      options: {
        width: "30vw",
      },
    },
    target: ".ktour__6",
    title: "Data files from Source",
  },
  {
    content: K7,
    placement: "left",
    styles: {
      options: {
        width: "30vw",
      },
    },
    target: ".ktour__7",
    title: "Actions",
  },
];

export { kaggleTourSteps as default };
