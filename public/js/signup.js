$(document).ready(() => {
  // Getting references to our form and input
  const signUpForm = $("form.signup");
  const usernameInput = $("input#username-input");
  const passwordInput = $("input#password-input");
  const firstInput = $("input#first-input");
  const lastInput = $("input#last-input");

  // When the signup button is clicked, we validate the email and password are not blank
  signUpForm.on("submit", event => {
    event.preventDefault();
    const userData = {
      username: usernameInput.val().trim(),
      password: passwordInput.val().trim(),
      first: firstInput.val().trim(),
      last: lastInput.val().trim()
    };

    if (
      !userData.username ||
      !userData.password ||
      !userData.first ||
      !userData.last
    ) {
      return;
    }
    // If we have an email and password, run the signUpUser function
    signUpUser(
      userData.username,
      userData.password,
      userData.first,
      userData.last
    );
    usernameInput.val("");
    passwordInput.val("");
    firstInput.val("");
    lastInput.val("");
  });

  // Does a post to the signup route. If successful, we are redirected to the members page
  // Otherwise we log any errors
  function signUpUser(username, password, first, last) {
    $.post("/api/signup", {
      username: username,
      password: password,
      first: first,
      last: last
    })
      .then(() => {
        window.location.replace("/userDashboard");
        // If there's an error, handle it by throwing up a bootstrap alert
      })
      .catch(handleLoginErr);
  }

  function handleLoginErr(err) {
    $("#alert .msg").text(err.responseJSON);
    $("#alert").fadeIn(500);
  }
});
