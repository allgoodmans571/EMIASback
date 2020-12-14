const cookieParser = require('cookie-parser');
const express = require('express')
const app = express()
const db = require('./db/db')
const bodyParser = require('body-parser')
const morgan = require('morgan')

var logger = morgan('short')

const jsonParser = bodyParser.json()

app.use(bodyParser.urlencoded({
    extended: true
}));
app.use(bodyParser.json());
app.use(cookieParser());

app.use(function (req, res, next) {
    res.header("Access-Control-Allow-Origin", "*");
    res.header("Access-Control-Allow-Headers", "Origin, X-Requested-With, Content-Type, Accept");
    next();
});

app.get('/get_ideas', function (req, res) {
    res.send({
        "ideas": db.select_objs('ideas')
    })
})

app.get('/project_status', function (req, res) {
    res.send({
        "status": db.select_objs('project_status')
    })
})
app.get('/bulletin_project', function (req, res) {
    res.send({
        status: db.select_objs('data')
    })
})
app.get('/get_people', function (req, res) {
    let users_from_db = db.select_objs('people');
    let users = [];

    for (let i = 0; i < users_from_db.length; i++) {
        users.push({
            role: users_from_db[i].role,
            name: users_from_db[i].name,
            login: users_from_db[i].login,
            photo: users_from_db[i].photo,
            Badges: users_from_db[i].Badges,
            medals: users_from_db[i].medals,
            thanks: users_from_db[i].thanks,
            like: users_from_db[i].like,
            ideas: users_from_db[i].ideas,
            id: users_from_db[i].id
        })
    }
    res.send({
        status: users
    })
})

app.post('/registration', jsonParser, (req, res) => {
    try {
        let user = db.select_obj('people', 'login', req.body.login)
        if (user == null) {
            db.create_obj('people', {
                role: req.body.role,
                name: req.body.name,
                password: req.body.password,
                login: req.body.login,
                photo: null,
                Badges: [],
                medals: [],
                thanks: [],
                like: [],
                ideas: []
            })
            res.send({
                status: 'ok'
            })
        } else {
            res.send({
                status: 'not a unique login'
            })
        }
    } catch (err) {
        res.send({
            status: 'error'
        })
        console.error(err)
    }
})
app.post('/shareidea', jsonParser, (req, res) => {
    db.create_idea(req.body.text, 'req.body.userId');
    res.send({
        status: 'ok'
    })
})
app.post('/adddata', jsonParser, (req, res) => {
    db.create_obj('data', {
        "img": req.body.img,
        "title": req.body.title,
        "status": req.body.status,
        "text": req.body.text,
        "likes": 0,
    });
    res.send({
        status: 'ok'
    })
})
app.post('/deldata', jsonParser, (req, res) => {
    try {
        db.del_obj('data', "id", req.body.id)
        res.send({
            status: 'ok'
        })
    } catch (error) {
        res.send({
            status: 'err'
        })
    }
})

app.post('/login', jsonParser, (req, res) => {
    try {
        let user = db.select_obj('people', 'login', req.body.login)
        if (user.length == 1) {
            if (user[0].password == req.body.password) {
                res.send({
                    status: 'ok',
                    data: {
                        id: user[0].id,
                        role: user[0].role,
                        name: user[0].name,
                        photo: user[0].photo,
                        login: user[0].login
                    }
                })
                res.cookie('user', 'test')
            }
        }
        res.send({
            status: 'login error'
        })
    } catch (err) {
        res.send({
            status: 'error'
        })
    }
})
app.post('/add', jsonParser, (req, res) => {
    try {
        let user = db.select_obj('people', 'login', req.body.login)
        if (user.length == 1) {
            if (user[0].password == req.body.password) {
                res.send({
                    status: 'ok',
                    data: {
                        id: user[0].id,
                        role: user[0].role,
                        name: user[0].name,
                        photo: user[0].photo,
                        login: user[0].login
                    }
                })
            }
        }
        res.send({
            status: 'login error'
        })
    } catch (err) {
        res.send({
            status: 'error'
        })
    }
})
app.get('/CookieSet', (req, res) => {
    res.cookie('test', 'test')
    res.send({
        status: 'ok'
    })
})
app.get('/CookieGet', (req, res) => {
    res.send({
        status: req.cookies['user']
    })
})
app.post('/actual_stage', jsonParser, (req, res) => {
    try {
        console.log(req.body.actual_stage);
        db.update_field('project_status', 'actual_stage', req.body.actual_stage)
        res.send({
            status: 'ok'
        })
    } catch (err) {
        res.send({
            status: 'error'
        })
        console.error(err)
    }
})
app.post('/say_thanks', jsonParser, (req, res) => {


    // try {
    res.send({
        status: 'ok'
    })
    db.push_things('people', 'login', req.body.login, 'thanks', {
        "text": req.body.text,
        "from": req.body.from,
    })
    // } catch (err) {
    //     res.send({status: 'error'})
    //     console.error(err)
    // }
})

app.post('/total_stage', jsonParser, (req, res) => {
    try {
        db.update_field('project_status', 'stages', req.body.total_stage)
        res.send({
            status: 'ok'
        })
    } catch (err) {
        res.send({
            status: 'error'
        })
        console.error(err)
    }

})



app.listen(3000)