import { Component, Type, Property } from '@wonderlandengine/api';
import { vec3 } from "gl-matrix";
import { state } from './game';

/**
 * Miner
 */
export class Miner extends Component {
    static TypeName = 'Miner';
    /* Properties that are configurable in the editor */
    static Properties = {
        speed: { type: Type.Float, default: 1.0 },
        miningTime: { type: Type.Float, default: 1.0 },
        Ore: { type: Type.Object },
        Base: { type: Type.Object },
        Value: { type: Type.Float, default: 1.0 },
    };

    start() {

    }

    init() {
        this.isMining = false;
        this.timer = 0;
    }

    start() {
        console.log('start() with param', this.param);
    }

    update(dt) {
        /* Called every frame. */

        // Distance from object to the ore
        this.distance = vec3.distance(this.object.getPositionWorld(), state.ore[0].object.getPositionWorld());

        // Distance from object to MotherShip
        this.distance1 = vec3.distance(this.object.getPositionWorld(), this.Base.getPositionWorld());

        if (this.isMining === false) {

            console.log(state.ore[0]);

            this.object.lookAt(state.ore[0].object.getPositionWorld(), [0, 1, 0]);
            
            this.object.translateObject([0, 0, -this.speed * dt]);

            if (this.distance < 0.1) {
                this.isMining = true;
            }
        }

        if (this.isMining === true) {
            this.timer += dt;

            // Once done mining will return gold to base
            if (this.timer > this.miningTime) {
                this.object.lookAt(this.Base.getPositionWorld(), [0, 1, 0]);
                this.object.translateObject([0, 0, -this.speed * dt]);
                state.ore[0].max -= this.Value;
            }

            // Give player gold when return to base
            if (this.distance1 < 0.1) {
                state.needsUpdate = true;
                state.currency += this.Value;
                this.isMining = false;
                this.timer = 0;
            }

        }
    }
}
