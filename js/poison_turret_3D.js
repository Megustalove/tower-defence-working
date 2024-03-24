import { Component, Object3D, Property, Type } from '@wonderlandengine/api';
import { Turret3D } from './Turret3D';
import { state } from './game';
/**
 * poison_turret_3D
 */


export class PoisonTurret3D extends Turret3D {
  static TypeName = 'poison_turret_3D';
  static Properties = {
    test: { type: Type.String, default: 'test' },
  };
  static x = function () {
    console.log('test');
  };

  init() {
    this.x = function () {
      console.log('test');
    };
    state.poisonTurret3D = this;
  }
}
