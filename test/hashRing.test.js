const hashRingLib = require('../src/hashRing');
const circleLib = require('../src/circle');

describe('hashRing', () => {

    document.body.innerHTML = `
        <canvas id="canvas" width="600" height="500" style="z-index:1;"></canvas>
        <canvas id="pointCanvas" width="600" height="500" style="z-index:0;"></canvas>
    `;
    
    const contextFake = {
        fillStyle: null,
        fillRect: function() {},
        clearRect: function() {},
        arc: function() {},
        stroke: function() {},
        font: null,
        fillText: function() {}
    };

    const hashRing = new hashRingLib.HashRing(
        new circleLib.Circle(200, new circleLib.Point(250, 250)),
        Object.create(contextFake), 
        Object.create(contextFake)
    );

    beforeEach(() => {
        hashRing.keys = [];
    });

    it('should sort servers lowest to highest by degree value', () => {
        let servers = [
            new hashRingLib.Key('server', 'server2'), // 220.3
            new hashRingLib.Key('server', 'server1'), // 114.3
            new hashRingLib.Key('server', 'serverX'), // 81
            new hashRingLib.Key('server', 'serverY') // 303.2
        ];

        servers.sort(hashRing.lowestToHighest);

        expect(servers[0].value).toBe('serverX');
        expect(servers[1].value).toBe('server1');
        expect(servers[2].value).toBe('server2');
        expect(servers[3].value).toBe('serverY');
    });

    it('should sort servers highest to lowest by degree value', () => {
        const servers = [
            new hashRingLib.Key('server', 'server2'), // 220.3
            new hashRingLib.Key('server', 'server1'), // 114.3
            new hashRingLib.Key('server', 'serverX'), // 81
            new hashRingLib.Key('server', 'serverY')  // 303.2
        ];

        servers.sort(hashRing.highestToLowest);

        expect(servers[0].value).toBe('serverY');
        expect(servers[1].value).toBe('server2');
        expect(servers[2].value).toBe('server1');
        expect(servers[3].value).toBe('serverX');
    });

    it('should get the nearest server (degree-wise and counterclockwise from) a given key', () => {
        
        const servers = [
            new hashRingLib.Key('server', 'server1'), // 114.3
            new hashRingLib.Key('server', 'server2'), // 220.3
            new hashRingLib.Key('server', 'serverX'), // 81
            new hashRingLib.Key('server', 'serverY')  // 303.2
        ];

        servers.forEach(server => hashRing.addKey(server));

        const expectedServer = servers.find(server => server.value === 'server2').value;
        const actualServer = hashRing.getServerForKey(new hashRingLib.Key('key', 'shredder')); // 209.4

        expect(actualServer).toBe(expectedServer);
    });

    it('should remap keys to the correct server when a server is removed', () => {
        const servers = [
            new hashRingLib.Key('server', 'server1'), // 114.3
            new hashRingLib.Key('server', 'server2'), // 220.3
            new hashRingLib.Key('server', 'server3'), // 161.3
            new hashRingLib.Key('server', 'serverX'), // 81
            new hashRingLib.Key('server', 'serverY') // 303.2
        ];

        const keys = [
            new hashRingLib.Key('key', 'leonardo'), // 55.6
            new hashRingLib.Key('key', 'raphael'), // 157.2 
            new hashRingLib.Key('key', 'donatello'), // 260.7
            new hashRingLib.Key('key', 'michaelangelo'), // 355.3
            new hashRingLib.Key('key', 'april'), // 230.6
            new hashRingLib.Key('key', 'shredder'), // 209.4
            new hashRingLib.Key('key', 'foot-soldier'), // 187.3
        ];

        servers.forEach(server => hashRing.addKey(server));
        keys.forEach(key => hashRing.addKey(key));

        hashRing.removeKey(servers.find(server => server.value === 'server2'));

        const remappedKeys = hashRing.remapKeys(
            servers.find(server => server.value === 'server2'), true);
        expect(remappedKeys.length).toBe(2);
        const key1 = remappedKeys.find(key => key.value === 'shredder');
        const key2 = remappedKeys.find(key => key.value === 'foot-soldier');
        expect(key1.server).toBe('serverY');
        expect(key2.server).toBe('serverY');
    });

    it('should remap keys to the correct server when a server is removed and the remaps cross the 0/360 degree mark', () => {
        const servers = [
            new hashRingLib.Key('server', 'server1'), // 114.3
            new hashRingLib.Key('server', 'server2'), // 220.3
            new hashRingLib.Key('server', 'server3'), // 161.3
            new hashRingLib.Key('server', 'serverX'), // 81
            new hashRingLib.Key('server', 'serverY') // 303.2
        ];

        const keys = [
            new hashRingLib.Key('key', 'leonardo'), // 55.6
            new hashRingLib.Key('key', 'raphael'), // 157.2 
            new hashRingLib.Key('key', 'donatello'), // 260.7
            new hashRingLib.Key('key', 'michaelangelo'), // 355.3
            new hashRingLib.Key('key', 'april'), // 230.6
            new hashRingLib.Key('key', 'shredder'), // 209.4
            new hashRingLib.Key('key', 'foot-soldier'), // 187.3
            new hashRingLib.Key('key', 'krang') // 336.7
        ];

        servers.forEach(server => hashRing.addKey(server));
        keys.forEach(key => hashRing.addKey(key));

        hashRing.removeKey(servers.find(server => server.value === 'serverY'));

        const remappedKeys = hashRing.remapKeys(
            servers.find(server => server.value === 'serverY'), true);
        expect(remappedKeys.length).toBe(2);
        const key1 = remappedKeys.find(key => key.value === 'april');
        const key2 = remappedKeys.find(key => key.value === 'donatello');
        expect(key1.server).toBe('serverX');
        expect(key2.server).toBe('serverX');
    });
    
    it('should remap keys to the correct server when a new server is added', () => {
        
        const servers = [
            new hashRingLib.Key('server', 'server1'), // 114.3
            new hashRingLib.Key('server', 'server3'), // 161.3
            new hashRingLib.Key('server', 'serverX'), // 81
            new hashRingLib.Key('server', 'serverY') // 303.2
        ];

        const keys = [
            new hashRingLib.Key('key', 'leonardo'), // 55.6
            new hashRingLib.Key('key', 'raphael'), // 157.2 
            new hashRingLib.Key('key', 'donatello'), // 260.7
            new hashRingLib.Key('key', 'michaelangelo'), // 355.3
            new hashRingLib.Key('key', 'april'), // 230.6
            new hashRingLib.Key('key', 'shredder'), // 209.4
            new hashRingLib.Key('key', 'foot-soldier'), // 187.3
            new hashRingLib.Key('key', 'krang') // 336.7
        ];

        servers.forEach(server => hashRing.addKey(server));
        keys.forEach(key => hashRing.addKey(key));
        
        const newServer = new hashRingLib.Key('server', 'server2');

        hashRing.addKey(newServer);

        const remappedKeys = hashRing.remapKeys(newServer, false);
        expect(remappedKeys.length).toBe(2);
        const key1 = remappedKeys.find(key => key.value === 'shredder');
        const key2 = remappedKeys.find(key => key.value === 'foot-soldier');
        expect(key1.server).toBe('server2');
        expect(key2.server).toBe('server2');
    });

    it('should remap keys to the correct server when a new server is added and the remaps cross the 0/360 degree mark', () => {
        
        const servers = [
            new hashRingLib.Key('server', 'server1'), // 114.3
            new hashRingLib.Key('server', 'server2'), // 220.3
            new hashRingLib.Key('server', 'server3'), // 161.3
            new hashRingLib.Key('server', 'serverY') // 303.2
        ];

        const keys = [
            new hashRingLib.Key('key', 'leonardo'), // 55.6
            new hashRingLib.Key('key', 'raphael'), // 157.2 
            new hashRingLib.Key('key', 'donatello'), // 260.7
            new hashRingLib.Key('key', 'michaelangelo'), // 355.3
            new hashRingLib.Key('key', 'april'), // 230.6
            new hashRingLib.Key('key', 'shredder'), // 209.4
            new hashRingLib.Key('key', 'foot-soldier'), // 187.3
            new hashRingLib.Key('key', 'krang') // 336.7
        ];

        servers.forEach(server => hashRing.addKey(server));
        keys.forEach(key => hashRing.addKey(key));
        
        const newServer = new hashRingLib.Key('server', 'serverX');

        hashRing.addKey(newServer);

        const remappedKeys = hashRing.remapKeys(newServer, false);
        expect(remappedKeys.length).toBe(3);
        const key1 = remappedKeys.find(key => key.value === 'krang');
        const key2 = remappedKeys.find(key => key.value === 'michaelangelo');
        const key3 = remappedKeys.find(key => key.value === 'leonardo');
        expect(key1.server).toBe('serverX');
        expect(key2.server).toBe('serverX');
        expect(key3.server).toBe('serverX');
    });
});