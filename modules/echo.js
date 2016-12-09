exports.handle = function(sender, pieces, storageFactory, callback, globalTopics) {
	callback({'message': pieces.join(" ")});
}