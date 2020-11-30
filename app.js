const express = require('express')
const app = express()
const db = require('./db/db')
const bodyParser = require('body-parser')
const morgan = require('morgan')

var logger = morgan('short')

app.use(bodyParser.json())

app.use(function (req, res, next) {
    res.header("Access-Control-Allow-Origin", "*");
    res.header("Access-Control-Allow-Headers", "Origin, X-Requested-With, Content-Type, Accept");
    next();
});





const jsonParser = bodyParser.json()

app.get('/project_status', function (req, res) {
    res.send({
        status: db.select_objs('project_status')
    })
})


app.post('/total_stages', jsonParser, (req, res) => {
    db.update_obj('project_status', 'stages', req.body.total_stages)
})

app.post('/actual_stage', jsonParser, (req, res) => {
    db.update_obj('project_status', 'stages', req.body.actual_stage)
})


app.listen(3000)