
toastr.options = {
    'closeButton': false,
    'debug': false,
    'newestOnTop': false,
    'progressBar': false,
    'positionClass': 'toast-top-right',
    'preventDuplicates': false,
    'onclick': null,
    'showDuration': '1000',
    'hideDuration': '1000',
    'timeOut': '5000',
    'extendedTimeOut': '1000',
    'showEasing': 'swing',
    'hideEasing': 'linear',
    'showMethod': 'fadeIn',
    'hideMethod': 'fadeOut'
};

var app = new Vue({
    el: '#app',
    data: {
        hashRing: {keys: []},
        keyInput: '',
        serverInput: ''
    },
    methods: {
        addKey: function() {
            this.addToHashRing('key', this.keyInput);
        },
        addServer: function() {
            const newServerKey = this.addToHashRing('server', this.serverInput);
            const remappedKeys = this.hashRing.remapKeys(newServerKey, false);
            this.displayToastr('info', 'Server Added', 'Since a server was added, a total of ' + remappedKeys.length.toString() + ' key(s) will need to be re-mapped or will result in cache misses');  
        },
        addToHashRing(type, value) {
            let error = '', key = null;
            if (value.trim().length === 0) error = 'Key length cannot be zero!';
            if (this.hashRing.keys.some(function(key) { return key.value.trim() === value.trim(); } )) error = 'Cannot add duplicate key!';
            if (type === 'key' && !this.hashRing.keys.some(function(key) { return key.type === 'server' } )) error = 'Must first add server before adding key!';

            if (error) {
                this.displayToastr('error', 'Error', error);
            } else {
                key = new Key(type, value);
                this.hashRing.addKey(key);
                this.clearInput(type);
            }
            return key;
        },
        removeKey: function(key) {
            if (key.type === 'server') {
                if (this.hashRing.getServerTypeKeys().length === 1 && this.hashRing.getNonServerTypeKeys().length > 0) {
                    this.displayToastr('error', 'Error', 'You cannot remove the last remaining server if there still exist other hash keys');  
                } else {
                    this.hashRing.removeKey(key);
                    const remappedKeys = this.hashRing.remapKeys(key, true);
                    this.displayToastr('info', 'Server Removed', 'Since a server was removed, a total of ' + remappedKeys.length.toString() + ' key(s) will need to be re-mapped or will result in cache misses');  
                }
            } else {
                this.hashRing.removeKey(key);
            }
        },
        redrawCircle: function(keys) {
            this.hashRing.eraseCircle();
            this.hashRing.draw();
            this.hashRing.keys.forEach(key => {
                this.hashRing.addPoint(key.angleInDegrees, key.type === 'server' ? '#ff0000' : '#007bff');
            });
        },
        clearInput(type) {
            if (type === 'server') this.serverInput = '';
            else this.keyInput = '';
        },
        displayToastr(type, title, message, customOptions) {
            toastr[type](message, title, customOptions || {});
        }
    },
    mounted() {
        this.hashRing = new HashRing(new Circle(200, new Point(250, 250)), 
            document.getElementById('canvas').getContext('2d'),
            document.getElementById('pointCanvas').getContext('2d'));
        this.hashRing.draw();
    }
});