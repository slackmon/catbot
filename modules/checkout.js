var textScraper = require('text-scraper');
// TODO: Compute tag cloud from channel or interests
var globalTopics = ['Ruby', 'PHP', 'Slack', 'NodeJS', 'Director', 'Engineering', 'Salesforce', 'Workday', 'Analytics', 'enterprise'];

exports.handle = function (sender, pieces, storageFactory, callback) {
    var sentence = pieces.join(' ');
    var m = sentence.match(/<(http.+)>/gi) || [];
    for(var i=0; i < m.length; i++) {
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
                    var reg = RegExp(topic, 'gi');
                    var m2 = linkContent.match(reg) || [];
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