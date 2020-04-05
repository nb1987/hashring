if (typeof exports === 'object') {
    Utils = require('./libUtils').Utils;
    module.exports = {
        Circle: Circle, 
        Point: Point 
    };
}

function Point(x, y) {
    this.x = x;
    this.y = y;
}

function Circle(radius, origin) {
    this.radius = radius;
    this.origin = origin;
}

Circle.prototype.getPoint = function(angle) {
    const referenceAngle = Utils.prototype.getReferenceAngle(angle);
    const angleInRadians = Utils.prototype.degreesToRadians(referenceAngle);
    const x = this.origin.x + (angle <= 90 || angle >= 270 ? 
        (Math.cos(angleInRadians) * this.radius) : 
        -(Math.cos(angleInRadians) * this.radius));
    const y = this.origin.y + (angle >= 180 ? 
        (Math.sin(angleInRadians) * this.radius) : 
        -(Math.sin(angleInRadians) * this.radius));
    return new Point(x, y);
};
