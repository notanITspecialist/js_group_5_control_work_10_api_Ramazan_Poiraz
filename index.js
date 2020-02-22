const express = require('express');
const cors = require('cors');

const dataBaseConnect = require('./dataBaseConnect');

const news = require('./app/news');
const comments = require('./app/comments');

const port = 8000;

const app = express();

app.use(cors());
app.use(express.json());

app.use('/news', news);
app.use('/comments', comments);

const initial = async () => {
    await dataBaseConnect.connect();

    app.listen(port ,() => {
      console.log(`Server start on ${port} port!!`)
    });

    process.on('exit', () => dataBaseConnect.disconnect());
};

initial().catch(e => {
   console.log(e)
});