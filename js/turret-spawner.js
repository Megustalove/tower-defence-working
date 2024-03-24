import { Component, Property, Type } from '@wonderlandengine/api';
import { TurretAimer } from './turret-aimer';
import { state } from './game';
import { ProjectileSpawner } from './projectile-spawner';
import { Turret } from './turret';
import { Turret3D } from './Turret3D';
import { DefaultTurret3D } from './default_turret_3D';
import { PoisonTurret3D } from './poison_turret_3D';
/**
 * turret-spawner
 * this code will allow the player to spawn turrets in the location
 * the cursor is pointing
 */
export class TurretSpawner extends Component {
  static TypeName = 'turret-spawner';
  static Properties = {};
  static onRegister(engine) {
    engine.registerComponent(TurretAimer);
    engine.registerComponent(ProjectileSpawner);
    engine.registerComponent(DefaultTurret3D);
    engine.registerComponent(Turret);
    engine.registerComponent(Turret3D);
    engine.registerComponent(PoisonTurret3D);
  }
  /// poison turret?
  init() {
    this.timer = 0;
    console.log(this.turretTemplate);
    this.name = 'dave';
    this.makeTurret = null;
    state.turretSpawner = this;
  }
  start() {
    console.log('start turret spawner');
  }
}
