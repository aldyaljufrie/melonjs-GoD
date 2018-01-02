/**
 * Spawner Entity
 */
game.SpawnerEntity = me.Entity.extend({

    init:function (x, y, settings) {
        this._super(me.Entity, 'init', [x, y , settings]);
        game.troops = [ ];
        game.spawner = {
            x : this.pos.x,
            y : this.pos.y
        };
        game.troopsQuantity = 5;
        // game.playScreen.spawnTroops(game.troopsQuantity);
    }
});