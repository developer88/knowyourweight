StarterFactories.factory('HealthModuleFactory', ['$q', 'HealthKitFactory', function($q, HealthKitFactory) {

    this.health = function() {

        this._call_with_module = function(callback) {
            var q = $q.defer(),
                _this = this,
                module = this._get_module();

            if (module) {
                console.log('Module found, call module');
                callback(module, q);
            } else {
               q.reject({message: 'no module found authorise'});
            }

            return q.promise;
        };

        this._get_module = function() {
            if (window.health.available === false) {
                console.log('No module found!');
                return null;
            }

            if (window.health.module_type === 'ios') {
                console.log('Found HealthKit');
                return HealthKitFactory;
            }

            // TODO do this for Android
        };

        this.available = function() {
            return this._call_with_module(function(module, q){
                module.available().then(function(data){
                    debugger;
                    console.log('available finished', data);
                    q.resolve(data);
                }, function(data) {
                    debugger;
                    console.log('available failed', data);
                    q.reject(data);
                });
            });
        };

        this.authorised = function() {
            return this._call_with_module(function(module, q){
                module.authorised().then(function(data){
                    console.log('authorised finished', data);
                    q.resolve(data);
                }, function(data) {
                    console.log('authorised failed', data);
                    q.reject(data);
                });
            });
        };

        this.authorize = function() {
            return this._call_with_module(function(module, q){
                module.authorize().then(function(data){
                    console.log('authorise finished', data);
                    q.resolve(data);
                }, function(data) {
                    console.log('authorise failed', data);
                    q.reject(data);
                });
            });
        };

        this.set = function(value) {
            return this._call_with_module(function(module, q){
                module.set(value).then(function(data){
                    console.log('set finished', data);
                    q.resolve(data);
                }, function(data) {
                    console.log('set failed', data);
                    q.reject(data);
                });
            });
        };

    };

    return new this.health();
}]);
