game.PathEntity = game.Unit.extend({
    
    init: function(x, y, settings){
        settings.unitType = 'troop';
        settings.tower = false;
        settings.maxHP = 5;
        settings.width = 32;
        settings.height = 32;
        this._super(game.Unit, 'init', [x, y , settings]);

        this.targetWidth = 32 + 10; //settings.spritewidth + 10;
        this.attackDamage = 1;

        this.maxTargetingDist = 350;
        this.giveUpDist = 400;

        this.attackCooldownMax = 1000;
        this.setAttackRange(10);

        this.anchorPoint.set(0.5, 0.5);

        this._patrol_path = [ ];

        this.body.collisionType = game.collisionTypes.TROOPS;
        this.body.setCollisionMask(
            me.collision.types.ENEMY_OBJECT |
            me.collision.types.WORLD_SHAPE
        );
    },

    initAnimations: function(){
        this.renderable.addAnimation( "attacking", [ 7,8,9,10 ] );
        this.renderable.addAnimation( "idle", [ 23,23,23,24,25,26,26,26,27 ] );
        this.renderable.addAnimation( "walk", [ 0, 1, 2, 3 ] );
        this.renderable.addAnimation( "hit", [ 4 ] );
        this.renderable.animationspeed = 100;
        this.resTimer = 1500;
    },
    /**
     * Add a point to the end of the path
     * @param {me.Vector2d} point
     */
    patrol_addPoint: function( p ) {
        var rand = (-20).random(20);
        var target = {
            x: p.x + rand,
            y: p.y + rand
        }
        this._patrol_path.push( target );
    },
        
    /**
     * Start walking
     */
    patrol_walk: function( ) {
        this._isWalking = true;
        
        if( !this._target && this._patrol_path[ 0 ] ) {
            this._target = this._patrol_path[ 0 ];          
        }
        
        this._setDirection(this._target.x - this.pos.x, this._target.y - this.pos.y);      
        // this.renderable.setCurrentAnimation( this.direction ); 
    },

    /**
     * Stop walking
     */
    patrol_stop: function( ) {
        this._isWalking = false;
    },
    
    /**
     * Set reverse.
     * When is reverse, the movement is there and back
     * @param {boolean}
     */
    patrol_setReverse: function( isReverse ) {
        this._patrol_isReverse = isReverse;
    },
    
    /**
     * Set infinite.
     * When is infinite, the movement is in an endless loop
     * @param {boolean}
     */
    patrol_setInfinite: function( isInfinite ) {
        this._patrol_isInfinite = isInfinite;
    },

    /**
     * Calculate step for every update
     * @private
     */
    _calculateStep: function( ) {

        if( this._target ) {
            // console.log(this._target);
            var dx = this._target.x - this.pos.x;
            var dy = this._target.y - this.pos.y;

            if( Math.abs( dx ) < this.body.maxVel.x && Math.abs( dy ) < this.body.maxVel.y ) {
                var idx = this._patrol_path.indexOf( this._target );

                //next point index
                idx++;
            
                if( idx == ( this._patrol_path.length ) ) {
                    delete this._target;
                                        
                    /* callback */
                    if(typeof this.afterPatrolFinished === 'function'){
                        this.afterPatrolFinished();
                    }
                    
                    if( this._patrol_isReverse ){
                        this._patrol_path.reverse( );                       
                    }
                    
                    if( this._patrol_isInfinite){
                        this.patrol_walk( );
                    }
                                        
                } else {
                    this._target = this._patrol_path[ idx ];
                    this._setDirection(this._target.x - this.pos.x, this._target.y - this.pos.y);      
                    this.renderable.setCurrentAnimation( this.direction ); 
                }

                return;
            }

            var angle = Math.atan2( dy, dx );
            this.body.vel.x += Math.cos( angle ) * this.body.accel.x * me.timer.tick;
            this.body.vel.y += Math.sin( angle ) * this.body.accel.y * me.timer.tick;

        } else {
            this.body.vel.x = 0;
            this.body.vel.y = 0;
        }
    },
    
    /**
     * Set direction
     * @private
     * @param {number} dx
     * @param {number} dy
     */
    _setDirection: function( dx, dy ) {
        if( Math.abs( dx ) > Math.abs( dy ) ) {
            this.direction = ( dx > 0 ) ? "right" : "left";

        } else {
            this.direction = ( dy > 0 ) ? "down" : "up";
        }
    },
    
    update: function(dt) {
        this._calculateStep( );

        this.body.update(dt);
        this.alwaysUpdate = true;

        // me.collision.check(this);

        // console.log(this.healthbar);
        this.healthbar.pos = this.pos;
        // update animation if necessary
        if (this.body.vel.x !== 0 || this.body.vel.y !== 0) {
            this._super(me.Entity, "update", [dt]);
            return true;
        }
    },

    onCollision: function(response, other){
        if (response.b.body.collisionType == this.body.collisionType){
            // this.patrol_stop();
        }
        return true;
    }
});

/**
 * Troops Entity
 */
game.TroopsEntity = game.PathEntity.extend({

    init:function (x, y, settings) {
        
        this._super(game.PathEntity, 'init', [x, y, settings]);
    
        this.renderable.addAnimation( "down", [ 1, 2, 3 ] );
        this.renderable.addAnimation( "left", [ 13, 14, 15 ] );
        this.renderable.addAnimation( "right", [ 23, 24, 25 ] );
        this.renderable.addAnimation( "up", [ 33, 34, 35 ] );

        this.body.gravity = 0;

        this.body.setVelocity(1, 0.5);
        this.body.setMaxVelocity(1.5, 1);
        this.body.setFriction(0.5, 0.1);

        this.patrol_addPoint(new me.Vector2d(2238.7297542211327,1046.2444014656362));
        this.patrol_addPoint(new me.Vector2d(1910.7820418028323,1210.2182576747864));
        this.patrol_addPoint(new me.Vector2d(1776.9258326525055,1279.3772990691218));
        this.patrol_addPoint(new me.Vector2d(1645.3005603213508,1213.5646629035446));
        this.patrol_addPoint(new me.Vector2d(1450.0935886437908,1115.4034428599716));
        this.patrol_addPoint(new me.Vector2d(1746.8081855936819,970.3925496137842));
        this.patrol_addPoint(new me.Vector2d(1844.9694056372548,923.5428764111698));
        this.patrol_addPoint(new me.Vector2d(1751.2700592320261,877.8086716181415));
        this.patrol_addPoint(new me.Vector2d(1514.7907563997821,766.2618306595359));
        // callback
        this.afterPatrolFinished = function(){
            console.log("patrol finished");
        };

        this.healthbar = new me.Sprite (this.pos.x, this.pos.y,   
        { image: me.loader.getImage("troopsHealthbar"), framewidth: 48, frameheight: 4});

        this.healthbar.addAnimation ("show",  [0]);
        this.healthbar.setCurrentAnimation("show");
        this.healthbar.anchorPoint.set(0.2, 2);

        me.game.world.addChild(this.healthbar, 1000);
        
        this.patrol_walk();
    },
});