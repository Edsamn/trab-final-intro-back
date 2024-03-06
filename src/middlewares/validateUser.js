function validateUser(req, res, next) {
  const data = req.body;

  if (!data.name) {
    return res.status(400).json({msg: "Erro ao cadstrar o nome"});
  }

  if (!data.pass) {
    return res.status(400).json({msg: "Erro ao cadsatrar a senha"});
  }

  return next();
}

export default validateUser;
