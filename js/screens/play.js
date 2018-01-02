game.PlayScreen = me.ScreenObject.extend({
    /**
     *  action to perform on state change
     */
    onResetEvent: function() {
        me.levelDirector.loadLevel("map-home");
        // reset the score
        game.data.score = 0;

        this.playerArmy = [ ];
        this.baddies = [ ];

        this.onClick = false;
        this.currentPosition = {};
        this.lastPositon = {};
        this.deltaPosition = {};
        this.moveSpeed = 1;
        this.offX = me.game.viewport.width / 2;
        this.offY = me.game.viewport.height / 2;

        this.handle = me.event.subscribe(me.event.KEYDOWN, this.keyPressed.bind(this));
        this.pointerMoveEvent = me.event.subscribe("pointermove", this.pointerMoving.bind(this));
        this.pointerDownEvent = me.event.subscribe("pointerdown", this.pointerDown.bind(this));
        this.pointerUpEvent = me.event.subscribe("pointerup", this.pointerUp.bind(this));

        this.HUD = new game.HUD.Container();
        me.game.world.addChild(this.HUD, 1000);
    },

    keyPressed: function (action /*, keyCode, edge */) {

        if (action === "left") {
            this.moveCamera(me.game.viewport.pos, {x: me.game.viewport.pos.x - 100}, 100);
            return;

        } else if (action === "right") {
            this.moveCamera(me.game.viewport.pos, {x: me.game.viewport.pos.x + 100}, 100);
            return;
        }

        if (action === "up") {
            this.moveCamera(me.game.viewport.pos, {y: me.game.viewport.pos.y - 100}, 100);
            return;

        } else if (action === "down") {
            this.moveCamera(me.game.viewport.pos, {y: me.game.viewport.pos.y + 100}, 100);
            return;
        }

        if (action === "plus") {
            this.scale(+0.02);
            return;
        }

        if (action === "minus") {
            this.scale(-0.02);
            return;
        }
    },

    moveCamera: function(from, destination, t){
        var tween;
        tween = new me.Tween(from).to(destination, t);
        tween.start();

        me.game.repaint();
    },

    scale: function(scale) {
        game.data.scale += scale;
        game.data.scale = game.data.scale.round(2);

        var viewport = me.game.viewport;
        viewport.currentTransform.translate(
            viewport.width * viewport.anchorPoint.x,
            viewport.height * viewport.anchorPoint.y
        );

        viewport.currentTransform.scale(game.data.scale);
        viewport.currentTransform.translate(
            -viewport.width * viewport.anchorPoint.x,
            -viewport.height * viewport.anchorPoint.y
        );
    },

    pointerMoving : function (event) {
        this.currentPosition = {
            x : event.gameScreenX,
            y : event.gameScreenY
        };
        this.deltaPosition = {
            x : this.currentPosition.x - this.lastPositon.x,
            y : this.currentPosition.y - this.lastPositon.y
        };
        this.lastPositon = this.currentPosition;

        if (this.onClick){
            // me.game.viewport.move(event.gameScreenX + this.offX, event.gameScreenY + this.offY);
            var pos = {
                x : this.deltaPosition.x,
                y : this.deltaPosition.y
            };
            me.game.viewport.move(-pos.x * this.moveSpeed, -pos.y * this.moveSpeed);
            me.game.repaint();
        }
    },

    pointerDown : function (event) {
        this.onClick = true;
        this.currentPosition = {
            x : event.gameScreenX,
            y : event.gameScreenY
        };
        this.deltaPosition = {
            x : this.currentPosition.x - this.lastPositon.x,
            y : this.currentPosition.y - this.lastPositon.y
        };
        this.lastPositon = this.currentPosition;
    },

    pointerUp : function (event) {
        this.onClick = false;
    },

    spawnTroops : function(length, walk){
        for (i = 0; i < length; i++){
            var rand = (-50).random(50);
            var pullChild = me.pool.pull("troopsEntity", game.spawner.x + rand, game.spawner.y + rand, {width: 32, height: 32});
            var child = me.game.world.addChild(pullChild, 2);
            child.initAnimations();
            this.baddies.push(child);

            if (walk){
                // child.patrol_walk();
            }
        }
        return true;
    },

    /**
     *  action to perform when leaving this screen (state change)
     */
    onDestroyEvent: function() {
        me.event.unsubscribe(this.handle);
        me.event.unsubscribe(this.pointerMoveEvent);
        me.event.unsubscribe(this.pointerDownEvent);
        me.event.unsubscribe(this.pointerUpEvent);
        me.game.world.removeChild(this.HUD);
    }
});
