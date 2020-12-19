const fs = require('fs');
const config = require('./config_db.json')


const encoding = config.encoding;
const filename = config.filename;

function create_cookie() {
    let dictionary = "abcdefghijklmnopqrstuvwxyz";
    let word = "";
    while (word.length < 10) {
        word += dictionary[Math.floor(Math.random() * dictionary.length)];
    }
    return word;
}


function create_obj(name, obj) {
    fs.readFile(filename, encoding, (err, data) => {
        if (err) throw err;
        data = JSON.parse(data);
        obj.id = data[name].length;
        data[name].push(obj)
        fs.writeFileSync(filename, JSON.stringify(data));
    });
}

function award_badge(obj) {
    fs.readFile(filename, encoding, (err, data) => {
        let isb = false;
        if (err) throw err;
        data = JSON.parse(data);
        for (let i = 0; i < data['people'].length; i++) {
            if (data['people'][i]['name'] == obj['to']) {
                for (let j = 0; j < data['people'][i]['Badges'].length; j++) {
                    isb = true;
                    if (data['people'][i]['Badges'][j]['code'] == obj['badge']) {
                        data['people'][i]['Badges'][j]['count']++
                    }
                }
                if (!isb) {
                    data['people'][i]['Badges'].push({
                        code: obj['badge'],
                        count: 1
                    })
                }
            }
        }
        fs.writeFileSync(filename, JSON.stringify(data));
    });
}

function chenge_img(img, coockie) {
    fs.readFile(filename, encoding, (err, data) => {
        if (err) throw err;
        data = JSON.parse(data);
        for (let i = 0; i < data['people'].length; i++) {
            if (data['people'][i]['cookie'] != undefined) {
                for (let j = 0; j < data['people'][i]['cookie'].length; j++) {
                    if (data['people'][i]['cookie'][j] == coockie) {
                        data['people'][i]['photo'] = img;
                    }
                }
            }
        }

        fs.writeFileSync(filename, JSON.stringify(data));

    });
}

function passch(new_pass, coockie) {
    fs.readFile(filename, encoding, (err, data) => {
        if (err) throw err;
        data = JSON.parse(data);
        for (let i = 0; i < data['people'].length; i++) {
            if (data['people'][i]['cookie'] != undefined) {
                for (let j = 0; j < data['people'][i]['cookie'].length; j++) {
                    if (data['people'][i]['cookie'][j] == coockie) {
                        data['people'][i]["password"] = new_pass;
                        data['people'][i]['cookie'] = [];
                        data['people'][i]['cookie'].push(coockie)
                    }
                }
            }
        }

        fs.writeFileSync(filename, JSON.stringify(data));
    });
}

function create_idea(text, user_id) {
    fs.readFile(filename, encoding, (err, data) => {
        if (err) throw err;
        data = JSON.parse(data);
        data['ideas'].push({
            text: text,
            user_id: user_id,
            id: data['ideas'].length
        })
        fs.writeFileSync(filename, JSON.stringify(data));
    });
}

function info_cookie(cookie) {
    let user = null;
    let data = fs.readFileSync(filename, encoding);
    data = JSON.parse(data);
    for (let i = 0; i < data['people'].length; i++) {
        if (data['people'][i]['cookie'] != undefined) {
            console.log(data['people'][i]['cookie']);
            for (let j = 0; j < data['people'][i]['cookie'].length; j++) {
                if (data['people'][i]['cookie'][j] == cookie) {
                    user = {
                        role: data['people'][i]['role'],
                        name: data['people'][i]['name'],
                        login: data['people'][i]['login'],
                        photo: data['people'][i]['photo'],
                        Badges: data['people'][i]['Badges'],
                        medals: data['people'][i]['medals'],
                        thanks: data['people'][i]['thanks'],
                        like: data['people'][i]['like'],
                        ideas: data['people'][i]['ideas'],
                        id: data['people'][i]['id'],
                    }
                    return user;
                }
            }
        }
    }
}
function exit(cookie) {
    let data = fs.readFileSync(filename, encoding);
    data = JSON.parse(data);
    for (let i = 0; i < data['people'].length; i++) {
        if (data['people'][i]['cookie'] != undefined) {
            for (let j = 0; j < data['people'][i]['cookie'].length; j++) {
                if (data['people'][i]['cookie'][j] == cookie) {
                    let users = data['people'][i]['cookie']
                    users.splice(j, 1)
                    data['people'][i]['cookie'] = users;
                    fs.writeFileSync(filename, JSON.stringify(data));
                    return 'ok'
                }
            }
        }
    }
    return false
}


function del_obj(name, key, value) {
    fs.readFile(filename, encoding, (err, data) => {
        if (err) throw err;
        data = JSON.parse(data);
        for (let i = 0; i < data[name].length; i++) {
            if (data[name][i][key] == value) data[name].splice(i, 1);
        }
        fs.writeFileSync(filename, JSON.stringify(data));
    });
}


function update_obj(name, key, value, key_upt, val_upt) {
    fs.readFile(filename, encoding, (err, data) => {
        if (err) throw err;
        data = JSON.parse(data);
        for (let i = 0; i < data[name].length; i++) {
            if (data[name][i][key] == value) data[name][i][key_upt] = val_upt
        }
        fs.writeFileSync(filename, JSON.stringify(data));
    });
}

function update_cookie(name, key, value, cookie) {
    fs.readFile(filename, encoding, (err, data) => {
        if (err) throw err;
        data = JSON.parse(data);
        for (let i = 0; i < data[name].length; i++) {
            if (data[name][i][key] == value) {
                if (data[name][i]['cookie'] == undefined) {
                    data[name][i]['cookie'] = []
                }
                data[name][i]['cookie'].push(cookie)
            }
        }
        fs.writeFileSync(filename, JSON.stringify(data));
    });
}

function push_things(name, key, value, key_upt, val_upt) {
    fs.readFile(filename, encoding, (err, data) => {
        if (err) throw err;
        data = JSON.parse(data);
        for (let i = 0; i < data[name].length; i++) {
            if (data[name][i][key] == value) {
                val_upt.id = data[name][i][key_upt].length
                data[name][i][key_upt].push(val_upt)
            }
        }
        fs.writeFileSync(filename, JSON.stringify(data));
    });
}

function update_field(name, key, value) {
    fs.readFile(filename, encoding, (err, data) => {
        if (err) throw err;
        data = JSON.parse(data);
        data[name][key] = value;
        fs.writeFileSync(filename, JSON.stringify(data));
    });
}

function select_obj(name, key, value) {
    let data = fs.readFileSync(filename, encoding);
    data = JSON.parse(data);
    let result = [];
    for (let i = 0; i < data[name].length; i++) {
        if (data[name][i][key] == value) result.push(data[name][i])
    }
    return result.length > 0 ? result : null
}

function select_objs(name) {
    let data = fs.readFileSync(filename, encoding);
    return JSON.parse(data)[name]
}




module.exports.create_obj = create_obj;
module.exports.del_obj = del_obj;
module.exports.update_obj = update_obj;
module.exports.select_obj = select_obj;
module.exports.select_objs = select_objs;
module.exports.update_field = update_field;
module.exports.create_idea = create_idea;
module.exports.push_things = push_things;
module.exports.create_cookie = create_cookie;
module.exports.update_cookie = update_cookie;
module.exports.award_badge = award_badge;
module.exports.info_cookie = info_cookie;
module.exports.chenge_img = chenge_img;
module.exports.passch = passch;
module.exports.exit = exit;