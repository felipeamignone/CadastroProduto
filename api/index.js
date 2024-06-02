import express from "express";
import path from "path";
import session from "express-session";
import cookieParser from "cookie-parser";

const port = 3001;
const app = express();

app.use(express.urlencoded({ extended: true }));
app.use(express.json());
app.use(cookieParser());

app.use(
  session({
    secret: "MinH4Ch4v3S3cr3t4", //chave para assinar os dados da sessão
    resave: true, //salva a sessão a cada requisição HTTP
    saveUninitialized: true,
    cookie: {
      //tempo de vida da sessão
      maxAge: 1000 * 60 * 15, //15 minutos
    },
  })
);

app.use(express.static(path.join(process.cwd(), "public")));

//pagina de login
app.get("/login", (req, res) => {
  res.redirect("/login.html");
});

//método de login
app.post("/login", (req, res) => {
  let { user, senha } = req.body;

  if (user === "admin" && senha === "senha123") {
    req.session.usuarioAutenticado = true;
    res.cookie("usuarioLogado", user);
    res.send({ ok: true, message: "Usuário logado com sucesso!" });
    return;
  }
  res.send({ ok: false, message: "Nome de usuário e/ou senha inválidos!" });
});

//método de logout
app.get("/logout", (req, res) => {
  req.session.destroy();
  res.clearCookie("usuarioLogado");
  res.redirect("/login.html");
});

//middleware para verificar autenticação
function usuarioEstaAutenticado(req, res, next) {
  if (req.session.usuarioAutenticado) {
    next(); //permitir que a requisição continue a ser processada
    return;
  }
  res.redirect("/login.html");
}

app.use(
  usuarioEstaAutenticado,
  express.static(path.join(process.cwd(), "restricted"))
);

//pagina de produtos
app.get("/produtos", (req, res) => {
  res.redirect("/produtos.html");
});

let listaProdutos = [];

//método para listar produtos
app.get("/produtos/listar", (req, res) => {
  res.send({ ok: true, data: listaProdutos });
});

//método para cadastrar produto
app.post("/produtos/novo", (req, res) => {
  let {
    codigo,
    descricao,
    precoCusto,
    precoVenda,
    validade,
    quantidade,
    fabricante,
  } = req.body;

  if (
    codigo &&
    descricao &&
    precoCusto &&
    precoVenda &&
    validade &&
    quantidade &&
    fabricante
  ) {
    const novoProduto = {
      codigo,
      descricao,
      precoCusto,
      precoVenda,
      validade,
      quantidade,
      fabricante,
    };
    listaProdutos.push(novoProduto);

    res.send({ ok: true, message: "Produto cadastrado com sucesso" });
    return;
  }
  res.send({ ok: false, message: "Não foi possível cadastrar produto" });
});

app.listen(port, () => {
  console.log(`Server rodando em http://localhost:${port}`);
});

export default app;
