var db = require('../fn/mysql-db');

exports.loadAll = () => {
	var sql = 'select * from vietnamesejapanese';
	return db.load(sql);
}