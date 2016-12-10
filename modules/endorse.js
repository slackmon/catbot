exports.handle = function (sender, pieces, storageFactory, callback, globalTopics) {
    var user = pieces.shift();

    // skip 'for' if first word of endorsement
    if (pieces[0] == 'for') {
        pieces.shift();
    }

    var endorsement = pieces.join(' ');

    console.log('Endorsing ' + user + ' for ' + endorsement);

    var userStorage = storageFactory.getUserStorage(user);

    var topicStorage = storageFactory.getGlobalStorage(endorsement);
    topicStorage.getItem('users', function(users) {
        users = JSON.parse(users || '[]');

        if (users.indexOf(user) == -1) {
            users.push(user);
            topicStorage.setItem('users', JSON.stringify(users));
        }
    });

    userStorage.getItem('endorsements', function(endorsements){
        endorsements = JSON.parse(endorsements || '{}');

        if (endorsements[endorsement]) {
            endorsements[endorsement] += 1;
        } else {
            endorsements[endorsement] = 1;
        }

        var emojiString = '';
        if (globalTopics.indexOf(endorsement.toLowerCase()) >= 0) {
            emojiString = ' :' + endorsement.toLowerCase() + ':';
        }

        userStorage.setItem('endorsements', JSON.stringify(endorsements));

        callback({
            'message': ':star: ' + user + ' has been endorsed for ' + endorsement + emojiString
        });
    });
}