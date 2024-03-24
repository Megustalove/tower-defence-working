import { Component, Property } from '@wonderlandengine/api';
import { glMatrix } from 'gl-matrix';
import { state } from './game';
/**
 * celestial-rotation
 */
const x = new Float32Array(4);
export class CelestialRotation extends Component {
  static TypeName = 'celestial-rotation';
  /* Properties that are configurable in the editor */
  static Properties = {
    param: Property.float(1.0),
    timer: Property.float(0.0),
    rotated: Property.float(0.0),
    degree: Property.float(0.05),
    skip: Property.float(0)
  };


  // Day Night is calculated based on the angles of the sun and the moon
  // changing this.degree will change how long the levels are
  // sunset is currently at 65 degrees, and sunrize is at 295 degrees
  // at 360 degrees, it is noon.

  // Currently I'm pretty sure a full rotation takes 80 seconds. 
  start(){
  state.s    = function() {
    if(state.day === true)
    {
    this.skip = .5;
    }
  }.bind(this);
};

  update(dt) {
    this.timer += dt;
    this.object.rotateAxisAngleDegObject([1, 0, 0], this.degree + this.skip);
    this.rotated += this.degree + this.skip;
    if (this.rotated > 65 && this.rotated < 295) {
      if (state.day == true) {
        state.levelUp();
        this.skip = 0;
      }
      state.pauseEnemies = false;
      state.pauseBuilding = true;
      state.day = false;
    }
    else {
      state.pauseEnemies = true;
      state.pauseBuilding = false;
      state.day = true;
    }
    if (this.rotated >= 359.95) {
      this.object.resetRotation();
      this.rotated = 0;
    }
  };

}


