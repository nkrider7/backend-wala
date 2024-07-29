export const expressTemplate = () => `
import express from 'express';
import bodyParser from 'body-parser';
const app = express();
const port = 3000;

app.use(express.json());
app.use(bodyParser.urlencoded({ extended: true }));
app.use(bodyParser.json());

app.get('/', (req, res) => {
  res.send('Hello Backend Wala🍬 Server is running...');
});

// REST routes would go here

app.listen(port, () => {
  console.log(\`Example app listening at http://localhost:\${port}\`);
});
`;