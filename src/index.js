import express from "express";
import cors from "cors";
import bcrypt from "bcrypt";
import validateUser from "./middlewares/validateUser";

const app = express();
app.use(express.json());
app.use(cors());

let nextId = 1;
const users = [];
const posts = [];

//criar usuário
app.post("/createUser/crypto", validateUser, async (req, res) => {
  const data = req.body;
  const email = data.email;
  const pass = data.pass;

  const emailExists = users.find((user) => user.email === email);

  if (emailExists) {
    return res.status(400).json({msg: "Email já cadastrado."});
  }

  const cryptoPass = await bcrypt.hash(pass, 10);

  users.push({
    id: nextId,
    name: data.name,
    email: data.email,
    pass: cryptoPass,
  });

  nextId++;

  res.status(201).json({msg: "Usuário cadstrado com sucesso"});
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
  const passMatch = await bcrypt.compare(pass, cryptoPass);

  if (!passMatch || !user) {
    return res.status(400).json({msg: "Login inválido"});
  }

  if (!user) {
    return res.status(400).json({msg: "Login inválido"});
  }

  res.status(200).json({msg: "Bem vindo", data: user.name});
});

//criar recado

//mensagem de início de servidor
app.listen(8080, () => console.log("Servidor iniciado"));
