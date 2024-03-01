import express from 'express';
import { database } from './db';

const app = express();
const port = Number(process.env.PORT || 8000);

(async () => database.init())();

app.get('/', (req, res) => {
  res.send('Hello World!');
});

app.listen(port, () => {
  console.log(`Server is running at http://localhost:${port}`);
  console.log(`Press CTRL+C to stop the server`);
});
