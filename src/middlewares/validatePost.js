function validatePost(req, res, next) {
  const data = req.body;

  if (data.title.length < 3) {
    return res.status(400).json({msg: "O título precisa ter 3 caracteres ou mais"});
  }

  if (data.description.length < 3) {
    return res.status(400).json({msg: "A descrição precisa ter 3 caracteres ou mais"});
  }

  return next();
}

export default validatePost;
