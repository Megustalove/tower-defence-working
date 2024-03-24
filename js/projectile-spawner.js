import { Component, Property, Type } from '@wonderlandengine/api';
import { ProjectilePhysics } from './projectile-physics';
import { state } from './game';
/**
 * projectile-spawner
 * spawns projectiles for TURRET objects
 */
export class ProjectileSpawner extends Component {
  static TypeName = 'projectile-spawner';

  static onRegister(engine) {
    engine.registerComponent(ProjectilePhysics);
  }
  init() {
    // grants the shoot function to the Object3D that projectileSpawner is attatcehd to
    // also sets the physics object that will be attatched to the projectiles, and the direction to be launched
    console.log('Projectile spawner new+!');
    this.timer = 0;
    this.object.shoot = function (dir) {
      let projectile = this.spawn();
      projectile.physics.dir.set(dir);
      projectile.object.setDirty();
      projectile.physics.active = true;
    }.bind(this);
  }
  spawn() {
    const obj = this.engine.scene.addObject();
    let mesh = obj.addComponent('mesh', this.object.bulletMesh);
    mesh.active = true;
    obj.addComponent('collision', {
      shape: WL.Collider.Sphere,
      extents: [0.1, 0, 0],
      group: 1 << 4,
    });
    obj.name = 'steven';
    obj.setPositionLocal(this.object.turret.children[3].getPositionWorld());
    const physics = obj.addComponent(ProjectilePhysics, { speed: 0.2 });
    physics.active = true;
    return { object: obj, physics: physics };
  }
}
