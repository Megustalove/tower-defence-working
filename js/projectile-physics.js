/*
    Copyright 2021. Futurewei Technologies Inc. All rights reserved.
    Licensed under the Apache License, Version 2.0 (the "License");
    you may not use this file except in compliance with the License.
    You may obtain a copy of the License at
    http:  www.apache.org/licenses/LICENSE-2.0
    Unless required by applicable law or agreed to in writing, software
    distributed under the License is distributed on an "AS IS" BASIS,
    WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
    See the License for the specific language governing permissions and
    limitations under the License.
*/

import { Component, Type } from "@wonderlandengine/api";
import { vec3 } from "gl-matrix";
import { state } from "./game";
/**
@brief Controls the bullet trajectory

Deactivates bullet updates to preserve performance. Bullets collision is also
deactivated when the bullet is on the ground. This is done to prevent the 
score-trigger going off when the mice run over the bullets.
*/

let newDir = new Float32Array(3);
export class ProjectilePhysics extends Component {
    static TypeName = "projectile-physics";
    static Properties = {
        speed: { type: Type.Float, default: 9.0 },
    }

    init() {
        // Sets position, scale, speed, and gets the collision box of the object
        this.dir = new Float32Array(3);
        this.position = [0, 0, 0];
        this.object.getPositionWorld(this.position);
        this.object.setScalingWorld([.1, .1, .1]);
        this.correctedSpeed = this.speed * 5;
        this.collision = this.object.getComponent('collision');
        if (!this.collision) {
            console.warn(
                "bullet-physics' component on object",
                this.object.name,
                "requires a collision component"
            );
        }
    }
    update(dt) {
        if (isNaN(dt)) {
            console.log("dt is NaN");
            return;
        }
        //deactivate bullet if travel distance too far
        if (vec3.length(this.position) > 175) {
            this.destroyBullet(0);
            return;
        }

        newDir.set(this.dir);
        vec3.scale(newDir, newDir, this.correctedSpeed);
        vec3.add(this.position, this.position, newDir);
        this.object.setPositionLocal(this.position);
        let overlaps = this.collision.queryOverlaps();
        if( overlaps.length > 0) {
            if(overlaps[0].object.name === "centermass")
            {
            console.log(overlaps[0].object.parent.name);
            }
            
            this.destroyBullet(0);
            return;

        }
    }
    destroyBullet(time) {
        if (time == 0) {
            this.object.destroy();
        } else {
            setTimeout(() => {
                this.object.destroy()
            }, time);
        }
    }
};