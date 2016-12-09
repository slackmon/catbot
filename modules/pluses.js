exports.handle = function(sender, pieces, storageFactory, callback, globalTopics) {
	var userStorage, userString;

	if (pieces.length){
		userStorage = storageFactory.getUserStorage(pieces[0]);
		userString = pieces[0];
	}else{
		userStorage = storageFactory.getUserStorage(sender);
		userString = "<@" + sender + ">";
	}

	userStorage.getItem('pluses', function(pluses){
		var message = null;
		if (!pluses){
			message = "Alas, " + userString + " has no pluses. You should give them some!";
		}else{
			message = userString + " has " + pluses + " pluses!";
		}
		callback({'message': message});
	});

};