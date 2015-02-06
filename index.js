var Github = require('github-api');

module.exports = Hubdb;

function Hubdb(options) {
    var github = new Github({
      token: options.token,
      auth: "oauth"
    });

    var repo = github.getRepo('mapbox', 'hubdb');

    repo.getTree('db', function(err, tree) {
        console.log(arguments);
    });
}
