import { Component, Property } from '@wonderlandengine/api';
import { HowlerAudioSource } from '@wonderlandengine/components';
import { CanvasUI } from './CanvasUI.js';
import { state } from './game.js';

// TODO Add other HUD features for the user to interact with
export class UIHandler extends Component {
    static TypeName = "uiHandler";
    static Properties = {
        panel: Property.enum(['simple', 'buttons', 'scrolling', 'images', 'input-text', 'simple2'], 'simple')
    };

    static onRegister(engine) {
        engine.registerComponent(HowlerAudioSource);
    }

    init() {
        // these fnctions are members of state, and used to get the elements as string objects
        // as Wonderland seems  to not like "${ state.health}" for reasons I don't understand
        this.hp = state.getHealth();
        this.currency = state.getCurrency();
        console.log(this.object.name);

        this.target = this.object.getComponent('cursor-target');
        this.target.addHoverFunction(this.onHover.bind(this));
        this.target.addUnHoverFunction(this.onUnHover.bind(this));
        this.target.addMoveFunction(this.onMove.bind(this));
        this.target.addDownFunction(this.onDown.bind(this));
        this.target.addUpFunction(this.onUp.bind(this));

        this.soundClick = this.object.addComponent(HowlerAudioSource, { src: 'sfx/click.wav', spatial: true });
        this.soundUnClick = this.object.addComponent(HowlerAudioSource, { src: 'sfx/unclick.wav', spatial: true });

        switch (this.panel) {
            case 0://simple
                this.simplePanel();
                break;
            case 1://buttons
                this.buttonsPanel();
                break;
            case 2://scrolling
                this.scrollPanel();
                break;
            case 3://images
                this.imagePanel();
                break;
            case 4://input-text
                this.inputTextPanel();
                break;
            case 5://simple2
                this.simplePanel2();
                break;
        }
    }

    // this is the code for the Health and currency HUD 
    simplePanel() {
        const config = {
            body: {
                fontSize: 50,
                type: "text",
                position: { top: 10 },
                paddingTop: 50,
                height: 256
            },
        }
        // TODO  figure out why \n doesnt work for newline functions
        const content = { body: "Health: " + state.getHealth() + "\rMoney: " + state.getCurrency() };
        this.ui = new CanvasUI(content, config, this.object, this.engine);
        this.ui.updateConfig(this, config.height, 100);
        let ui = this.ui;
    }

    simplePanel2() {
        const config = {
            body: {
                fontSize: 50,
                type: "text",
                position: { top: 10 },
                paddingTop: 50,
                height: 256
            },
        }
        // TODO  figure out why \n doesnt work for newline functions
        const content = { body: "blarfh: " + "\rMoney: " };
        this.ui = new CanvasUI(content, config, this.object, this.engine);
        this.ui.updateConfig(this, config.height, 100);
        let ui = this.ui;
    }

    buttonsPanel() {
        function defaultTurret() {
            const msg = "default";
            console.log(msg);
            ui.updateElement("info", msg);
            state.selectedTurret = "default";
        }

        function droneTurret() {
            const msg = "drone";
            console.log(msg);
            ui.updateElement("info", msg);
            state.selectedTurret = "drone";
        }

        function laser() {
            const msg = "laser";
            console.log(msg);
            ui.updateElement("info", msg);
            state.selectedTurret = "laser";
        }


        const content = {
            info: "",
            defaultTurret: "<path>M 10 32 L 54 10 L 54 54 Z</path>",
            droneTurret: "<path>M 50 15 L 15 15 L 15 50 L 50 50 Z<path>",
            laser: "<path>M 54 32 L 10 10 L 10 54 Z</path>",
        }

        this.ui = new CanvasUI(content, config, this.object, this.engine);
        this.ui.update();
        let ui = this.ui;
    }

    scrollPanel() {
        const config = {
            body: {
                backgroundColor: "#666"
            },
            txt: {
                type: "text",
                overflow: "scroll",
                position: { left: 20, top: 20 },
                width: 460,
                height: 400,
                backgroundColor: "#fff",
                fontColor: "#000"
            }
        }

        const content = {
            txt: "This is an example of a scrolling panel. Select it with a controller and move the controller while keeping the select button pressed. In an AR app just press and drag. If a panel is set to scroll and the overflow setting is 'scroll', then a scroll bar will appear when the panel is active. But to scroll you can just drag anywhere on the panel. This is an example of a scrolling panel. Select it with a controller and move the controller while keeping the select button pressed. In an AR app just press and drag. If a panel is set to scroll and the overflow setting is 'scroll', then a scroll bar will appear when the panel is active. But to scroll you can just drag anywhere on the panel."
        }

        this.ui = new CanvasUI(content, config, this.object, this.engine);
        this.ui.update();
        let ui = this.ui;
    }

