import {Component,Type, Property} from '@wonderlandengine/api';
import { state } from './game';
/**
 * Ore
 */
export class Ore extends Component {
    static TypeName = 'Ore';
    /* Properties that are configurable in the editor */
    static Properties = {
        max: Property.float(500.0)
    };

    start() {
        console.log('start() with param', this.param);
        state.ore.push(this);
        console.log(this.object);
    }

    update(dt) {
        console.log(this.max);
        if (this.max <= 0) { state.ore.delete(this); }
    }
}
