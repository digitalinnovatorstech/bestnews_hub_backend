const validatePassword = (password, firstName, lastName) => {
  if (password.length < 8) {
    return "Password must be at least 8 characters long.";
  }
  if (!/[A-Z]/.test(password)) {
    return "Password must contain at least one uppercase letter.";
  }
  if (!/\d/.test(password)) {
    return "Password must contain at least one number.";
  }
  if (!/[!@#$%^&*(),.?":{}|<>]/.test(password)) {
    return "Password must contain at least one special character.";
  }
  if (firstName && password.toLowerCase().includes(firstName.toLowerCase())) {
    return "Password should not contain your first name.";
  }
  if (lastName && password.toLowerCase().includes(lastName.toLowerCase())) {
    return "Password should not contain your last name.";
  }

  return null;
};

module.exports = { validatePassword };