    imagePanel() {
        const config = {
            image: {
                type: "img",
                position: { left: 20, top: 20 },
                width: 472
            },
            info: {
                type: "text",
                position: { top: 300 }
            }
        }

        const content = {
            image: "images/promo.png",
            info: "The promo image from the course: Learn to create WebXR, VR and AR, experiences using Wonderland Engine"
        }


        this.ui = new CanvasUI(content, config, this.object, this.engine);
        this.ui.update();
        let ui = this.ui;
    }

    inputTextPanel() {
        function onChanged(txt) {
            console.log(`message changed: ${txt}`);
        }

        function onEnter(txt) {
            console.log(`message enter: ${txt}`);
        }

        const config = {
            panelSize: { width: 1, height: 0.25 },
            height: 128,
            message: {
                type: "input-text",
                position: { left: 10, top: 8 },
                height: 56,
                width: 492,
                backgroundColor: "#ccc",
                fontColor: "#000",
                onChanged,
                onEnter
            },
            label: {
                type: "text",
                position: { top: 64 }
            }
        }

        const content = {
            message: "",
            label: "Select the panel above."
        }

        this.ui = new CanvasUI(content, config, this.object, this.engine);

        const target = this.ui.keyboard.object.getComponent('cursor-target');
        target.addHoverFunction(this.onHoverKeyboard.bind(this));
        target.addUnHoverFunction(this.onUnHoverKeyboard.bind(this));
        target.addMoveFunction(this.onMoveKeyboard.bind(this));
        target.addDownFunction(this.onDown.bind(this));
        target.addUpFunction(this.onUpKeyboard.bind(this));

        this.ui.update();
        let ui = this.ui;
    }

    onHover(_, cursor) {
        //console.log('onHover');
        if (this.ui) {
            const xy = this.ui.worldToCanvas(cursor.cursorPos);
            this.ui.hover(0, xy);
        }

        if (cursor.type == 'finger-cursor') {
            this.onDown(_, cursor);
        }

        this.hapticFeedback(cursor.object, 0.5, 50);
    }

    onMove(_, cursor) {
        if (this.ui) {
            const xy = this.ui.worldToCanvas(cursor.cursorPos);
            this.ui.hover(0, xy);
        }

        this.hapticFeedback(cursor.object, 0.5, 50);
    }

    onDown(_, cursor) {
        console.log('onDown');
        this.soundClick.play();

        this.hapticFeedback(cursor.object, 1.0, 20);
    }

    onUp(_, cursor) {
        console.log('onUp');
        this.soundUnClick.play();

        if (this.ui) this.ui.select(0, true);

        this.hapticFeedback(cursor.object, 0.7, 20);
    }

    onUnHover(_, cursor) {
        console.log('onUnHover');

        if (this.ui) this.ui.hover(0);

        this.hapticFeedback(cursor.object, 0.3, 50);
    }

    onHoverKeyboard(_, cursor) {
        //console.log('onHover');
        if (!this.ui || !this.ui.keyboard || !this.ui.keyboard.keyboard) return;

        const ui = this.ui.keyboard.keyboard;
        const xy = ui.worldToCanvas(cursor.cursorPos);
        ui.hover(0, xy);

        if (cursor.type == 'finger-cursor') {
            this.onDown(_, cursor);
        }

        this.hapticFeedback(cursor.object, 0.5, 50);
    }

    onMoveKeyboard(_, cursor) {
        if (!this.ui || !this.ui.keyboard || !this.ui.keyboard.keyboard) return;

        const ui = this.ui.keyboard.keyboard;
        const xy = ui.worldToCanvas(cursor.cursorPos);
        ui.hover(0, xy);

        this.hapticFeedback(cursor.object, 0.5, 50);
    }

    onUpKeyboard(_, cursor) {
        console.log('onUpKeyboard');
        this.soundUnClick.play();
        if (this.ui && this.ui.keyboard && this.ui.keyboard.keyboard) this.ui.keyboard.keyboard.select(0);
        this.hapticFeedback(cursor.object, 0.7, 20);
    }

    onUnHoverKeyboard(_, cursor) {
        console.log('onUnHoverKeyboard');

        if (this.ui && this.ui.keyboard && this.ui.keyboard.keyboard) this.ui.keyboard.keyboard.hover(0);

        this.hapticFeedback(cursor.object, 0.3, 50);
    }

    hapticFeedback(object, strength, duration) {
        const input = object.getComponent('input');
        if (input && input.xrInputSource) {
            const gamepad = input.xrInputSource.gamepad;
            if (gamepad && gamepad.hapticActuators) gamepad.hapticActuators[0].pulse(strength, duration);
        }
    }

    // if needsUpdate is called will nilly to update the health and currency, then 
    // eventually the hud breaks so now any changes to the hud only update when 
    // changed. 
    update(dt) {
        if (state.needsUpdate === true) {
            this.ui.content = { body: "Health: " + state.getHealth() + "\r\\nMoney: " + state.getCurrency() };
            this.ui.needsUpdate = true;
            state.needsUpdate = false;
        }
        if (this.ui) this.ui.update();
        if (this.ui2) this.ui2.update();
    }
}
