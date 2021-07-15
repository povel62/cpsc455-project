const sgMail = require("@sendgrid/mail");
sgMail.setApiKey(process.env.SENDGRID_API_KEY);
// sgMail.setApiKey(
//   "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"
// );

const templates = {
  shared: "d-00e2b1e109ae4ba2ba991abe6a08c978",
  training_completed: "d-5354636450eb42efaa40c473b4eba943",
  prediction_completed: "d-6f69b38eae6d4a6da159096a4a306f9d",
  welcome: "d-dfc22099629245d7b7ce36bff7b05c08",
};

const sendEmail = async (data) => {
  const msg = {
    to: data.to,
    from: "automl.donotreply@gmail.com",
    subject: "Sending with SendGrid is Fun",
    text: "and easy to do anywhere, even with Node.js",
    html: "<strong>and easy to do anywhere, even with Node.js</strong>",
  };

  sgMail
    .send(msg)
    .then((response) => {
      console.log(`${data.templateName} email successfuly sent to: ${data.to}`);
    })
    .catch((error) => {
      console.log(`${data.templateName} email cannot be sent to: ${data.to}`);
      console.log(error);
    });
};

const sendTemplateEmail = async (data) => {
  const msg = {
    to: data.to,
    from: "automl.donotreply@gmail.com",
    templateId: templates[data.templateName],
    dynamic_template_data: {
      user: data.user,
      job_name: data.job_name,
      size: data.size,
      name: data.name,
      Sender_Name: "AutoML",
      Sender_Address: "UBC",
      Sender_City: "Vancouver",
      Sender_State: "British Columbia",
      Sender_Zip: "V6T 1Z4",
    },
  };
  sgMail
    .send(msg)
    .then((response) => {
      console.log(`${data.templateName} email successfuly sent to: ${data.to}`);
    })
    .catch((error) => {
      console.log(`${data.templateName} email cannot be sent to: ${data.to}`);
      console.log(error);
    });
};

module.exports = {
  sendEmail,
  sendTemplateEmail,
};
