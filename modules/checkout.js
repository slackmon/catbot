exports.handle = function (sender, pieces, storageFactory, callback) {
    var link = pieces.shift();

    // skip 'requires' if first word of endorsement
    if (pieces[0] == 'requires') {
        pieces.shift();
    }

    var skill = pieces.join(' ');

    console.log('Link ' + link + ' requires ' + skill);

    var linkStorage = storageFactory.getGlobalStorage(link);
    linkStorage.getItem('requires', function(skills){
        skills = JSON.parse(skills || '{}');

        if (skills[skills]) {
            skills[skills] += 1;
        } else {
            skills[skill] = 1;
        }

        linkStorage.setItem('requires', JSON.stringify(skills));

        callback({
            'message': 'Got it. Link: ' + link + ' requires ' + skill
        });
    });
}