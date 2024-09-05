// node index.js
// curl -X POST http://localhost:3000/usuario -H "Content-Type: application/json" -d "{\"cpf\": \"123456789\", \"nome\": \"João Silva\", \"data_nascimento\": \"1990-01-01\"}"
// curl http://localhost:3000/usuario/123456789
// curl http://localhost:3000/usuarios
// http://localhost:3000/api-docs

const express = require('express');
const app = express();
const port = 3000;
const swaggerJsdoc = require('swagger-jsdoc');
const swaggerUi = require('swagger-ui-express');

// Middleware para permitir que o Express interprete JSON
app.use(express.json());
const cors = require('cors');
app.use(cors());

// Configuração do Swagger
const swaggerOptions = {
    definition: {
        openapi: '3.0.0',
        info: {
            title: 'API de Usuários',
            version: '1.0.0',
            description: 'API para gerenciar usuários com CPF, nome e data de nascimento'
        },
        servers: [
            {
                url: 'http://localhost:3000',
            },
        ],
    },
    apis: ['./index.js'], // Caminho do arquivo onde você adicionará as rotas documentadas
};

const swaggerDocs = swaggerJsdoc(swaggerOptions);
app.use('/api-docs', swaggerUi.serve, swaggerUi.setup(swaggerDocs));


/**
 * @swagger
 * components:
 *   schemas:
 *     Usuario:
 *       type: object
 *       required:
 *         - cpf
 *         - nome
 *         - data_nascimento
 *       properties:
 *         cpf:
 *           type: integer
 *           description: CPF do usuário
 *         nome:
 *           type: string
 *           description: Nome do usuário
 *         data_nascimento:
 *           type: string
 *           format: date
 *           description: Data de nascimento do usuário
 *       example:
 *         cpf: 12345678900
 *         nome: João Silva
 *         data_nascimento: 1990-01-01
 */

/**
 * @swagger
 * /usuario:
 *   post:
 *     summary: Adiciona um novo usuário
 *     tags: [Usuário]
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             $ref: '#/components/schemas/Usuario'
 *     responses:
 *       201:
 *         description: Usuário adicionado com sucesso
 *       400:
 *         description: Dados inválidos
 */

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

/**
 * @swagger
 * /usuario/{cpf}:
 *   get:
 *     summary: Busca um usuário pelo CPF
 *     tags: [Usuário]
 *     parameters:
 *       - in: path
 *         name: cpf
 *         schema:
 *           type: integer
 *         required: true
 *         description: CPF do usuário
 *     responses:
 *       200:
 *         description: Dados do usuário
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/Usuario'
 *       404:
 *         description: Usuário não encontrado
 */

// Rota GET para buscar um usuário pelo CPF
app.get('/usuario/:cpf', (req, res) => {
    const cpf = req.params.cpf;
    const usuario = usuarios.find(u => u.cpf === cpf);

    if (!usuario) {
        return res.status(404).send('Usuário não encontrado.');
    }

    res.json(usuario);
});

/**
 * @swagger
 * /usuarios:
 *   get:
 *     summary: Retorna a lista de todos os usuários
 *     tags: [Usuário]
 *     responses:
 *       200:
 *         description: Lista de usuários
 *         content:
 *           application/json:
 *             schema:
 *               type: array
 *               items:
 *                 $ref: '#/components/schemas/Usuario'
 */

// Rota GET para buscar todos os usuários existentes
app.get('/usuarios', (req, res) => {
    res.json(usuarios);
});

app.listen(port, () => {
    console.log(`API rodando em http://localhost:${port}`);
});
