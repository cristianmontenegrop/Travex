$(document).ready(() => {
  // Getting references to our form and inputs
  const loginForm = $("form.login");
  const registerForm = $("form.signupButton");
  const usernameInput = $("input#username-input");
  const passwordInput = $("input#password-input");

  registerForm.on("submit", event => {
    event.preventDefault();
    render("signup");
  });
  // When the form is submitted, we validate there's an username and password entered
  loginForm.on("submit", event => {
    event.preventDefault();
    const userData = {
      username: usernameInput.val().trim(),
      password: passwordInput.val().trim()
    };
    console.log(userData.username);
    if (!userData.username || !userData.password) {
      return;
    }

    // If we have an username and password we run the loginUser function and clear the form
    loginUser(userData.username, userData.password);
    usernameInput.val("");
    passwordInput.val("");
  });

  // loginUser does a post to our "api/login" route and if successful, redirects us the the members page
  function loginUser(username, password) {
    $.post("/api/login", {
      username: username,
      password: password
    })
      .then(() => {
        window.location.replace("/userDashboard");
        // If there's an error, log the error
      })
      .catch(err => {
        console.log(err);
      });
  }
});
