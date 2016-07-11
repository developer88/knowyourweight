function Settings() {

    this.default = {
        version: 10000,
        health_app_connection: false,
        prediction: false,
        notifications: false,
        notifications_time: '7:00',
        show_progress: true
    };

    this.save = function() {
        if(!this.data) {
            this.data = jQuery.extend({}, this.default);
        }
        if(this.data && this.data.version != this.default.version) {
            this.data = jQuery.extend(this.default, this.data);
        }
        this.saveToDb();
    };

    this.data = {};

    this.saveToDb = function() {
        // todo
    };

    this.load = function() {
        return jQuery.extend({}, this.default);
        // todo
    };

}