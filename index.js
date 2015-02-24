var Octokat = require('octokat'),
    hat = require('hat'),
    atob = require('atob'),
    btoa = require('btoa'),
    queue = require('queue-async');

module.exports = Hubdb;

/**
 * Create a new Hubdb instance. This is a database-like wrapper for a
 * branch of a GitHub repository that treats JSON objects in that branch
 * as documents.
 *
 * Hubdb shines where GitHub itself makes sense: you can take
 * advantage of GitHub's well-architected APIs and user permissions. A
 * good example of hubdb in practice is in [stickshift](https://github.com/mapbox/stickshift),
 * where it powers a lightweight query storage for an analytics app.
 *
 * Takes a configuration object with options:
 *
 * * `username` the user's name of the repository.
 *   this is not necessary the user that's logged in.
 * * `repo` the repository name
 * * `branch` the branch of the repository to use as a
 *   database.
 * * `token` a GitHub token. You'll need to get this
 *   by OAuth'ing into GitHub or use an applicaton token.
 *
 * @param {Object} options
 * @example
 * var db = Hubdb({
 *  token: 'MY_TOKEN',
 *  username: 'mapbox',
 *  repo: 'hubdb',
 *  branch: 'db'
 * });
 * db.add({ grass: 'green' }, function() {
 *   db.list(function(err, res) {
 *     // [{
 *     //   path: '2e959f35c6022428943b9c96d974498d.json'
 *     //   data: { grass: 'green' }
 *     // }]
 *   });
 * });
 */
function Hubdb(options) {

    var github = new Octokat({
      token: options.token,
      auth: "oauth"
    });

    var repo = github.repos(options.username, options.repo);

    /**
     * List documents within this database. If successful, the given
     * callback is called with an array of documents as
     * `{ path: string, data: object }` objects.
     * @param {Function} callback called with (err, contents): contents
     * is an array of `{ path: string, data: object }`
     */
    function list(callback) {
        repo.git.trees(options.branch).fetch(function(err, res) {
            if (err) return callback(err);
            var q = queue(1);
            res.tree.filter(function(item) {
                return item.path.match(/json$/);
            }).forEach(function(item) {
                q.defer(function(cb) {
                    get(item.path, function(err, content) {
                        if (err) return cb(err);
                        return cb(null, {
                            path: item.path,
                            data: content
                        });
                    });
                });
            });
            q.awaitAll(function(err, res) {
                if (err) return callback(err);
                return callback(null, res);
            });
        });
    }

    /**
     * Add a new object to the database. If successful, the callback is called
     * with (err, res) in which `res` reveals the id internally chosen
     * for this new item.
     *
     * @param {Object} data
     * @param {Function} callback called with (err, result, id)
     */
    function add(data, callback) {
        var id = hat() + '.json';
        repo.contents(id).add({
            content: btoa(JSON.stringify(data)),
            branch: options.branch,
            message: '+'
        }, function(err, res) {
           callback(err, res, id);
        });
    }

    /**
     * Remove an item from the database given its id  and a callback.
     *
     * @param {String} id
     * @param {Function} callback called with (err, result, id)
     */
    function remove(id, callback) {
        repo.contents(id).fetch({
            ref: options.branch
        }, function(err, info) {
            if (err) return callback(err);
            repo.contents(id).remove({
                branch: options.branch,
                sha: info.sha,
                message: '-'
            }, function(err, res) {
               callback(err, res, id);
            });
        });
    }

    /**
     * Get an item from the database given its id and a callback.
     *
     * @param {String} id
     * @param {Function} callback called with (err, contents): contents
     * are given as parsed JSON
     */
    function get(id, callback) {
        _getSHA(id, function(err, sha) {
            if (err) return callback(err);
            repo.git.blobs(sha).fetch(function(err, res) {
                if (err) return callback(err);
                callback(err, JSON.parse(atob(res.content)));
            });
        });
    }

    /**
     * Update an object in the database, given its id, new data, and a callback.
     *
     * @param {String} id
     * @param {Object} data as any JSON-serializable object
     * @param {Function} callback called with (err, result, id)
     */
    function update(id, data, callback) {
        repo.contents(id).fetch({
            ref: options.branch
        }, function(err, info) {
            if (err) return callback(err);
            repo.contents(id).add({
                branch: options.branch,
                sha: info.sha,
                content: btoa(JSON.stringify(data)),
                message: 'updated'
            }, function(err, res) {
               callback(err, res, id);
            });
        });
    }

    /**
     * get the SHA corresponding to id at the HEAD of options.branch 
     *
     * @param {String} id
     * @param {Function} callback called with (err, result)
     */
    function _getSHA(id, callback) {
        repo.contents("").fetch({
            ref: options.branch
        }, function(err, res) {
            if (err) return callback(err);
            sha = res.reduce(function(previousValue, item) {
                return item.name === id ? item.sha : previousValue;
            }, "");
            callback(err, sha);
        });
    }
    
    return {
        list: list,
        update: update,
        remove: remove,
        get: get,
        add: add
    };
}
