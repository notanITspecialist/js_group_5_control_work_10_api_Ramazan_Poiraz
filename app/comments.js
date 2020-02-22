const express = require('express');
const dataBaseConnect = require('../dataBaseConnect');

const router = express.Router();

router.get('/', async (req, res) => {
    if(req.query.new_id){
        const data = await dataBaseConnect.appealConnection().query(`
        select id from news where id = ` + req.query.new_id);
        if(data[0]){
            const data = await dataBaseConnect.appealConnection().query(`
            select * from comments where new_id = ` + req.query.new_id);
            res.send(data);
        } else {
            res.send({error: 'Elements not found'});
        }
    } else {
        const data = await dataBaseConnect.appealConnection().query(`
       select * from comments`);
        res.send(data);
    }
});

router.post('/', async (req, res) => {
    const coming = req.body;

    const searchNew = await dataBaseConnect.appealConnection().query(`
    select id from news where id = ` + coming.new_id);
    if(searchNew[0].id){
        if(coming.author){
            await dataBaseConnect.appealConnection().query(`
            insert into comments (new_id, author, comment) values (?,?,?)
            `, [coming.new_id, coming.author, coming.comment]);
            res.send('Added');
        } else {
            await dataBaseConnect.appealConnection().query(`
            insert into comments (new_id, comment) values  (?,?)
            `, [coming.new_id, coming.comment]);
            res.send('Added');
        }
    } else {
        res.status(404).send({error: `New ${coming.new_id} is not found`});
    }
    res.send('Added');
});

router.delete('/:id', async (req, res) => {
    await dataBaseConnect.appealConnection().query(`
    delete from comments where id = ` + req.params.id);
    res.send(`ELem ${req.params.id} is deleted`);
});

module.exports = router;