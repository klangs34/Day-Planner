$(document).ready(function () {
  $("#createAccount").on("click", (e) => {
    //e.preventDefault();
    const loginInfo = {
      username: $("#username").val().trim(),
      password: $("#password").val().trim(),
    };
    $.post("api/create-account", loginInfo, (response) => {
      //console.log(response);
      top.location.replace("/member-access");
    });
  });
});
