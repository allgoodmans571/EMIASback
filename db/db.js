const fs = require('fs');
const config = require('./config_db.json')


const encoding = config.encoding;
const filename = config.filename;

function create_obj(name, obj) {
    fs.readFile(filename, encoding, (err, data) => {
        if (err) throw err;
        data = JSON.parse(data);
        obj.id = data[name].length;
        data[name].push(obj)
        fs.writeFileSync(filename, JSON.stringify(data));
    });
}


function del_obj(name, key, value) {
    fs.readFile(filename, encoding, (err, data) => {
        if (err) throw err;
        data = JSON.parse(data);
        for (let i = 0; i < data[name].length; i++) {
            if (data[name][i][key]==value) data[name].splice(i,1);
        }
        fs.writeFileSync(filename, JSON.stringify(data));
    });
}


function update_obj(name, key, value, key_upt, val_upt) {
    fs.readFile(filename, encoding, (err, data) => {
        if (err) throw err;
        data = JSON.parse(data);
        for (let i = 0; i < data[name].length; i++) {
            if (data[name][i][key]==value) data[name][i][key_upt] = val_upt
        }
        fs.writeFileSync(filename, JSON.stringify(data));
    });
}

function select_obj(name, key, value) {
    let data = fs.readFileSync(filename, encoding);
    data = JSON.parse(data);
    let result = [];
    for (let i = 0; i < data[name].length; i++) {
        if (data[name][i][key]==value) result.push(data[name][i])
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