import React from "react";
import "./Introduction.css";

const Introduction = () => {
  return (
    <div className="Introduction">
      <div className="containerIntroduction">
        <br />
        <br />
        <hr />
        <h1>BLACK BOX ML: Introduction</h1>
        <p>
          BlackBox Machine Learning is an online platform that uses an ensemble
          of state-of-the-art AutoML systems to find the best model to describe
          your data. AutoML is a technique for intelligently trying and
          selecting models in order to perform predictions, regressions, and
          classifications. The models considered in this ensemble range from
          artificial neural networks to simple linear regression, and everything
          in between such as random forests, support vector machines, and
          principal component analysis. Once our system has found a best model,
          you can use it for lightning fast inference of any future samples of
          your dataset.
        </p>
        <br />
        <hr />
      </div>
    </div>
  );
};

export default Introduction;
