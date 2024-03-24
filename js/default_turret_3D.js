import { Component, Object3D, Property, Type } from '@wonderlandengine/api';
import { state } from './game';
import { Turret3D } from './Turret3D';
/**
 * default_turret_3D
 */
export class DefaultTurret3D extends Turret3D {
  static TypeName = 'default_turret_3D';
  /* Properties that are configurable in the editor */
  start() {
    state.defaultTurret3D = this;
  }
}
