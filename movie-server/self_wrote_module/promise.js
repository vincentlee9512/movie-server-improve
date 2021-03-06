let sqlite3 = require('sqlite3').verbose();
const path = require('path');

//function from professor Thomas Marrinan
let poster = require('../self_wrote_module/imdb_poster');

module.exports = {
    form_promise: function form_promise(form, req){
        return new Promise((resolve, reject) => {
            form.parse(req, (err, fields, files) => {
                if(err) {
                    reject(err);
                }else{
                    resolve(fields);
                }
            })
        })
    },
    fs_promise: function fs_promise(file_name){
        return new Promise((resolve, reject) => {
            fs.readFile(file_name, (err, data) => {
                if(err) reject(err);
                else{
                    resolve(data);
                }
            });
        });
    },
    db_promise_like: function db_promise_like(sql, searchTerm){
        let db = new sqlite3.Database('database/imdb.sqlite3');
        return new Promise((resolve, reject) => {
            db.all(sql, searchTerm, (err, rows) => {
                if(err){
                    reject(err);
                }else{
                    resolve(rows);
                }
            });
            db.close();
        });
    },
    db_promise: function db_promise(sql) {
        let db = new sqlite3.Database('database/imdb.sqlite3');
        return new Promise((resolve, reject) => {
            db.all(sql, (err, rows) => {
                if(err){
                    reject(err);
                }else{
                    resolve(rows);
                }
            });
            db.close();
        });
    },
    poster_promise: function (uid){
        if(uid.substring(0,2) === "tt"){
            return new Promise((resolve, reject) => {
                poster.GetPosterFromTitleId(uid, (err, data) => {
                    if(err){
                        reject(err);
                    }else{
                        resolve("http://" + path.join(data.host, data.path));
                    }
                })
            })
        }else if(uid.substring(0,2) === "nm"){
            return new Promise((resolve, reject) => {
                poster.GetPosterFromNameId(uid, (err, data) => {
                    if(err){
                        reject(err);
                    }else{
                        resolve("http://" + path.join(data.host, data.path));
                    }
                })
            })
        }
    }
};