StarterFactories.factory('DBFactory', ['$q', function($q) {

    this.sql_db = function($q) {
        this.engine = window.db;

        this.execute_local = function(query, params, q) {
            if(!this.engine) {
                q.reject({message: 'no engine for execute_local'});
                return;
            }

            console.log('ExecuteLocalParams', params);
            console.log('ExecuteLocalQuery', query);
            this.engine.transaction(function(tx) {
              tx.executeSql(query, params, function(tx, res){
                console.log('ExecuteLocalQuerySuccess', query);
                console.log('ExecuteLocalQuerySuccess', res);
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
}]);

