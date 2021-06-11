module.exports.validateGuest = function validateGuest(raw, user) {
  const keys = Object.keys(raw);
  const requiredForRegistered = ["fname", "lname", "password", "dob"];
  let bool = true;
  requiredForRegistered.forEach((attr) => {
    if (!keys.includes(attr)) {
      user.guest = true;
      bool = false;
    }
  });
  if (bool) {
    user.guest = false;
  }
};
