const fs = require('node:fs/promises');

const writeJsonData = async (_path, data) => {
  await fs.writeFile(_path, JSON.stringify(data));
};

module.exports = writeJsonData;