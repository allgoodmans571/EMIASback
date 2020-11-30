const express = require('express')
const app = express()
const db = require('./db/db')
const bodyParser = require('body-parser')
const morgan = require('morgan')

var logger = morgan('short')

const jsonParser = bodyParser.json()

app.use(bodyParser.urlencoded({ extended: true }));
app.use(bodyParser.json());

app.use(function (req, res, next) {
    res.header("Access-Control-Allow-Origin", "*");
    res.header("Access-Control-Allow-Headers", "Origin, X-Requested-With, Content-Type, Accept");
    next();
});






app.get('/project_status', function (req, res) {
    res.send({
        status: db.select_objs('project_status')
    })
})


app.post('/actual_stage', jsonParser, (req, res) => {
    try {        
        console.log(req.body.actual_stage);
        db.update_field('project_status', 'actual_stage', req.body.actual_stage)
        res.send({status: 'ok'})
    } catch (err) {
        res.send({status: 'error'})
        console.error(err)
    }
})

app.post('/total_stage', jsonParser, (req, res) => {
    try {
        db.update_field('project_status', 'stages', req.body.total_stage)
        res.send({status: 'ok'})
    } catch (err) {
        res.send({status: 'error'})
        console.error(err)
    }

})


app.listen(3000)