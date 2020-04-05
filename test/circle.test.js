const circleLib = require('../src/circle');

describe('circle', () => {

    const circle = new circleLib.Circle(200, new circleLib.Point(200, 200));

    it('should get the correct point on a circle for an angle < 90 degrees', () => {
        const expectedPoint = new circleLib.Point(373.2, 100.0);
        const actualPoint = circle.getPoint(30);
        expect(parseFloat(actualPoint.x.toFixed(1))).toBe(expectedPoint.x);
        expect(parseFloat(actualPoint.y.toFixed(1))).toBe(expectedPoint.y);
    });

    it('should get the correct point on a circle for an angle between 90 and 180 degrees', () => {
        const expectedPoint = new circleLib.Point(165.3, 3.0);
        const actualPoint = circle.getPoint(100);
        expect(parseFloat(actualPoint.x.toFixed(1))).toBe(expectedPoint.x);
        expect(parseFloat(actualPoint.y.toFixed(1))).toBe(expectedPoint.y);
    });

    it('should get the correct point on a circle for an angle between 180 and 270 degrees', () => {
        const expectedPoint = new circleLib.Point(12.1, 268.4);
        const actualPoint = circle.getPoint(200);
        expect(parseFloat(actualPoint.x.toFixed(1))).toBe(expectedPoint.x);
        expect(parseFloat(actualPoint.y.toFixed(1))).toBe(expectedPoint.y);
    });

    it('should get the correct point on a circle for an angle over 270 degrees', () => {
        const expectedPoint = new circleLib.Point(393.2, 251.8);
        const actualPoint = circle.getPoint(345);
        expect(parseFloat(actualPoint.x.toFixed(1))).toBe(expectedPoint.x);
        expect(parseFloat(actualPoint.y.toFixed(1))).toBe(expectedPoint.y);
    });

});