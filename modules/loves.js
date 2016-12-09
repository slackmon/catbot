exports.handle = function (sender, pieces, storageFactory, callback) {
    var user = pieces.shift();

    var thing = pieces.join(' ');

    console.log(user + ' loves ' + loved);

    var userStorage = storageFactory.getUserStorage(user);
    userStorage.getItem('loves', function(loves){
        loves = JSON.parse(loves || '{}');

        if (loves[thing]) {
            loves[thing] += 1;
        } else {
            loves[thing] = 1;
        }

        userStorage.setItem('loves', JSON.stringify(loves));

        callback({
            'message': user + ' loves ' + thing
        });
    });
}