import { Component, Type, Property } from '@wonderlandengine/api';
import { vec3 } from "gl-matrix";
import { state } from './game';

/**
 * Drone-Patrol
 */

const tempQuat2 = new Float32Array(8);
export class DronePatrol extends Component {
    static TypeName = 'Drone-Patrol';
   
    static Properties = {
        speed: { type: Type.Float, default: 1.0 },
        radius: { type: Type.Float, default: 1.0 },
        patrolLocation: { type: Type.Object },

    };

    start() {
       //this.object.getcomponent('mesh').setRotationLocal([-90, 0, 0]);
    }

    init() { 
        this.atPatrolLocation = false;
        this.atSearchPoint = true;
        this.levelEnd = false;
        this.initialPosition = this.object.getPositionWorld();
        this.timer = 0;
        this.distance1 = new Float32Array(3);
    }

    update(dt) {
        this.currentLength += dt * this.speed;
        this.object.walked += 1;

        // calculate distance between object and patrol location
        this.distance = vec3.distance(this.object.getPositionWorld(),this.patrolLocation.getPositionWorld());
      
        // when level start drone will move to a set patrol location
        if (this.atPatrolLocation === false && this.levelEnd === false) { 
            //the drone will look at and move forward to patrolLocation
            this.object.lookAt(this.patrolLocation.getPositionWorld(), [0, 1, 0]);
            this.object.translateObject([0, 0, -this.speed * dt]);

            // when it reached patrolLocation it will start searching for enemies
            if (this.distance < 0.5) { // NOTE: Distance will never be 0 
                this.atPatrolLocation = true;
            }
        }

        // start searching 
        if (this.atPatrolLocation === true) {
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
            // generate a random cordinate in a set radius every 3 second
            if (this.timer > 3 && this.atSearchPoint === true) {
                this.angle = Math.random() * Math.PI * 2;
                this.x = this.patrolLocation.getPositionWorld()[0] + Math.cos(this.angle) * this.radius;
                this.y = this.patrolLocation.getPositionWorld()[1]
                this.z = this.patrolLocation.getPositionWorld()[2] + Math.sin(this.angle) * this.radius;
                this.searchPoint = [this.x, this.y, this.z];
                this.timer = 0;
                this.atSearchPoint = false;
            }

            // move to the set cordinate
            if (this.atSearchPoint === false) {
                this.object.lookAt(this.searchPoint, [0, 1, 0]);
                this.object.translateObject([0, 0, -this.speed * dt]);

                // stop when distance < 0.1 to stop shaking
                this.distance1 = vec3.distance(this.searchPoint,this.object.getPositionWorld());
                if (this.distance1 < 0.5){
                    this.atSearchPoint = true;
                }
            }
        }

        //TODO when  level end drone will return to mothership
        if (this.levelEnd === true) { 
            // the drone will look at and move forward to mothership
            this.object.lookAt(this.initialPosition, [0, 1, 0]);
            this.object.translateObject([0, 0, -this.speed * dt]);
        }

    }
}


