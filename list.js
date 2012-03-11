var sqlite3 = require('sqlite3');

var ShoppingList = function (dbfile) {
	this.db = new sqlite3.Database(dbfile);
	this.db.run('CREATE TABLE IF NOT EXISTS items (item TEXT)');
}

ShoppingList.prototype.insert = function (item) {
	this.db.run('INSERT INTO items VALUES (?)', item);
}

ShoppingList.prototype.remove = function (rowid) {
	this.db.run('DELETE FROM items WHERE rowid=?', rowid);
}

ShoppingList.prototype.list = function (callback) {
	this.db.all('SELECT item, rowid FROM items WHERE 1', function (err, rows) {
		callback(rows);
	});
}

ShoppingList.prototype.close = function () {
	this.db.close();
}

exports.ShoppingList = ShoppingList;
exports.shared = new ShoppingList('list.db');
exports.respond = function (stream) {
	var loadCode = "document.getElementById('str').focus();";
	stream.write('<html><body onload="' + loadCode + '"><ul>');
	this.shared.list(function (items) {
		for (var i = 0; i < items.length; i++) {
			stream.write('<li>' + items[i].item);
			stream.write(' - <a href="/del/' + items[i].rowid + '">');
			stream.write('Delete</a></li>');
		}
		stream.write('</ul>');
		stream.write('<form method="POST" action="add">');
		stream.write('<input name="str" id="str" />');
		stream.write('</form>');
		stream.write('</body></html>');
		stream.end();
	});
}
