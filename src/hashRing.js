if (typeof exports === 'object') {
    CRC32 = require('crc-32'); 
    Utils = require('./libUtils').Utils; 
    module.exports = {
        HashRing: HashRing,
        Key: Key
    };
}

function HashRing(circle, canvasContext, pointCanvasContext) {
    this.keys = [];
    this.circle = circle;
    this.ctx = canvasContext;
    this.pointCtx = pointCanvasContext;
}

HashRing.prototype.draw = function() {
    this.ctx.arc(this.circle.origin.x, this.circle.origin.y, this.circle.radius, 0, 360, false);
    this.ctx.stroke();
    this.ctx.font = '20px Arial';
    this.ctx.fillStyle = 'black';
    this.ctx.fillText('0° / 360°', this.circle.origin.x + this.circle.radius + 10, this.circle.origin.y);
    this.ctx.fillText('90°', this.circle.origin.x - 10, this.circle.origin.y - this.circle.radius - 10);
    this.ctx.fillText('180°', this.circle.origin.x - this.circle.radius - 45, this.circle.origin.y);
    this.ctx.fillText('270°', this.circle.origin.x - 13, this.circle.origin.y + this.circle.radius + 23);
};

HashRing.prototype.addKey = function(key) {
    key.server = this.getServerForKey(key);
    this.keys.push(key);
    this.addPoint(key.angleInDegrees, key.type === 'server' ? '#ff0000' : '#007bff');
};

HashRing.prototype.addPoint = function(angle, color) {
    const point = this.circle.getPoint(angle);
    this.pointCtx.fillStyle = color;
    this.pointCtx.fillRect(point.x, point.y, 8, 8);
};

HashRing.prototype.eraseCircle = function(angle) {                
    this.pointCtx.clearRect(0, 0, 600, 500);
};

HashRing.prototype.addAllPoints = function() {
    const self = this;
    this.keys.forEach(function(key) {
        self.addPoint(key.angleInDegrees, key.type === 'server' ? '#ff0000' : '#007bff');
    });
}

HashRing.prototype.removeKey = function(key) {
    this.keys.splice(this.keys.findIndex(function(currentKey) { return currentKey === key }), 1);
    this.eraseCircle();
    this.addAllPoints();
};

HashRing.prototype.removePoint = function(angle) {                
    const point = this.circle.getPoint(angle);
    this.pointCtx.fillStyle = 'rgba(0, 0, 0, 0)';
    this.pointCtx.clearRect(point.x, point.y, 8, 8);
};

HashRing.prototype.lowestToHighest = function(a, b) {
    if (a.angleInDegrees < b.angleInDegrees) return -1;
    if (a.angleInDegrees > b.angleInDegrees) return 1;
    return 0;
};

HashRing.prototype.highestToLowest = function(a, b) {
    if (a.angleInDegrees > b.angleInDegrees) return -1;
    if (a.angleInDegrees < b.angleInDegrees) return 1;
    return 0;
};

HashRing.prototype.getServerTypeKeys = function() {
    return this.keys.filter(function(currentKey) { return currentKey.type === 'server'; });
}

HashRing.prototype.getNonServerTypeKeys = function() {
    return this.keys.filter(function(currentKey) { return currentKey.type === 'key'; });
}

HashRing.prototype.getServerForKey = function(key) {
    if (key.type === 'server') return null;

    const serverKeysWithGreaterDegreeValue = this.getServerTypeKeys().filter(function(currentKey) { 
        return currentKey.angleInDegrees > key.angleInDegrees; 
    });

    if (serverKeysWithGreaterDegreeValue.length > 0) {
        // get closest (next highest) server from this key
        return serverKeysWithGreaterDegreeValue.sort(this.lowestToHighest)[0].value;
    } else {
        // no server with a higher degree value could be found, so get the lowest value
        return this.getServerTypeKeys().sort(this.lowestToHighest)[0].value;
    }
};

HashRing.prototype.getKeysForServer = function(server) {
    return this.keys.filter(function(key) { return key.server === server.value; });
}

HashRing.prototype.remapKeys = function(serverKey, serverKeyWasRemoved) {

    const self = this;

    if (serverKeyWasRemoved) {
        return remapKeysForRemovedServer();
    } else {
        return remapKeysForAddedServer();
    }

    function remapKeysForRemovedServer() {
        const keysOnThisServer = self.getKeysForServer(serverKey);
        if (keysOnThisServer.length > 0) {
            const newServer = self.getServerForKey(keysOnThisServer[0]);
            keysOnThisServer.forEach(function(key) {
                key.server = newServer;
            });
        }
        return keysOnThisServer;
    }

    function remapKeysForAddedServer() {
        const nextServerKey = getNextClockwiseServerKey();
        let keysToRemap = [];
        if (serversSpan360Axis(serverKey, nextServerKey)) {
            keysToRemap = self.keys.filter(function(key) { 
                return key.type === 'key' && 
                    (key.angleInDegrees < serverKey.angleInDegrees || key.angleInDegrees > nextServerKey.angleInDegrees)
            });
            keysToRemap.forEach(function(key) {
                key.server = serverKey.value;
            });
        } else {
            keysToRemap = self.keys.filter(function(key) { 
                return key.type === 'key' && 
                    key.angleInDegrees < serverKey.angleInDegrees && 
                    key.angleInDegrees > nextServerKey.angleInDegrees;
            });
            keysToRemap.forEach(function(key) {
                key.server = serverKey.value;
            });
        }
        return keysToRemap;
    }

    function serversSpan360Axis(serverKey, nextServerKey) {
        return nextServerKey.angleInDegrees > serverKey.angleInDegrees
    }

    function getNextClockwiseServerKey() {
        const serversWithLowerDegreeValue = self.getServerTypeKeys().filter(function(key) { return key.angleInDegrees < serverKey.angleInDegrees }); 
        if (serversWithLowerDegreeValue.length > 0) {
            // find nearest 
            return serversWithLowerDegreeValue.sort(self.highestToLowest)[0];
        } else {
            // find highest overall
            return self.getServerTypeKeys().sort(self.highestToLowest)[0];
        }
    }

};

function Key(type, value) {
    this.type = type;
    this.isKey = type === 'key';
    this.isServer = type === 'server;'
    this.value = value;
    this.hashedValueDecimal = Math.abs(CRC32.str(value))
    this.angleInDegrees = this.calculateDegreeAngle();
    this.server = null;
}

Key.prototype.calculateDegreeAngle = function() {
    return parseFloat((this.hashedValueDecimal / Utils.prototype.MAX_INT_32_VALUE * 360).toFixed(1));
}