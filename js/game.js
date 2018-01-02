var game = {

    data : {
        coin : 1000
    },

    collisionTypes : {
        TROOPS : me.collision.types.USER << 0,
        TOWER   : me.collision.types.USER << 1
    },


    // Run on page load.
    "onload" : function () {
        // Initialize the video.
        if (!me.video.init(1024, 720, {wrapper : "screen", scale : "auto"})) {
            alert("Your browser does not support HTML5 canvas.");
            return;
        }

        // Initialize the audio.
        me.audio.init("mp3,ogg");

        // set and load all resources.
        // (this will also automatically switch to the loading screen)
        me.loader.preload(game.resources, this.loaded.bind(this));
    },

    // Run on game resources loaded.
    "loaded" : function () {
        me.state.set(me.state.MENU, new game.TitleScreen());

        // add our player entity in the entity pool
        me.pool.register("BaseEntity", game.BaseEntity);
        me.pool.register("SpawnerEntity", game.SpawnerEntity);
        me.pool.register("TowerEntity", game.TowerEntity);
        me.pool.register("troopsEntity", game.TroopsEntity, true);
        me.pool.register("towerArrow", game.Projectiles.TowerArrow);

        me.input.bindKey(me.input.KEY.LEFT,  "left");
        me.input.bindKey(me.input.KEY.RIGHT, "right");
        me.input.bindKey(me.input.KEY.UP,    "up");
        me.input.bindKey(me.input.KEY.DOWN,  "down");
        me.input.bindKey(me.input.KEY.PLUS, "plus");
        me.input.bindKey(me.input.KEY.MINUS, "minus");

        // register on mouse event
        me.input.registerPointerEvent("pointermove", me.game.viewport, function (event) {
            me.event.publish("pointermove", [ event ]);
        }, false);
        me.input.registerPointerEvent("pointerdown", me.game.viewport, function (event) {
            me.event.publish("pointerdown", [ event ]);
        }, false);
        me.input.registerPointerEvent("pointerup", me.game.viewport, function (event) {
            me.event.publish("pointerup", [ event ]);
        }, false);

        // set the fade transition effect
        me.state.transition("fade","#FFFFFF", 250);

        this.playScreen = new game.PlayScreen();
        me.state.set(me.state.PLAY, this.playScreen);
        me.state.change(me.state.PLAY);
    }
};

game.newBaddie = function(x, y, settings) {
    var classes = {
        'tower': 'Tower',
        'troop': 'Troop',
    };
    // #ProHacks
    return new window[classes[settings.unitType]](x, y, {
        tower: settings.tower,
        player: settings.player,

    });
};
