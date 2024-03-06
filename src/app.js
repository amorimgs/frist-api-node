const express = require('express');
const path = require('node:path');
const readJsonData = require('./utils/fs/readJsonData');
const writeJsonData = require('./utils/fs/writeJsonData');

const filePath = path.join(__dirname, 'movies.json');

const app = express();
app.use(express.json());

// Endpoint para a listagem de um filme pelo seu id
app.get('/movies/:id', async (req, res) => {
  const data = await readJsonData(filePath);
  console.log(data);
  const { id } = req.params;
  const result = data.find((el) => el.id === +id);
  if (!result) {
    return res.status(404).json({
      message: 'Filme não encontrado',
    });
  }
  return res.status(200).json(result);
});

// Endpoint que possa listar todos os filmes do JSON
app.get('/movies', async (req, res) => {
  const data = await readJsonData(filePath);
  return res.status(200).json(data);
});

// Endpoint para cadastrar um filme
app.post('/movies', async (req, res) => {
  const data = await readJsonData(filePath);
  const newID = data.reduce((prev, cur) => ((prev.id > cur.id) ? prev : cur)).id + 1;
  const newMovie = { id: newID, ...req.body };
  data.push(newMovie);
  await writeJsonData(filePath, data);
  res.status(201).send(newMovie);
});

// Endpoint para a atualização de um filme
app.put('/movies/:id', async (req, res) => {
  const data = await readJsonData(filePath);
  const { id } = req.params;
  if (data.some((el) => el.id === +id)) {
    const movieEdit = { id: +id, ...req.body };
    const dataEdit = data.map((el) => {
      if (el.id === +id) {
        return movieEdit;
      } return el;
    });
    await writeJsonData(filePath, dataEdit);
    return res.status(200).json(movieEdit);
  }
  return res.status(404).json('Filme não cadastrado!');
});

// Endpoint para a exclusão de um filme
app.delete('/movies/:id', async (req, res) => {
  const data = await readJsonData(filePath);
  const { id } = req.params;
  if (data.some((el) => el.id === +id)) {
    const dataEdit = data.filter((el) => el.id !== +id);
    await writeJsonData(filePath, dataEdit);
    return res.status(200).json({
      message: 'Filme deletado com sucesso',
    });
  }
  return res.status(404).json('ID inválido!');
});

module.exports = app;