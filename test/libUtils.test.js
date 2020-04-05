const libUtils = require('../src/libUtils').Utils;

describe('libUtils', () => {

    it('should convert degrees to radians', () => {
        const expectedValue = 0.523599;
        const radians = parseFloat(libUtils.prototype.degreesToRadians(30).toFixed(6));
        expect(radians).toBe(expectedValue);
    });

    it('should get a reference angle for an angle less than 90 degrees', () => {
        const expectedReferenceAngle = 48;
        const referenceAngle = libUtils.prototype.getReferenceAngle(48);
        expect(referenceAngle).toBe(expectedReferenceAngle);
    });

    it('should get a reference angle for an angle between 90 and 180 degrees', () => {
        const expectedReferenceAngle = 70;
        const referenceAngle = libUtils.prototype.getReferenceAngle(110);
        expect(referenceAngle).toBe(expectedReferenceAngle);
    });

    it('should get a reference angle for an angle between 180 and 270 degrees', () => {
        const expectedReferenceAngle = 75;
        const referenceAngle = libUtils.prototype.getReferenceAngle(255);
        expect(referenceAngle).toBe(expectedReferenceAngle);
    });

    it('should get a reference angle for an angle greater than 270 degrees', () => {
        const expectedReferenceAngle = 10;
        const referenceAngle = libUtils.prototype.getReferenceAngle(350);
        expect(referenceAngle).toBe(expectedReferenceAngle);
    });

});