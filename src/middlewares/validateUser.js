function validateUser(req, res, next) {
  const data = req.body;

  if (data.name.length < 2 || data.name === undefined) {
    return res.status(400).json({msg: "O nome precisa ter 2 caracteres ou mais"});
  }

  if (data.pass.length < 6 || data.pass === undefined) {
    return res.status(400).json({msg: "A senha precisa ter 6 caracteres ou mais"});
  }

  return next();
}

export default validateUser;
