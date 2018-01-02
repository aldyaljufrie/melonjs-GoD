game.Projectiles = game.Projectiles || {};

game.Projectiles.TowerArrow = me.Entity.extend({
    init: function(x, y, settings) {
        settings = settings || {};
        settings.image = settings.image || "bullet";
        settings.spritewidth = settings.spritewidth || 8;
        settings.spriteheight = settings.spriteheight || 8;
        settings.height = 8;
        settings.width = 8;

        this.bigExplode = settings.bigExplode || false;

        this.killspot = settings.killspot;

        this._super(me.Entity, 'init', [x, y , settings]);
        this.damage = settings.damage || 2;
        this.caster = utility.assert(settings.caster,"must specify a caster");

        this.tower = this.caster.tower;
        this.baddie = this.caster.baddie;
        this.body.setVelocity(0, 0);

        this.alwaysUpdate = true;
        this.collidable = true;
        this.z = 300;
        this.body.gravity = 0;
        this.angle;

        this.anchorPoint.set(0.5, 0.5);
    },

    onCollision: function(pos, obj) {
        //|| (!this.tower && obj.player)
        if( (obj.tower != this.tower && obj.baddie != this.baddie ) ) {
            // obj.damage(this.damage, this.caster);
            this.die();

            if (this.killspot) {
                me.audio.play("magic-hit");
            }
        }
    },

    setDir: function(x, y) {
        // this.body.vel.x = x;
        // this.body.vel.y = y;

        this.angle = Math.atan2(y - this.body.pos.y, x - this.body.pos.x);
        this.body.setVelocity(Math.cos(this.angle) * 3, Math.sin(this.angle) * 3);
        // this.body.vel.x = this.body.accel.x * me.timer.tick;
        // this.body.vel.y = this.body.accel.y * me.timer.tick;
    },

    die: function(){
        this.collidable = false;
        me.game.world.removeChild(this);

        if(this.bigExplode){
            // var particle = new ExplodeBigParticle(this.pos.x-32, this.pos.y-32);
            // me.game.world.addChild(particle);
        }else{
            // var particle = new ExplodeSmallParticle(this.pos.x-8, this.pos.y-8);
            // me.game.world.addChild(particle);
        }
    },

    update: function( dt ) {
        this.body.update(dt);
        this.alwaysUpdate = true;

        me.collision.check(this);
        this._super(me.Entity, "update", [dt]);

        if (!this.inViewport && (this.pos.y > me.game.viewport.height)) {
            // if yes reset the game
            this.die();
        }
        if( this.body.vel.x == 0 && this.body.vel.y ==0 ) {
            // we hit a wall?
            this.die();
        }
        if (this.killspot && this.killspot.distance(this.pos) < 5) {
            this.die();
            // Add explosion here?
        }

        return true;
    }

});

game.Projectiles.width = 8;
game.Projectiles.height = 8;