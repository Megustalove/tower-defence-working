import { CollisionEventType, Component, Property } from '@wonderlandengine/api';
import { state } from './game';

/**
 * Turretaimer
 */
export class TurretAimer extends Component {
  static TypeName = 'turret-aimer';
  /* Properties that are configurable in the editor */
  static Properties = {};
  start() {
    console.log('start() with param', this.param);
  }
  init() {
    this.timer = 0;
    this.hits = 0;
  }
  seek() {
    const collision = this.object.getComponent('collision');
    const overlaps = collision.queryOverlaps();
    for (const coll of overlaps) {
      if (coll.object.name === 'dave') {
        if (
          this.object.target === null ||
          this.object.target.walked < coll.object.walked
        ) {
          this.object.target = coll.object;
        } else {
          this.object.target = null;
        }
      }
    }
  }
  checkStatus() {
    if (this.object.status != '') {
      this.object.target.poisoned = true;
      this.object.target.poisonStack += 1;
    }
  }
  checkDead() {
    if (this.object.target.health <= 0) {
      state.currency += this.object.target.value + state.bonus;
      this.object.target.destroy();
      state.needsUpdate = true;
      state.enemiesDestroyed++;
    }
  }
  fire() {
    let target_location = new Float32Array(3);
    // this part of the code checks to make sure the target is still in range, and then shoots
    // at the target and deletes it if the target is at less than or equal to 0 hp
    const collision = this.object.getComponent('collision');
    const overlaps = collision.queryOverlaps();
    let fired = false;
    for (const coll of overlaps) {
      if (fired == false && coll.object === this.object.target) {
        this.object.turret.lookAt(
          this.object.target.enem.getPositionWorld(),
          [0, 1, 0]
        );
        if (this.timer > this.object.cd) {
          // currently shoot just launches the object in the direction of the target, whether or not the
          // projectile hits the target is irrelevant, damage is calculated here

          this.object.shoot(this.object.turret.getForwardWorld(target_location));
          this.object.target.health -= this.object.damage;
          // currently the only status in the game is poison, so this code automatically sets the target to poisoned
          // future status effects will need to be added here
          this.checkStatus();
          this.timer = 0;
          // this code checks to see if the target is dead from the initial shot
          // there is also calls to delete the object in other files (Waypoint.js, and enemyspawner.js)
          // any code that cares about an enemy being destroyed needs to be added to all of them
          this.checkDead();
        }
        fired = true;
      }
    }
    // if the target was not fired at, it means there was no target in range, so the target is set to null
    if (!fired) {
      this.object.target = null;
    }
  }

  update(dt) {
    this.timer += dt;
    // this function checks to see if there is an enemy target in default range
    if (this.object.target == null || this.object.target.objectId < 0) {
      this.seek();

    }
    // if there is a target in range, makes the turret look at and then fire at said target,
    // TODO find some way to lock the non Y axis rotation
    if (this.object.target && this.object.target.isDestroyed == false) {
      this.fire();
    }
  }
}
