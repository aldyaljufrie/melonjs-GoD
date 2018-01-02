Array.min = function( array ){
    return Math.min.apply( Math, array );
};

game.TowerEntity = game.Unit.extend({

    init:function (x, y, settings) {
        settings.unitType = 'tower';
        settings.tower = true;
        settings.maxHP = 10;
        settings.width = 140;
        settings.height = 200;
        this._super(game.Unit, 'init', [x, y , settings]);

        this.isBuilt = false;
        this.allowShoot = false;
        this.bulletVel = 0.5;
        this.targetWidth = 32 + 10; //settings.spritewidth + 10;

        this.attackDamage = 1;
        //this.setVelocity( 0.3, 0.3 );

        this.maxTargetingDist = 350;
        this.giveUpDist = 400;

        this.attackCooldownMax = 500;
        this.setAttackRange(300);

        this.anchorPoint.set(0.5, -0.5);

        this._buildBtn = new me.Sprite (this.pos.x, this.pos.y,   
        { image: "build-button", framewidth: 32, frameheight: 32});
        this._buildBtn.anchorPoint.set(0, 0);

        me.game.world.addChild(this._buildBtn, 50);

        me.input.registerPointerEvent('pointerdown', this, this.onPointerDown.bind(this));
        me.input.registerPointerEvent('pointerup', this, this.onPointerUp.bind(this));
        me.input.registerPointerEvent("pointerenter", this, this.onPointerEnter.bind(this));
        me.input.registerPointerEvent("pointerleave", this, this.onPointerLeave.bind(this));
    },

    // update: function(dt){
    //     this._super(me.Entity, 'update', [dt]);

    //     if (this.isBuilt){
    //         var target = this.getNearestEnemy();

    //         if (target != null){
    //             if (this.allowShoot){
    //                 this.shootEnemy(this.pos.x, this.pos.y, target, this);
    //                 this.allowShoot = false;
    //             }
    //         }
    //     }

    //     return false;
    // },

    attack: function(t) {
        var targetVec = new me.Vector2d(t.pos.x, t.pos.y);
        var success = false;

        var target = targetVec;
        this.shoot(target.x, target.y, {});
        success = true;

        // if (Math.abs(targetVec.x) < this.targetWidth) {
        //     this.shoot(0, this.bulletVel * ((t.pos.y > this.pos.y) ? 1 : -1), {});
        //     success = true;
        // }
        // else if (Math.abs(targetVec.y) < this.targetWidth) {
        //     this.shoot(this.bulletVel * ((t.pos.x > this.pos.x) ? 1 : -1), 0, {});
        //     success = true;
        // }

        return success;
    },

    shoot: function(velX, velY, settings) {
        if (this.isBuilt){
            var pos = new me.Vector2d(this.pos.x, this.pos.y);
            settings.caster = this;
            settings.damage = this.attackDamage;

            var bullet = me.pool.pull("towerArrow", velX, velY, settings);
            // bullet.setDir(velX, velY);

            me.game.world.addChild(bullet);
            me.game.world.sort();

            // if (this.shootSound) {
            //     me.audio.play(this.shootSound);
            // }
            // else {
            //     utility.assert("Units that shoot should have a shoot sound ya dingus!");
            // }
        }
    },

    // check nearest enemy
    getNearestEnemy: function(){
        var dist;
        var distArr = [ ];
        for(i = 0; i<game.troops.length; i++){
            dist = this.pos.distance(game.troops[i].pos)
            distArr.push(dist);
            if (dist == Array.min(distArr)){
                if (dist < 200){
                    return game.troops[i];
                }
            }
        }
        var min = Array.min(distArr);
        return;
    },

    shootEnemy: function(x, y, target, base){
        var action = me.pool.pull("towerArrow", x - game.Projectiles.width, y - game.Projectiles.height, 
            {x: target.pos.x, y: target.pos.y},
            {x: base.pos.x, y: base.pos.y});
        me.game.world.addChild(action);

        me.timer.setTimeout(function(){
            this.allowShoot = true;
            me.game.world.removeChild(action);
        }.bind(this), 1500);
    },

    onPointerDown: function(pointer){
        if (!this.isBuilt){
            this.buildTower();
        }
    },

    onPointerUp: function(pointer){

    },

    onPointerEnter : function(pointer) {
        // console.log(this);
        // this.shootEnemy(this.pos.x, this.pos.y, 10);
    },

    onPointerLeave : function(pointer) {
        
    },

    buildTower: function(){
        if (game.data.coin >= 200){
            this.renderable = this.texture.createAnimationFromName([0, 1, 2, 3, 4, 5, 6, 7, 8, 9, 10, 11]);
            this.renderable.addAnimation( "level0", [ 0 ] );
            this.renderable.addAnimation( "level1", [ 1 ] );
            this.renderable.addAnimation( "level2", [ 2 ] );
            this.renderable.addAnimation( "level3", [ 3 ] );
            this.renderable.addAnimation( "level4", [ 4 ] );
            this.renderable.addAnimation( "level5", [ 5 ] );
            this.renderable.addAnimation( "level6", [ 6 ] );
            this.renderable.addAnimation( "level7", [ 7 ] );
            this.renderable.addAnimation( "level8", [ 8 ] );
            this.renderable.addAnimation( "level9", [ 9 ] );
            this.renderable.addAnimation( "level10", [ 10 ] );
            this.renderable.addAnimation( "level11", [ 11 ] );

            this.renderable.setCurrentAnimation("level0");
            this.pos.z = 5;
            this.healthbar = new me.Sprite (this.pos.x, this.pos.y - 130,   
            { image: me.loader.getImage("healthbar"), framewidth: 72, frameheight: 4});

            this.healthbar.addAnimation ("show",  [0]);
            this.healthbar.setCurrentAnimation("show");
            this.healthbar.anchorPoint.set(0.5, 0);

            me.game.world.addChild(this.healthbar, 1000);
            me.game.world.removeChild(this._buildBtn);
            game.data.coin -= 200;
            this.isBuilt = true;
            this.allowShoot = true;
        }
    }
});