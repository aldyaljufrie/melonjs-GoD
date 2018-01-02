game.HomeEntity = me.Entity.extend({

    init:function (x, y, settings) {
        
        var width = settings.width || settings.framewidth;
        var height = settings.height || settings.frameheight;

        this._super(me.Entity, 'init', [x, y , settings]);

        var offX = me.game.viewport.width / 2;
        var offY = me.game.viewport.height / 2;

        var posX = this.pos.x - offX;
        var posY = this.pos.y - offY

        me.game.viewport.move(posX + 150, posY + 100);
    },

    update : function (dt) {

        return true;
    }
});

game.BaseEntity = game.HomeEntity.extend({
    init: function (x, y, settings) {
        settings.image = "castle";
        this._super(game.HomeEntity, "init", [x, y, settings]);

        this.renderable.addAnimation ("stay", [0]);
        this.renderable.setCurrentAnimation("stay");
        this.anchorPoint.set(-0.1, -1);
    }
});