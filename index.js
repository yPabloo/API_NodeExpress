const express = require('express');
const app = express();
const port = 3000;

// Middleware para permitir que o Express interprete JSON
app.use(express.json());
const cors = require('cors');
app.use(cors());


let usuarios = [];

// Rota POST para adicionar um usuário
app.post('/usuario', (req, res) => {
    const { cpf, nome, data_nascimento } = req.body;

    // Validação simples para garantir que todos os campos estão presentes
    if (!cpf || !nome || !data_nascimento) {
        return res.status(400).send('Todos os campos são obrigatórios.');
    }

    // Adicionando o usuário ao "banco de dados" (aqui, um array em memória)
    usuarios.push({ cpf, nome, data_nascimento });
    res.status(201).send('Usuário adicionado com sucesso!');
});

// Rota GET para buscar um usuário pelo CPF
app.get('/usuario/:cpf', (req, res) => {
    const cpf = req.params.cpf;
    const usuario = usuarios.find(u => u.cpf === cpf);

    if (!usuario) {
        return res.status(404).send('Usuário não encontrado.');
    }

    res.json(usuario);
});

app.get('/usuarios', (req, res) => {
    res.json(usuarios);
});

app.listen(port, () => {
    console.log(`API rodando em http://localhost:${port}`);
});
