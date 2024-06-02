document.addEventListener("DOMContentLoaded", function () {
  $("input").on("focus", function () {
    $(this).css("border-color", "#dee2e6");
    $("#error-message").css("display", "none");
  });

  $("#login-button").on("click", function () {
    let user = $("#user-input").val();
    let senha = $("#senha-input").val();

    const payload = { user, senha };

    if (validaCampos(user, senha)) {
      fetch("/login", {
        method: "post",
        headers: { "content-type": "application/json" },
        body: JSON.stringify(payload),
      })
        .then((r) => r.json())
        .then((r) => {
          if (r.ok) {
            alert(r.message);
            window.location.href = "/produtos";
          } else {
            $("#error-message").css("display", "flex");
            $("#error-message").text(r.message);
          }
        });
    }
  });
});

function validaCampos(user, senha) {
  let camposComErro = [];

  if (!user) camposComErro.push("#user-input");

  if (!senha) camposComErro.push("#senha-input");

  if (camposComErro.length) {
    camposComErro.forEach((campo) => {
      $(campo).css("border-color", "red");
    });
    $("#error-message").css("display", "flex");
    $("#error-message").text("Preencha os campos corretamente!");
    return false;
  }
  return true;
}
