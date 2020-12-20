const fs = require('fs');

const config = require('./db/config_db.json')

const encoding = config.encoding;
const filename = './db/data.json';

fs.readFile(filename, encoding, (err, data) => {
        if (err) throw err;
        data = JSON.parse(data);
        for (let i = 0; i < data['people'].length; i++) {
            data['people'][i]['points'] = 0
        }
        fs.writeFileSync(filename, JSON.stringify(data));
    });