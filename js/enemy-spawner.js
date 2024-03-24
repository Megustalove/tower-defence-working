import { Component, Type, Property, Object3D } from '@wonderlandengine/api';
import { state } from "./game";
import { WaypointMovement } from "./waypoint-movement";
import { DefaultTurret3D } from './default_turret_3D';


/**
 * enemy-spawner
 */

const tempQuat2 = new Float32Array(8);
export class EnemySpawner extends Component {
    static TypeName = 'enemy-spawner';
    /* Properties that are configurable in the editor */
    static Properties = {
        defaultEnemy: { type: Type.Object },
        spawnTimer: { type: Type.Float, default: 3 },
        defaultHealth : { type: Type.Int, default: 50},
        defaultReward: { type: Type.Int, default: 10},
        defaultSpeed: {type: Type.Float, default: 3.0},
        defaultDamage : {type :Type.Int, default : 5},
        poisoned: { type:Type.Bool, default: false},
    };

    // The game file contains the state object, the init function adds a function
    // called spawn to the state file, assigns the calling object as the spawnpoint,
    // and instatniates the timer for spawn delay
    init() {
        this.timer = 0;
        state.EnemySpawner.push(this);
        this.name = "paul";
        state.spawn = function (object) {
            let enemy = object.spawnEnemy();
            state.currentEnemies.push(enemy);
        }.bind(this);
    }
    // Not exactly sure why we need this but we do
    static onRegister(engine) {
        engine.registerComponent(WaypointMovement);
    }
    // spawns a new enemy every 5 seconds 
    // TODO add a spawntimer function and use that instead of hardcoding the time
    update(dt) {
        this.timer += dt;
        if (this.timer > this.spawnTimer && state.pauseEnemies === false) {
            this.timer = 0;
            state.spawn(this);
        }
    }
    // TODO add a onHIt function to the object that is spawned 

    spawnEnemy() {
        // this creates an object and adds it to the current wonderland scene
        const obj = this.engine.scene.addObject();
        obj.enem = this.defaultEnemy.clone(obj);
        obj.enem.setScalingLocal([3,3,3]);
        // Sets the location of the new object to be the same as the spawn point
        obj.setTransformLocal(this.object.getTransformWorld(tempQuat2));
        // adds mesh to the new object referenving the mesh designated by the
        //spawning object in the editor
        obj.poisoned = false;
        // grants the new enemy object a collision box
        obj.addComponent("collision", {
            shape: WL.Collider.Sphere,
            extents: [5, 0, 0],
            group: (1 << 5 ),
            active: true,
        });

        // potential distance traveled for enemy selection
        obj.walked = 0;
        obj.name = "dave";
        obj.timer = 0;
        obj.poisonStack = 0;
        obj.health = this.defaultHealth;
        obj.damage = this.defaultDamage;
        obj.value = this.defaultReward;
        // create a new object that is a copt of the Waypoint Movement object 
        // belonging to the spawner
        let waypoint = this.object.getComponent(WaypointMovement);
        waypoint.speed = this.defaultSpeed;

        //This code is meant to be how we track the health of the enemies, currently not doing anything
        obj.f = function () {
            state.health -= obj.damage;
            // if state.health <= 0 state.gameOver = true;
            const index = state.currentEnemies.indexOf(obj);
            state.currentEnemies.splice(index, 1);
            state.needsUpdate = true;
            obj.destroy()
        };
        // Add the copied movement object to the new enemy, including
        // the pathObject of the parent specified in the editor

        obj.addComponent(WaypointMovement, waypoint);
        obj.setScalingLocal([.2, .2, .2]);
        obj.active = true;
        obj.setDirty();
    }
}