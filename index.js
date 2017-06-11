var _ = require('lodash'),
  fs = require('fs'),
  Promise = require('bluebird'),
  pathUtil = require('path');

function lift () {
  var self = this;

  var services = self.services = {};
  var servicesPath = self.config.paths.services = pathUtil.join(self.config.paths.root, 'api/services');

  return Promise.fromCallback(function (done) {
    return fs.readdir(servicesPath, done);
  })
  .each(function (fileName) {
    var filePath = pathUtil.join(servicesPath, fileName);
    var extname = pathUtil.extname(filePath);
    if(extname !== '.js') {
      return;
    }
    return Promise.fromCallback(function (done) {
      return fs.stat(filePath, done);
    })
    .then(function (stat) {
      if(stat.isFile()) {
        var moduleName = pathUtil.basename(fileName, extname);
        services[moduleName] = require(filePath);
      }
    });
  })
  .then(function () {
    _.extend(global, services);
  });
};

module.exports = lift;
