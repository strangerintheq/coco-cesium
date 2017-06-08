var loadJson = require('./XhrPatch');
var defined = window.Cesium.defined;
var buildModuleUrl = window.Cesium.buildModuleUrl;
// костыль для загрузки json через протокол file
module.exports = function() {

    var GroundPrimitive = window.Cesium.GroundPrimitive;

    if (defined(GroundPrimitive._initPromise)) {
        return GroundPrimitive._initPromise;
    }

    GroundPrimitive._initPromise = loadJson({
        url: buildModuleUrl('Assets/approximateTerrainHeights.json')
    }).then(function(json) {
        GroundPrimitive._initialized = true;
        GroundPrimitive._terrainHeights = json;
    });

    return GroundPrimitive._initPromise;
};