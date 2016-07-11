StarterFactories.factory('WeightFactory', ['DBFactory', function(DBFactory) {
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
}]);
