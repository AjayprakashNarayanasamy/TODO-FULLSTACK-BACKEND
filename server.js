const express = require('express');

const app = express();

const PORT = 3000;

app.get('/health', (req, res, next) => {
  res.json({
    status: 'ok',
  });
});

app.listen(PORT, () => {
  console.log(`Server is running in the PORT ${PORT}`);
});
