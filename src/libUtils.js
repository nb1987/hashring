if (typeof exports === 'object') {
    module.exports = {
        Utils: Utils
    };
}

function Utils() { }

Utils.prototype.MAX_INT_32_VALUE = 2147483647;

Utils.prototype.degreesToRadians = function(angleInDegrees) {
    return angleInDegrees * Math.PI / 180;
};

Utils.prototype.getReferenceAngle = function(originalAngle) {
    var referenceAngle = originalAngle;
    if (originalAngle > 90 && originalAngle <= 180) {
        referenceAngle = 180 - originalAngle;
    } else if (originalAngle > 180 && originalAngle <= 270) {
        referenceAngle = originalAngle - 180;
    } else if (originalAngle > 270) {
        referenceAngle = 360 - originalAngle;
    }
    return referenceAngle;
};

