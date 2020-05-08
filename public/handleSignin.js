$(document).ready(function () {
  $("#signin").on("click", (e) => {
    e.preventDefault();
    const loginInfo = {
      username: $("#username").val().trim(),
      password: $("#password").val().trim(),
    };
    $.post("api/login", loginInfo, (response) => {
      //console.log(response);
      window.location.replace("/member-access");
    });
  });
});
