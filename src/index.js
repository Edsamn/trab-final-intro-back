import express from "express";
import cors from "cors";
import bcrypt from "bcrypt";
// import validateUser from "./middlewares/validateUser";
// import validatePost from "./middlewares/validatePost";

const app = express();
app.use(express.json());
app.use(cors());
const port = 3333;

const users = [];
const posts = [];
const loggedUsers = [];

//criar usuário
app.post("/createUser/crypto", async (req, res) => {
  const data = req.body;
  const name = data.name;
  const email = data.email;
  const pass = data.pass;

  if (data.name.length < 2) {
    return res.status(400).json({msg: "O nome precisa ter 2 caracteres ou mais"});
  }

  if (data.pass.length < 6) {
    return res.status(400).json({msg: "A senha precisa ter 6 caracteres ou mais"});
  }

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
  return res.status(200).json({msg: "Lista de usuários criados", data: users});
});

//login
app.post("/userLogin", async (req, res) => {
  const data = req.body;
  const email = data.email;
  const pass = data.pass;

  const user = users.find((user) => user.email === email);
  const passMatch = await bcrypt.compare(pass, user.pass);

  if (!passMatch) {
    res.status(400).json({msg: "Senha inválida"});
  }

  if (!user) {
    res.status(400).json({msg: "Usuário inválido"});
  }

  res.status(200).json({msg: "Bem vindo!"});

  loggedUsers.push(user);
});

//listar usuários logados
app.get("/loggedUsers", (req, res) => {
  if (loggedUsers) {
    return res.status(200).json({msg: "Usuários logados no momento", data: loggedUsers});
  }
});

//criar recado
app.post("/createPost/:userId", (req, res) => {
  const data = req.body;
  const title = data.title;
  const description = data.description;
  const userId = req.params.userId;

  if (data.title.length < 3) {
    return res.status(400).json({msg: "O título precisa ter 3 caracteres ou mais"});
  }

  if (data.description.length < 3) {
    return res.status(400).json({msg: "A descrição precisa ter 3 caracteres ou mais"});
  }

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

//listar os recados
app.get("/posts", (req, res) => {
  return res.status(200).json({msg: "Lista de recados", data: posts});
});

//atualizar os recados
app.put("/posts/:userId/:postId", (req, res) => {
  const data = req.body;
  const postId = req.params.postId;
  const userId = req.params.userId;

  if (data.title.length < 3) {
    return res.status(400).json({msg: "O título precisa ter 3 caracteres ou mais"});
  }

  if (data.description.length < 3) {
    return res.status(400).json({msg: "A descrição precisa ter 3 caracteres ou mais"});
  }

  const newPost = {
    id: Date.now().toString(),
    title: data.title,
    description: data.description,
  };

  const userIndex = loggedUsers.findIndex((loggedUser) => loggedUser.id === userId);
  const postIndex = posts.findIndex((post) => post.id === postId);

  if (postIndex !== -1 && userIndex !== -1) {
    posts[postIndex] = newPost;
    res.status(200).json({msg: "Post atualizado com sucesso"});
  } else {
    return res
      .status(404)
      .json({msg: "Não foi possível atualizar o post, possíveis erros: Id do post errado, Id do usuário errado, usuário não logado"});
  }
});

//deletar post
app.delete("/posts/:userId/:postId", (req, res) => {
  const postId = req.params.postId;
  const userId = req.params.userId;

  const userIndex = loggedUsers.findIndex((loggedUser) => loggedUser.id === userId);
  const postIndex = posts.findIndex((post) => post.id === postId);

  if (postIndex !== -1 && userIndex !== -1) {
    posts.splice(postIndex, 1);
    res.status(200).json({msg: "Post apagado com sucesso"});
  } else {
    return res
      .status(404)
      .json({msg: "Não foi possível apagar o post, possíveis erros: Id do post errado, Id do usuário errado, usuário não logado"});
  }
});

//mensagem de início de servidor
app.listen(port, () => console.log("Servidor iniciado"));
