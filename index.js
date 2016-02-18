var _ = require('lodash'),
  fs = require('fs'),
  async = require('async'),
  pathUtil = require('path');

module.exports = function (done) {
  var self = this;

  var services = self.services = {};
  var servicesPath = self.config.paths.services = pathUtil.join(self.config.paths.root, 'api/services');

  fs.readdir(servicesPath, function (err, fileNames) {
    async.each(fileNames, function (fileName, done) {
      var filePath = pathUtil.join(servicesPath, fileName);
      var extname = pathUtil.extname(filePath);
      if(extname !== '.js') {
        return done();
      }
      fs.stat(filePath, function (err, stat) {
        if(err) {
          return done();
        }

        if(stat.isFile()) {
          var moduleName = pathUtil.basename(fileName, extname);
          services[moduleName] = require(filePath);
        }
        done();
      })
    }, function () {
      _.extend(global, services);
      done();
    });
  });
};