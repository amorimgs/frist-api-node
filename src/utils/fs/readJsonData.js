const fs = require('node:fs/promises');

const readJsonData = async (_path) => {
  const data = await fs.readFile(_path, { encoding: 'utf-8' });
  return JSON.parse(data);
};

module.exports = readJsonData;