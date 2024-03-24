import { Component, Property, Type } from '@wonderlandengine/api';
import { TurretAimer } from './turret-aimer';
import { ProjectileSpawner } from './projectile-spawner';
import { state } from './game';
import { Turret3D } from './Turret3D';
/**
 * this object is called by the TurretSpawner Class, and is used to create the turrets
 * and add them to the scene. It is also used to add the turret properties to the state.
 * the turret3D object contains the information that sets the properties, any additional
 * functionality should be added to the Turret3D class using a dummy function.
 */
const tempQuat2 = new Float32Array(8);
export class Turret extends Component {
  static TypeName = 'turret';

  init() {}
  static onRegister(engine) {
    engine.registerComponent(TurretAimer);
    engine.registerComponent(ProjectileSpawner);
  }
  start() {
    state.buildT = function (turret_spawner, type) {
      if (state.currency < type.cost) return;
      console.log(type);
      state.currency -= type.cost;
      state.needsUpdate = true;
      const obj = this.engine.scene.addObject();
      obj.turret = type.turret.clone(obj);
      obj.base = type.base.clone(obj);
      // NULL objects for function/property allocation from turret spawner and aimer
      obj.target = null;
      obj.shoot = null;
      obj.status = type.status;
      obj.type = type.type;
      obj.cd = type.cd;
      obj.damage = type.damage;
      obj.bulletMesh = {
        mesh: type.bulletMesh,
        material: type.bulletMaterial,
      };
      obj.addComponent('collision', {
        collider: WL.Collider.Sphere,
        extents: [type.range, 0, 0],
        group: 1 << 5,
        // this code is a test to see how to trigger Collision Onhit and onleave that has
        // some documentation on wonderland, but I cant figre out how to use
        // IF we can get it working it would make aiming and shooting signifficantly
        //   more efficient
        CollisionEventType: 1,
        active: true,
      });

      // aimer is its own named object because of a previous version, it should just be added as
      // obj.addComponent(turretAimer) but that crrrently gives errors
      obj.addComponent(TurretAimer);
      obj.addComponent(ProjectileSpawner);
      // Sets tower position, makes it float flat independent of spawn angle, and scale
      obj.setTransformLocal(turret_spawner.object.getTransformWorld(tempQuat2));
      obj.resetRotation();
      obj.setScalingLocal([0.2, 0.4, 0.2]);
      obj.active = true;
      console.log(obj.getComponents());
      // pushes the turrets to a vector in state
      // state.turrets can be called in other classes for bugfiturret_spawnering.
      state.turrets.push(obj);
      obj.setDirty();
    }.bind(this);
    console.log(this);
  }
}
