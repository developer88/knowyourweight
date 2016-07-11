angular.module('starter.factories', [])

.factory('DBFactory', ['$q', function($q) {

    this.sql_db = function($q) {
        this.engine = window.db;

        this.execute_local = function(query, params, q) {
            if(!this.engine) {
                q.reject({message: 'no engine for execute_local'});
                return;
            }

            this.engine.transaction(function(tx) {
              tx.executeSql(query, params, function(tx, res){
                q.resolve(res);
              }, function(tx, err){
                q.reject(err);
              });
            });
        };

        this.execute_external = function(query, params, q) {
            if(!this.engine) {
                q.reject({message: 'no engine for execute_external'});
                return;
            }

            window.sql_engine.execute(this.engine, query, params).then(function(res) {
              q.resolve(res);
            }, function (err) {
              q.reject(err);
            });
        };

        this.create_if_not_exist = function(table_name, fields) {
            var q = $q.defer(),
                query = "CREATE TABLE IF NOT EXISTS " + table_name + " (" + fields.join() + ")";
            if(window.sql_engine) {
                 this.execute_external(query, [], q);
            } else {
                this.execute_local(query, [], q);
            }
            return q.promise;
        };

        this.execute = function(query, params, options) {
            var _this = this;
            return this.create_if_not_exist(options['table_name'], options['fields']).then(function(data) {
                //query = "CREATE TABLE IF NOT EXISTS " + options['table_name'] + " (" + options['fields'] + ");" + query;
                console.log('query', query);
                console.log('queryParams', params);
                var q = $q.defer();
                if(window.sql_engine) {
                    _this.execute_external(query, params, q);
                } else {
                    _this.execute_local(query, params, q);
                }
                return q.promise;
            }, function(err) {
                console.log('CreateTableFailed', err);
            });
        };

        this.save = function(table_name, fields, data) {
            var values = angular.extend([], fields), query = "";
            for(var i = 0; i < values.length; i++) {
                values[i] = '?';
            }
            query = "INSERT INTO " + table_name + " (" + fields.join() +
                ") VALUES (" + values.join() + ");";
            return this.execute(query, data, {table_name: table_name, fields: fields});
        };

        this.clear = function(table_name) {
            query = "TRUNCATE TABLE " + table_name + ";";
            return this.execute(query, {}, {table_name: table_name});
        };
    };

    return new this.sql_db($q);
}])

.factory('HealthKitFactory', ['$q', function($q) {
    this.module = function() {

        this.set = function(value) {
            var q = $q.defer();

            console.log('Inside HealthKit module SET');

            window.plugins.healthkit.saveWeight({
                  'requestReadPermission': false, // use if your app doesn't need to read
                  'unit': 'kg',
                  'amount': value,
                  'date': new Date() // is 'now', which is the default as well
                },
                function(data) {
                    console.log('Inside HealthKit module SET success');
                    q.resolve(data);
                },
                function(data) {
                     console.log('Inside HealthKit module SET failed');
                    q.reject(data);
                }
            );

            return q.promise();
        };

    };

    return new this.module();
}])

.factory('HealthModuleFactory', ['$q', 'HealthKitFactory', function($q, HealthKitFactory) {

    this.health = function() {

        this.get_module = function() {
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

        this.set = function(value) {
            var module = this.get_module(),
                q = $q.defer();

            console.log('set for health module');

            if (module) {
                console.log('Module found, call module SET');
                module.set(value).then(function(data){
                    console.log('Set finished', data);
                    q.resolve(data);
                }, function(data) {
                    console.log('Set failed', data);
                    q.reject(data);
                });
            } else {
               console.log('No module found');
               q.reject({message: 'no module found'});
            }

            return q.promise;
        };

    };

    return new this.health();
}])

.factory('WeightFactory', ['DBFactory', function(DBFactory) {
    this.weight = function() {

        this.sql_db = DBFactory;
        this.table_name = "weight";
        this.fields = ['created_at', 'value'];

        this.load = function() {
            return this.sql_db.execute("SELECT * FROM " + this.table_name + ";", [], {table_name: this.table_name, fields: this.fields});
        };

        this.save = function(value) {
            var created_at = new Date().toString();

            return this.sql_db.save(this.table_name, this.fields, [created_at, value]).then(function(data){
                console.log('WeightSaved', data);
            }, function(err){
                console.log('WeightSavedError', err);
            });
        };

        this.clear = function() {
            return this.sql_db.clear(this.table_name).then(function(data){
                console.log('WeightCleared', data);
            }, function(err){
                console.log('WeightClearedError', err);
            });
        };

    };

    return new this.weight();
}])

.factory('SettingsFactory', ['DBFactory', function(DBFactory) {
    return new Settings();
}]);
