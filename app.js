const express = require('express')
const app = express()
const db = require('./db/db')

app.use(function(req, res, next) {
    res.header("Access-Control-Allow-Origin", "*");
    res.header("Access-Control-Allow-Headers", "Origin, X-Requested-With, Content-Type, Accept");
    next();
});

app.get('/project_status', function (req, res) {
  res.send({status: db.select_objs('project_status')})
})

app.listen(3000)