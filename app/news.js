const express = require('express');
const path = require('path');
const dataBaseConnect = require('../dataBaseConnect');

const fs = require('fs');

const router = express.Router();

const multer = require('multer');
const nanoid = require('nanoid');
const config = require('../config');

const storage = multer.diskStorage({
    destination: (req, file, cd) => {
        cd(null, config.uploadPath)
    },
    filename: (req, file, cd) => {
        cd(null, nanoid() + path.extname(file.originalname));
    }
});

const upload = multer({storage});

router.get('/', async (req, res) => {
    const data = await dataBaseConnect.appealConnection().query(`
    select
    title, image, date
    from news
    `);
    res.send(data)
});

router.get('/:id', async (req, res) => {
    const data = await dataBaseConnect.appealConnection().query(`
    select
    *
    from news where id = ` + req.params.id);
    data[0] ? res.send(data[0]) : res.send({error: 'Element not found'});
});

router.post('/', upload.single('image'), async (req, res) => {
    if(req.file){
        req.body.image = req.file.filename;
    }

    const coming = req.body;
    await dataBaseConnect.appealConnection().query(`
    insert into news (title, content, image) values`+`
    (?,?,?);`,[coming.title, coming.content, coming.image]);
    res.send('Added')
});

router.delete('/:id', async (req, res) => {
    const image = await dataBaseConnect.appealConnection().query(`
    select image from news where id = ` + req.params.id);

    await dataBaseConnect.appealConnection().query(`
    delete from news where id = ` + req.params.id);

    fs.unlinkSync(config.uploadPath + '/' + image[0].image);

    image[0] ? res.send(`New ${req.params.id} is deleted`) : res.send({error: `Element ${req.params.id} is deleted`})
});

module.exports = router;