var db = require('../fn/mysql-db');

exports.loadAll = () => {
	var sql = 'select * from vietnamesejapanese';
	return db.load(sql);
}

exports.loadDataVN = (data) => {
	var sql = 'select japanese from vietnamesejapanese where vietnamese = \'' + data + '\'';
	return db.load(sql);
}

exports.loadDataJP = (data) => {
	var sql = 'select vietnamese from vietnamesejapanese where japanese = \'' + data + '\'';
	return db.load(sql);
}

exports.senData = (name,number,address,note) => {
	var sql = 'INSERT INTO vietnamesejapanese VALUES (\'' + name + ',' + number + ',' + address + ',' + note + '\'';
	return db.load(sql);
}