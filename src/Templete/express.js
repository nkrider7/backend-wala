export const expressTemplate = () => `
const express = require('express');
const app = express();
const port = 3000;

app.use(express.json());

app.get('/', (req, res) => {
  res.send('Hello Backend Wala🍬');
});

// REST routes would go here

app.listen(port, () => {
  console.log(\`Example app listening at http://localhost:\${port}\`);
});
`;