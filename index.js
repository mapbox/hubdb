var Github = require('github-api'),
    hat = require('hat'),
    queue = require('queue-async');

module.exports = Hubdb;

function Hubdb(options) {

    var github = new Github({
      token: options.token,
      auth: "oauth"
    });

    var repo = github.getRepo('mapbox', 'hubdb');

    function list(callback) {
        repo.getTree(options.branch, function(err, tree) {
            var q = queue(1);
            tree.filter(function(item) {
                return item.path.match(/json$/);
            }).forEach(function(item) {
                q.defer(function(cb) {
                    repo.read(options.branch, item.path + '?ref=db', function(err, res) {
                        if (err) return cb(err);
                        return cb(null, { path: item.path, data: JSON.parse(res) });
                    });
                });
            });
            q.awaitAll(function(err, res) {
                if (err) return callback(err);
                return callback(null, res);
            });
        });
    }

    function add(data, callback) {
        var id = hat() + '.json';
        repo.write(options.branch, id, JSON.stringify(data), '+',
            function(err, res) {
                callback(err, res);
        });
    }

    return {
        list: list,
        add: add
    };
}
