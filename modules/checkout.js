var textScraper = require('text-scraper');
// TODO: Compute tag cloud from channel or interests
var globalTopics = ['Ruby', 'PHP', 'MySQL', 'NodeJS', 'Bots', 'Engineering', 'Salesforce', 'Workday',
    'Golang', 'Jira', 'AWS', 'Java', 'Python', 'Javascript', 'Mulesoft'];

exports.handle = function (sender, pieces, storageFactory, callback) {
    var sentence = pieces.join(' ');
    var regexp = /\<(http.+)\>/gi;
    var m = regexp.exec(sentence) || [];
    for(var i=1; i < m.length; i++) {
        var link = m[i];
        console.log('Found link: ' + link);
        var linkContent;
        textScraper.scrapeURL(link, function(err, res) {
            if (err) {
                console.log('Error reading link: ' + link + ' is ' + err);
            } else {
                console.log('Content for link: ' + link + ' is:\n ' + res);
                linkContent = res;
                var topicCloud = {};
                var topics = [];

                for (var j =0; j < globalTopics.length; j++){
                    var topic = globalTopics[j];
                    console.log('Looking for ' + topic);
                    var reg = RegExp('\\b' + topic + '\\b', 'gim');
                    var m2 = linkContent.match(reg) || [];
                    console.log("Match for " + reg + " is " + m2);
                    if (m2.length>0){
                        topics.push(topic + ' :' +  topic.toLowerCase() +':');
                        topics[topic.toLowerCase()] = m2.length;
                    }
                }

                if (topics.length > 0) {
                    var linkStorage = storageFactory.getGlobalStorage(link);
                    linkStorage.setItem('contains', JSON.stringify(topicCloud));

                    callback({
                        'message': ':link: ' + link + ' covers topics: ' + topics.join(', ')
                    });
                } else {
                    callback({
                        'message': ':disappointed: ugh Sorry I could not find any relevant content for link: ' + link
                    });
                }
            }

        });

    }
    console.log('Done processing: ' + sentence);
};