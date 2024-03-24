import { Component, Object3D, Property, Type } from '@wonderlandengine/api';
import { state } from './game';

// Default Turret 3D class, that all other turrets inherit from
// New turrets can be created by extending this class and adding new properties
// and editing them in the editor
export class Turret3D extends Component {
  static TypeName = 'turret_3D';
  static Properties = {
    turret: { type: Type.Object },
    base: { type: Type.Object },
    bulletMesh: { type: Type.Mesh },
    bulletMaterial: { type: Type.Material },
    cd: { type: Type.Float, default: 1 },
    range: { type: Type.Float, default: 10 },
    damage: { type: Type.Float, default: 10 },
    cost: { type: Type.Int, default: 20 },
    status: {
      type: Type.Enum,
      values: ['', 'poison', 'slow', 'stun'],
      default: '',
    },
  };
}
