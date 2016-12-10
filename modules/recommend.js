exports.handle = function(sender, pieces, storageFactory, callback, globalTopics) {
    var topic = pieces.shift();

    var topicStorage = storageFactory.getGlobalStorage(topic);
    topicStorage.getItem('users', function(users) {
        var users = JSON.parse(users || '[]');

        var mentions = '';
        if (users.length>0) {
            mentions = 'Checkout ' + topic  + ' ' + users.join(', ');
        }

        callback({
            'message': mentions
        });
    });


};