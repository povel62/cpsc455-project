import React from "react";
import "./Instructions.css";

const Instructions = () => {
  return (
    <div className="Instructions">
      <div className="containerInstructions">
        <hr />
        <h1>AUTO ML: INSTRUCTIONS</h1>
        <p>
          Step 1. All you need to get started is a CSV file formatted as
          following: each column denotes a feature of your dataset and each row
          represents a sample of you data. For example, your dataset might be a
          collection of individual dogs. The columns would be each dog&apos;s
          descriptive features, such as age, height, weight, length, eye color,
          coat, and breed. With such a dataset, our system is able to find a
          model that most accurately predicts one of the features given all of
          the other ones. In this case, it makes sense to classify the
          dog&apos;s breed given its age, weight, height, length, eye color, and
          coat. Ensure that your CSV includes headers, that any string entry not
          contain any commas, and that there are no missing values.
        </p>
        <p>
          Step 2. Once your CSV is properly formatted, upload it to our system
          using the Add Job button.
        </p>
        <p>
          Step 3. Choose a target column on the dataset viewer page. This is the
          feature that our model will learn to predict given all the other
          features.
        </p>
        <p>
          Step 4. Once you hit submit, it is time to wait! Your will receive an
          email once the job is completed with a link to the prediction page for
          your custom model. In rare cases, the system fails to find a model, in
          which case you will also be notified via email, but without a
          prediction link.
        </p>
        <p>
          Step 5. Once you have your prediction link (also accessible on the
          &quot;Dashboard&quot; page), you must prepare a &quot;prediction
          csv&quot;. This CSV is to be formatted exactly like before, with the
          exception of the target column.
        </p>
        <p>
          Step 6. With your prediction CSV ready, upload it to the system using
          the predicitonbutton on the Dashboard in the job row. You should
          receive an email very quickly with the prediction CSV you uploaded but
          with the missing target column filled out by our system! You can also
          download the prediction resu;t from the dashboard using the download
          Button.
        </p>
        <br />
        <hr />
      </div>
    </div>
  );
};

export default Instructions;
