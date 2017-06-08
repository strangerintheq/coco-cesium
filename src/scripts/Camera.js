var Cesium = window.Cesium;
var Cartesian3 = Cesium.Cartesian3;
var CesiumMath = Cesium.Math;
var defaultValue = Cesium.defaultValue;
var defined = Cesium.defined;


var scene = engine.scene;
var cameraController = scene.screenSpaceCameraController;
cameraController.zoomEventTypes = [Cesium.CameraEventType.WHEEL, Cesium.CameraEventType.PINCH];
cameraController.tiltEventTypes = Cesium.CameraEventType.RIGHT_DRAG;
cameraController.enableLook = false;
cameraController.minimumTrackBallHeight = -1;

var camera = scene.camera;
camera.percentageChanged = 0.1;
camera.changed.addEventListener(function() {

    var ray = camera.getPickRay(new Cesium.Cartesian2(
        Math.round(scene.canvas.clientWidth / 2),
        Math.round(scene.canvas.clientHeight / 2)
    ));

    var position = scene.globe.pick(ray, scene);
    if (Cesium.defined(position)) {
        var cartographic = Cesium.Ellipsoid.WGS84.cartesianToCartographic(position);
        Events.post(Events.LOCATION_CHANGED, cartographic);
    }
});

window.Cesium.Camera.prototype.rotateUp = function(angle) {
    angle = defaultValue(angle, this.defaultRotateAmount);
    rotateVertical(this, -angle);
};

var rotateVertScratchP = new Cartesian3();
var rotateVertScratchA = new Cartesian3();
var rotateVertScratchTan = new Cartesian3();
var rotateVertScratchNegate = new Cartesian3();

function rotateVertical(camera, angle) {
    var position = camera.position;
    var p = Cartesian3.normalize(position, rotateVertScratchP);

    if (defined(camera.constrainedAxis)) {
        var northParallel = Cartesian3.equalsEpsilon(p, camera.constrainedAxis, CesiumMath.EPSILON2);
        var southParallel = Cartesian3.equalsEpsilon(p, Cartesian3.negate(camera.constrainedAxis, rotateVertScratchNegate), CesiumMath.EPSILON2);
        if ((!northParallel && !southParallel)) {

            var constrainedAxis = Cartesian3.normalize(camera.constrainedAxis, rotateVertScratchA);

            var dot = Cartesian3.dot(p, constrainedAxis);
            var angleToAxis = CesiumMath.acosClamped(dot);
            if (angle > 0 && angle > angleToAxis) {
                angle = angleToAxis - CesiumMath.EPSILON4;
            }

            dot = Cartesian3.dot(p, Cartesian3.negate(constrainedAxis, rotateVertScratchNegate));
            angleToAxis = CesiumMath.acosClamped(dot);
            if (angle < 0 && -angle > angleToAxis) {
                angle = -angleToAxis + CesiumMath.EPSILON4;
            }

            var tangent = Cartesian3.cross(constrainedAxis, p, rotateVertScratchTan);
            camera.rotate(tangent, angle);
            //console.log(angle);
        } else if ((northParallel && angle < 0) || (southParallel && angle > 0)) {
            camera.rotate(camera.right, angle);
        }
    } else {
        camera.rotate(camera.right, angle);
    }

}


