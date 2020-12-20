const fs = require('fs');

const config = require('./db/config_db.json')

const encoding = config.encoding;
const filename = './db/data.json';

function zeroing() {
    fs.readFile(filename, encoding, (err, data) => {
            if (err) throw err;
            data = JSON.parse(data);

            let date = new Date();
            data_name = date.toString()

            fs.writeFileSync(`./last_data/${data_name}.json`, JSON.stringify(data));

            for (let i = 0; i < data['people'].length; i++) {
                data['people'][i]['points'] = 0
                data['people'][i]["photo"] = null,
                data['people'][i]["Badges"] = [],
                data['people'][i]["medals"] = [],
                data['people'][i]["thanks"] = [],
                data['people'][i]["like"] = [],
                data['people'][i]["ideas"] = [],
                data['people'][i]["cookie"] = [],
                data['people'][i]["points"] = 0
            }
            fs.writeFileSync(filename, JSON.stringify(data));
        });
    
}

zeroing()


module.exports.zeroing = zeroing;