document.addEventListener("DOMContentLoaded", function () {
  $("input").on("focus", function () {
    $(this).css("border-color", "#dee2e6");
    $("#error-message").css("display", "none");
  });

  function fetchTabelaProdutos() {
    fetch("/produtos/listar", { method: "get" })
      .then((r) => r.json())
      .then((r) => {
        if (r.ok && r.data.length) {
          let linhasTabela = "";

          r.data.forEach((produto) => {
            linhasTabela += `
            <tr>
              <td>${produto.codigo}</td>
              <td>${produto.descricao}</td>
              <td>${produto.precoCusto}</td>
              <td>${produto.precoVenda}</td>
              <td>${produto.validade}</td>
              <td>${produto.quantidade}</td>
              <td>${produto.fabricante}</td>
            </tr>
            `;
          });
          $("#loading-row").hide();
          $("#table-products-body").append(linhasTabela);
        }
        $("#loading-row > td").text("Nenhum produto encontrado");
      });
  }

  fetchTabelaProdutos();

  $("#cadastrar-produto").on("click", function () {
    let codigo = $("#codigo-input").val();
    let descricao = $("#descricao-input").val();
    let precoCusto = $("#precoCusto-input").val();
    let precoVenda = $("#precoVenda-input").val();
    let validade = $("#validade-input").val();
    let quantidade = $("#quantidade-input").val();
    let fabricante = $("#fabricante-input").val();

    if (
      validaCampos(
        codigo,
        descricao,
        precoCusto,
        precoVenda,
        validade,
        quantidade,
        fabricante
      )
    ) {
      let payload = {
        codigo,
        descricao,
        precoCusto,
        precoVenda,
        validade,
        quantidade,
        fabricante,
      };

      fetch("/produtos/novo", {
        method: "post",
        headers: { "content-type": "application/json" },
        body: JSON.stringify(payload),
      })
        .then((r) => r.json())
        .then((r) => {
          if (r.ok) {
            alert(r.message);
            fetchTabelaProdutos();
          } else {
            $("#error-message").css("display", "flex");
            $("#error-message").text(r.message);
          }
        });
    }
  });
});

function validaCampos(
  codigo,
  descricao,
  precoCusto,
  precoVenda,
  validade,
  quantidade,
  fabricante
) {
  let camposComErro = [];

  if (!codigo) camposComErro.push("#codigo-input");
  if (!descricao) camposComErro.push("#descricao-input");
  if (!precoCusto) camposComErro.push("#precoCusto-input");
  if (!precoVenda) camposComErro.push("#precoVenda-input");
  if (!validade) camposComErro.push("#validade-input");
  if (!quantidade) camposComErro.push("#quantidade-input");
  if (!fabricante) camposComErro.push("#fabricante-input");

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
