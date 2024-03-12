import express, {response} from "express";
import cors from "cors";
import bcrypt from "bcrypt";
import validateUser from "./middlewares/validateUser";
import validatePost from "./middlewares/validatePost";

const app = express();
app.use(express.json());
app.use(cors());
const PORT = 3333;

const users = [];
const posts = [];
const loggedUsers = [];

//criar usuário
app.post("/createUser/crypto", validateUser, async (req, res) => {
  const data = req.body;
  const name = data.name;
  const email = data.email;
  const pass = data.pass;

  try {
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

    return res.status(201).json({msg: "Usuário cadastrado com sucesso"});
  } catch (error) {
    return res.status(500).json({msg: "Erro interno"});
  }
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
  try {
    const user = users.find((user) => user.email === email);
    const passMatch = await bcrypt.compare(pass, user.pass);

    if (!passMatch) {
      return res.status(400).json({msg: "Senha inválida"});
    }

    if (!user) {
      return res.status(400).json({msg: "Usuário inválido"});
    }
    loggedUsers.push(user);
    return res.status(200).json({msg: "Bem vindo!"});
  } catch (error) {
    return res.status(500).json({msg: "Erro interno"});
  }
});

// listar usuários logados
app.get("/loggedUsers", (req, res) => {
  if (loggedUsers) {
    return res.status(200).json({msg: "Usuários logados no momento", data: loggedUsers});
  }
});

//criar recado
app.post("/createPost/:userId", validatePost, (req, res) => {
  const data = req.body;
  const title = data.title;
  const description = data.description;
  const userId = req.params.userId;
  try {
    const userIndex = loggedUsers.findIndex((loggedUser) => loggedUser.id === userId);

    if (userIndex !== -1) {
      posts.push({
        id: Date.now().toString(),
        title,
        description,
      });
      return res.status(201).json({msg: "Post criado com sucesso"});
    } else {
      return res.status(400).json({msg: "Não é possível criar um post sem estar logado"});
    }
  } catch (error) {
    return res.status(500).json({msg: "Erro interno"});
  }
});

//listar os recados
app.get("/posts", (req, res) => {
  try {
    if (posts.length === 0) {
      return res.status(400).json({msg: "A lista está vazia"});
    }

    const limit = parseInt(req.query.limit);
    const offset = parseInt(req.query.offset);

    const positivePageCheck = offset - 1;

    const paginatedPosts = posts.slice(positivePageCheck, positivePageCheck + limit);

    res.status(200).json({
      msg: "Produtos retornados com sucesso",
      data: paginatedPosts,
      totalPosts: posts.length,
      currentPage: Math.floor(positivePageCheck / limit) + 1,
      totalPages: Math.ceil(posts.length / limit),
      limitByPage: limit,
    });
  } catch (error) {
    res.status(500).json({msg: "Erro interno"});
  }
  // return res.status(200).json({msg: "Lista de recados", data: posts});
});

//atualizar os recados
app.put("/posts/:userId/:postId", validatePost, (req, res) => {
  const data = req.body;
  const postId = req.params.postId;
  const userId = req.params.userId;

  try {
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
  } catch (error) {
    return res.status(500).json({msg: "Erro interno"});
  }
});

//deletar post
app.delete("/posts/:userId/:postId", (req, res) => {
  const postId = req.params.postId;
  const userId = req.params.userId;

  try {
    const userIndex = loggedUsers.findIndex((loggedUser) => loggedUser.id === userId);
    const postIndex = posts.findIndex((post) => post.id === postId);

    if (postIndex !== -1 && userIndex !== -1) {
      posts.splice(postIndex, 1);
      return res.status(200).json({msg: "Post apagado com sucesso"});
    } else {
      return res
        .status(404)
        .json({msg: "Não foi possível apagar o post, possíveis erros: Id do post errado, Id do usuário errado, usuário não logado"});
    }
  } catch (error) {
    return res.status(500).json({msg: "Erro interno"});
  }
});

//mensagem de início de servidor
app.listen(PORT, () => console.log("Servidor iniciado"));
