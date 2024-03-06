function validatePost(req, res, next) {
  const data = req.body;

  if (!data.title) {
    return res.status(400).json({msg: "Erro ao criar o título"});
  }

  if (!data.description) {
    return res.status(400).json({msg: "Erro ao criar a descrição"});
  }

  return next();
}

export default validatePost;
