Avaliação Final do Módulo - Módulo Introdução ao Back-End 

Aplicação lista de recados:

Criação de conta

Login

CRUD* de recados.


Esta aplicação de endpoints foi criada com express e javascript puro e testada com Postman. 

Como funciona(basicamente):

Cria-se um usuário com nome, email e senha e que recebe um id aleatório.
Esse usuário consegue fazer login usando seu email e senha. Assim que logado, esse usuário pode fazer posts usando o id que foi lhe gerado antes.
Para fazer um post, precisa-se de um titulo e uma descrição e, assim como o usuário, o post recebe um id aleatório.
Pode-se listar todos os recados.
Para atualizar um recado, precisa-se informar o id do usuário e o id do post, sem ambos juntos não é possível fazer a atualização.
Para deletar um recado também é necessário ambos id do usuário e id do post.
