StarterFactories.factory('SettingsFactory', ['$q', 'DBFactory', function($q, DBFactory) {

    this.module = function() {

        this.sql_db = DBFactory;
        this.table_name = "settings";
        this.fields = ['updated_at', 'value', 'setting'];

        this.default = {
            version: 10000,
            health_app_connection: false,
            prediction: false,
            notifications: false,
            notifications_time: '7:00',
            show_progress: true
        };

        this.save = function(settings_data) {
            var updated_at = new Date().toString(),
                query = [],
                query_base = "insert or replace into " + this.table_name + " (updated_at, value, settings) values ";

            angular.forEach(Object.keys(settings_data), function(value, key) {
              query.push(" ('" + updated_at + "', '" + settings_data[value] + "', '" + value + "')");
            }, log);

            return this.sql_db.execute(query_base + query.join(", "), [], {table_name: this.table_name, fields: this.fields});
        };

        this.load = function() {
            var q = $q.defer(),
                _this = this;

            this.sql_db.execute("SELECT * FROM " + this.table_name + ";", [], {table_name: this.table_name, fields: this.fields}).then(function(data){
                // TODO
                console.log('Settings data loaded', data);
                console.log('Settings data loaded', data.rows);
                q.resolve(_this.default);
            }, function(data) {
                console.log('Settings data load error', data);
                q.reject(data);
            });

            return q.promise;
        };
    };

    return new this.module();
}]);
