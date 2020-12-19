const cookieParser = require('cookie-parser');
const express = require('express')
const app = express()
const db = require('./db/db')
const bodyParser = require('body-parser')
const morgan = require('morgan')

var logger = morgan('short')

const jsonParser = bodyParser.json()

app.use(cookieParser());

app.use((req, res, next) => {
  res.header('Access-Control-Allow-Origin', req.headers.origin);
  res.header('Access-Control-Allow-Credentials', true);
  res.header('Access-Control-Allow-Headers', 'Origin, X-Requested-With, Content-Type, Accept');
  next();
});

app.use(bodyParser.json({limit: '50mb', extended: true}))
app.use(bodyParser.urlencoded({limit: '50mb', extended: true}))

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
        console.log(user);
        console.log(user == null);
        if (user == null) {
            let cookie = db.create_cookie()
            let cookie_array = []
                cookie_array.push(cookie)

            db.create_obj('people', {
                role: null,
                name: req.body.name,
                password: req.body.password,
                login: req.body.login,
                photo: null,
                Badges: [],
                medals: [],
                thanks: [],
                like: [],
                ideas: [],
                cookie: cookie_array
            })
            res.send({
                status: 'ok',
                data: {
                    name: req.body.name,
                    login: req.body.login,
                    role: null,
                    photo: null
                },
                cookie: cookie,
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
app.post('/auto_login', jsonParser, (req, res) => {
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
app.post('/information_about_user', jsonParser, (req, res) => {
    res.send({data: db.info_cookie(req.body.cookie)})
})
app.post('/exit', jsonParser, (req, res) => {
    res.send({data: db.exit(req.body.cookie)})
})
app.post('/award_badge', jsonParser, (req, res) => {
    db.award_badge({
        from: req.body.img,
        badge: req.body.badge,
        to: req.body.to,
    });
    res.send({
        status: 'ok'
    })
})
app.post('/chenge_img', jsonParser, (req, res) => {
    try {
        db.chenge_img(req.body.img, req.body.cookie)
        res.send({
            status: 'ok'
        })
    } catch (error) {
        res.send({
            status: 'error'
        })
    }
})
app.post('/passwd', jsonParser, (req, res) => {
    try {
        db.passch(req.body.pass, req.body.cookie)
        res.send({
            status: 'ok'
        })
    } catch (error) {
        res.send({
            status: 'error'
        })
    }
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
                let cookie = db.create_cookie()
                db.update_cookie('people', 'login', user[0].login, cookie)
                res.send({
                    status: 'ok',
                    data: {
                        id: user[0].id,
                        role: user[0].role,
                        name: user[0].name,
                        photo: user[0].photo,
                        login: user[0].login
                    },
                    cookie: cookie
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
    db.push_things('people', 'name', req.body.login, 'thanks', {
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
app.post('/edit_data', jsonParser, (req, res) => {
    try {
        let step = 0;
        console.log(req.body.id);
        console.log(req.body.id != undefined && req.body.id != false);
        if (req.body.id != undefined && req.body.id != false) {
            
            if (req.body.img != undefined && req.body.img != false) {
                db.update_obj("data","id", req.body.id, "img", req.body.img)
                step++
            }
            if (req.body.title != undefined && req.body.title != false) {
                db.update_obj("data","id", req.body.id, "title", req.body.title)
                step++
            }
            if (req.body.text != undefined && req.body.text != false) {
                db.update_obj("data","id", req.body.id, "text", req.body.text)
                step++
            }
            if (req.body.status != undefined) {
                db.update_obj("data","id", req.body.id, "status", req.body.status)
                step++
            }
            res.send({status: 'ok', text: `обновленно полей ${step}`})
        } else {
            res.send({status: 'id is undefined'})
        }
    } catch (err) {
        res.send({
            status: 'error'
        })
        console.error(err)
    }

})



app.listen('3000')