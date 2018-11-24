var db = require('../fn/mysql-db');

exports.loadAll = () => {
	var sql = 'select * from englishvietnam';
	return db.load(sql);
}