StarterFactories.factory('HealthKitFactory', ['$q', function($q) {
  this.module = function() {

    this._with_defer = function(callback) {
      var q = $q.defer();

      callback(function(data){
        console.log('Inside HealthKit module  success');
        q.resolve(data);
      }, function(data) {
        console.log('Inside HealthKit module  failed');
        q.reject(data);
      });

      return q.promise();
    };

    this.authorize = function() {
      return this._with_defer(function(success, fail) {
        window.plugins.healthkit.requestAuthorization({
          'readTypes': [],
          'writeTypes': []
        }, success, fail);
      });
    };

    this.authorised = function() {
      return this._with_defer(function(success, fail) {
        window.plugins.healthkit.checkAuthStatus({
          'type': ''
        }, success, fail);
      });
    };

    this.set = function(value) {
      return this._with_defer(function(success, fail) {
        window.plugins.healthkit.saveWeight({
          'requestReadPermission': false, // use if your app doesn't need to read
          'unit': 'kg',
          'amount': value,
          'date': new Date() // is 'now', which is the default as well
        }, success, fail);
      });
    };

  };

  return new this.module();
}]);
