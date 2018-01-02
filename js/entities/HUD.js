/**
 * a HUD container and child items
 */

game.HUD = game.HUD || {};


game.HUD.Container = me.Container.extend({

    init: function() {
        // call the constructor
        this._super(me.Container, 'init');

        // persistent across level change
        this.isPersistent = true;

        // make sure we use screen coordinates
        this.floating = true;

        // give a name
        this.name = "HUD";
        this.anchorPoint.set(0, 0);

        this.width = me.game.viewport.getWidth();
        this.height = me.game.viewport.getHeight();

        // add our child score object at the top left corner
        this.addChild(new game.HUD.CoinImage(10, 10), 100);
        this.addChild(new game.HUD.battleButton(this.width - 175, this.height - 75));
        this.addChild(new game.HUD.CoinText(10, 10), 150);
    }
});

game.HUD.battleButton = me.GUI_Object.extend({
    init: function(x, y){
        var settings = {}
        settings.image = "buttons";
        settings.framewidth = 161;
        settings.frameheight = 64;
        this._super(me.GUI_Object, "init", [x, y, settings]);
        this.pos.z = 5;
        this.anchorPoint.set(0, 0);
    },


    onClick: function(event){
        if (this.getCurrentAnimationFrame() < 5){
            this.setAnimationFrame(5);

            me.game.viewport.shake(10, 500);

            if (game.troops.length > 0){
                for(i = 0; i<game.troops.length; i++){
                    game.troops[i].patrol_walk();
                }
            } else {
                game.playScreen.spawnTroops(game.troopsQuantity, true);
            }
        } else {
            this.setAnimationFrame();

            for(i = 0; i<game.troops.length; i++){
                var index = game.troops.indexOf(i);

                me.game.world.removeChild(game.troops[i]);
            }

            game.troops = [ ];
        }

        return false;
    }
});


game.HUD.CoinImage = me.Sprite.extend({
    init: function(x, y){
        var settings = {};
        settings.image = "coin";
        settings.framewidth = 64;
        settings.frameheight = 64;

        this._super(me.Sprite, 'init', [x, y, settings]);

        this.anchorPoint.set(0, 0);
    }
});

game.HUD.CoinText = me.Renderable.extend({
    init: function(x, y) {
        this._super(me.Renderable, 'init', [x, y]);

        this.font = new me.Font("Arial", 25, "white");
        this.font.textAlign = "left";
        this.font.textBaseline = "middle";
        this.font.bold();
        this.anchorPoint.set(0.5, 0.5);
        this.coin = -1;
    },

    update : function () {
        this.coin = game.data.coin;
        return true;
    },

    draw : function (context) {
        var width = me.game.viewport.getWidth();
        var height = me.game.viewport.getHeight();

        this.font.draw (context, this.coin, 80, 40);
    }
});
