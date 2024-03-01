import express from 'express';

const app = express();
const port = Number(process.env.PORT || 8000);

app.get('/', (req, res) => {
  res.send('Hello World!');
});

app.listen(port, () => {
  console.log(`Server is running at http://localhost:${port}`);
});
