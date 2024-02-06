import express from "express";
import cors from "cors";
import bcrypt from "bcrypt";
import validateUser from "./middlewares/validateUser";
import validatePost from "./middlewares/validatePost";

const app = express();
app.use(express.json());
app.use(cors());

const users = [];
const posts = [];
const loggedUsers = [];

//criar usuário
app.post("/createUser/crypto", validateUser, async (req, res) => {
  const data = req.body;
  const name = data.name;
  const email = data.email;
  const pass = data.pass;

  const emailExists = users.find((user) => user.email === email);

  if (emailExists) {
    return res.status(400).json({msg: "Email já cadastrado."});
  }

  const cryptoPass = await bcrypt.hash(pass, 10);

  users.push({
    id: Date.now().toString(),
    name,
    email,
    pass: cryptoPass,
  });

  res.status(201).json({msg: "Usuário cadastrado com sucesso"});
});

//listar todos os usuários
app.get("/users", (req, res) => {
  return res.status(200).json({msg: "Lista de usuários atuais", data: users});
});

//login
app.post("/userLogin", async (req, res) => {
  const data = req.body;
  const email = data.email;
  const pass = data.pass;

  const cryptoPass = await bcrypt.hash(pass, 10);
  const user = users.find((user) => user.email === email);
  const passMatch = await bcrypt.compare(pass, user.pass);

  if (!passMatch) {
    return res.status(400).json({msg: "Login inválido"});
  }

  if (!user) {
    return res.status(400).json({msg: "Login inválido"});
  }
  loggedUsers.push(user);
  res.status(200).json({msg: "Bem vindo!", data: user});
});

//criar recado
app.post("/createPost/:userId", validatePost, (req, res) => {
  const data = req.body;
  const title = data.title;
  const description = data.description;
  const userId = req.params.userId;

  const userIndex = loggedUsers.findIndex((loggedUser) => loggedUser.id === userId);

  if (userIndex !== -1) {
    posts.push({
      id: Date.now().toString(),
      title,
      description,
    });
    res.status(201).json({msg: "Post criado com sucesso"});
  } else {
    res.status(400).json({msg: "Não é possível criar um post sem estar logado"});
  }
});

//mensagem de início de servidor
app.listen(8080, () => console.log("Servidor iniciado"));
