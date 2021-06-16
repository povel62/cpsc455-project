import React from "react";
import "./Instructions.css";

const Instructions = () => {
  return (
    <div className="Instructions">
      <div className="containerInstructions">
        <h1>BLACK BOX ML: INSTRUCTIONS</h1>
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
          using the input above these instructions. You will be redirected to a
          page that shows a successfully parsed dataset where you can inspect
          the contents one last time before submitting it to our AutoML system.
        </p>
        <p>
          Step 3. Choose a target column on the dataset viewer page. This is the
          feature that our model will learn to predict given all the other
          features. Once again, this would be the dog&apos;s breed in our
          example. Make sure to specify the correct column, as the viewer
          defaults to the first column.
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
          &quot;My Jobs&quot; page), you must prepare a &quot;prediction
          csv&quot;. This CSV is to be formatted exactly like before, with the
          exception of the target column. For example, if you wanted to predict
          the breed of 5 new dogs, you need to upload a CSV with 5 rows
          containing each new dog&apos;s age, weight, height, length, eye color,
          and coat. The platform will let you know if your prediction is
          misformatted.
        </p>
        <p>
          Step 6. With your prediction CSV ready, upload it to the system using
          the prediciton link given for your task. You should receive an email
          very quickly with the prediction CSV you uploaded but with the missing
          target column filled out by our system!
        </p>
        <br />
        <hr />
      </div>
    </div>
  );
};

export default Instructions;
