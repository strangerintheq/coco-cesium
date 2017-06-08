var Cesium = window.Cesium;
var Events = require('./Events');
var LAYER_PREFIX = 'layer_';
var OBJECT_PREFIX = 'object_';

var labels = engine.scene.primitives.add(new Cesium.LabelCollection());
var layers = {};
var objects = {};

Events.listen(Events.CREATE_LAYER, function (id) {
    layers[LAYER_PREFIX + id] = {id: id, objects: []};
});

Events.listen(Events.HAS_LAYER, function (id) {
    return layers.hasOwnProperty(LAYER_PREFIX + id);
});


Events.listen(Events.CREATE_TEXT, function (text) {
    var p = text.geometry.coordinates;
    labels.add({
        id: text.id,
        position: Cesium.Cartesian3.fromDegrees(p[0], p[1], p[2] || 0),
        text: text.properties.text
    });
});

Events.listen(Events.CREATE_GEO_JSON_OBJECT, function (geoJson) {
    Cesium.GeoJsonDataSource.load(geoJson, {
        stroke: color('stroke'),
        fill: color('fill'),
        strokeWidth: geoJson.properties.width || 2,
        markerSymbol: 'x'
    }).then(function (dataSource) {
        engine.dataSources.add(dataSource);
        if (geoJson.id) objects[OBJECT_PREFIX + geoJson.id] = dataSource;
        var layer = layers[LAYER_PREFIX + geoJson.properties.layer];
        if (layer) layer.objects.push(dataSource);
    }).otherwise(function (error) {
        console.error(error);
    });

    function color(propertyName) {
        var cssColor = geoJson.properties[propertyName];
        return cssColor ? Cesium.Color.fromCssColorString(cssColor) : Cesium.Color.WHITE;
    }
});

Events.listen(Events.DESTROY_LAYER, function (id) {
    var layer = getLayer(id);
    if (!layer) return;
    layer.objects.forEach(destroyObject);
    delete layers[LAYER_PREFIX + id];
});

Events.listen(Events.DESTROY_OBJECT, function (id) {
    destroyObject(objects[OBJECT_PREFIX + id]);
});

Events.listen(Events.CREATE_MODEL, function (model) {
    var p = model.position;
    var cartesian = Cesium.Cartesian3.fromDegrees(p.longitude, p.latitude, p.altitude);
    var modelMatrix = Cesium.Transforms.eastNorthUpToFixedFrame(cartesian);
    var entity = engine.scene.primitives.add(Cesium.Model.fromGltf({
        url: model.url, modelMatrix: modelMatrix, scale: model.scale || 1
    }));
});

function destroyObject(object) {
    engine.dataSources.remove(object);
    if (object.id) {
        delete objects[OBJECT_PREFIX + object.id];
    }
}

function getLayer(id) {
    var key = LAYER_PREFIX + id;
    return layers[key] ? layers[key] : null;
}

function error(error) {
    console.error(error);
}



