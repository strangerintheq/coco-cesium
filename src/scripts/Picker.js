var Cesium = window.Cesium;
var Events = require('./Events');

new Cesium.ScreenSpaceEventHandler(engine.scene.canvas)
    .setInputAction(moveHandler, Cesium.ScreenSpaceEventType.MOUSE_MOVE);

function moveHandler(movement) {
    pickEllipsoidAndPostEventWithLocation(movement.endPosition, Events.LOCATION_CHANGED);
    pickObjectAndPostEventWithId(movement.endPosition, Events.OBJECT_MOUSE_OVER);
}

new Cesium.ScreenSpaceEventHandler(engine.scene.canvas)
    .setInputAction(clickHandler, Cesium.ScreenSpaceEventType.LEFT_CLICK);

function clickHandler(click) {
    pickEllipsoidAndPostEventWithLocation(click.position, Events.LOCATION_CLICK);
    pickObjectAndPostEventWithId(click.position, Events.OBJECT_MOUSE_CLICK);
}


function pickEllipsoidAndPostEventWithLocation(position, event){
    var cartesian = engine.camera.pickEllipsoid(position, engine.scene.globe.ellipsoid);
    if (cartesian) {
        var cartographic = Cesium.Cartographic.fromCartesian(cartesian);
        Events.post(event, {
            longitude: Cesium.Math.toDegrees(cartographic.longitude).toFixed(10),
            latitude: Cesium.Math.toDegrees(cartographic.latitude).toFixed(10),
            altitude: cartographic.height
        });
    }
}

function pickObjectAndPostEventWithId(position, event) {
    var object = engine.scene.pick(position);
    if (Cesium.defined(object) && object.id) {
        Events.post(event, object.id.id || object.id);
    }
}
