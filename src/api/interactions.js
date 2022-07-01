import { v4 as uuidv4 } from "uuid";
class InteractionBase {
    constructor(eventType, timestamp, metaData) {
        this.uuid = uuidv4();
        this.event = eventType;
        this.time = timestamp;
        this.metaData = metaData;
    }
}
export class MouseInteraction extends InteractionBase {
    constructor(eventType, timestamp, mouseEvent, relatedTarget = {}, metaData = {}) {
        super(eventType, timestamp, metaData);
        this.screenX = mouseEvent.screenX;
        this.screenY = mouseEvent.screenY;
        this.clientX = mouseEvent.clientX;
        this.clientY = mouseEvent.clientY;
        this.ctrlKey = mouseEvent.ctrlKey;
        this.shiftKey = mouseEvent.shiftKey;
        this.altKey = mouseEvent.altKey;
        this.metaKey = mouseEvent.metaKey;
        this.button = mouseEvent.button;
        this.relatedTarget = relatedTarget;
        this.x = mouseEvent.screenX;
        this.y = mouseEvent.screenY;
    }
}
export class DragInteraction extends MouseInteraction {
    constructor(eventType, timestamp, dragEvent, relatedTarget = {}, metaData = {}) {
        super(eventType, timestamp, dragEvent, relatedTarget, metaData);
    }
}
class TouchBase {
    constructor(touch) {
        this.uuid = uuidv4();
        this.altitudeAngle = touch.altitudeAngle;
        this.azimuthAngle = touch.azimuthAngle;
        this.clientX = touch.clientX;
        this.clientY = touch.clientY;
        this.force = touch.force;
        this.identifier = touch.identifier;
        this.pageX = touch.pageX;
        this.pageY = touch.pageY;
        this.radiusX = touch.radiusX;
        this.radiusY = touch.radiusY;
        this.rotationAngle = touch.rotationAngle;
        this.screenX = touch.screenX;
        this.screenY = touch.screenY;
        this.target = touch.target;
        this.touchType = touch.touchType;
    }
}
export class TouchInteraction extends InteractionBase {
    constructor(eventType, timestamp, touchEvent, metaData = {}) {
        super(eventType, timestamp, metaData);
        this.changedTouches = [];
        this.targetTouches = [];
        this.touches = [];
        this.altKey = touchEvent.altKey;
        this.ctrlKey = touchEvent.ctrlKey;
        this.metaKey = touchEvent.metaKey;
        this.shiftKey = touchEvent.shiftKey;
        if (touchEvent.changedTouches && touchEvent.changedTouches.length > 0) {
            for (let i = 0; i < touchEvent.changedTouches.length; i++) {
                this.changedTouches.push(new TouchBase(touchEvent.changedTouches[i]));
            }
        }
        if (touchEvent.targetTouches && touchEvent.targetTouches.length > 0) {
            for (let i = 0; i < touchEvent.targetTouches.length; i++) {
                this.targetTouches.push(new TouchBase(touchEvent.targetTouches[i]));
            }
        }
        if (touchEvent.touches && touchEvent.touches.length > 0) {
            for (let i = 0; i < touchEvent.touches.length; i++) {
                this.touches.push(new TouchBase(touchEvent.touches[i]));
            }
        }
    }
}
export class KeyboardInteraction extends InteractionBase {
    constructor(eventType, timestamp, keyboardEvent, metaData = {}) {
        super(eventType, timestamp, metaData);
        this.altKey = keyboardEvent.altKey;
        this.code = keyboardEvent.code;
        this.isComposing = keyboardEvent.isComposing;
        this.key = keyboardEvent.key;
        this.location = keyboardEvent.location;
        this.metaKey = keyboardEvent.metaKey;
        this.repeat = keyboardEvent.repeat;
        this.shiftKey = keyboardEvent.shiftKey;
    }
}
export class GenericInteraction extends InteractionBase {
    constructor(eventType, timestamp, genericEventData, metaData = {}) {
        super(eventType, timestamp, metaData);
        this.data = genericEventData;
    }
}
//# sourceMappingURL=interactions.js.map