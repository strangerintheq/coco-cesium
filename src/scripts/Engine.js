window.CESIUM_BASE_URL = './';

var Cesium = window.Cesium;
Cesium.loadWithXhr.load = require('./XhrPatch').load;
Cesium.GroundPrimitive.initializeTerrainHeights = require('./GroundPrimitivePatch');

var options = {
    // imageryProvider: Cesium.createTileMapServiceImageryProvider({
    //     url: Cesium.buildModuleUrl('Assets/Textures/NaturalEarthII')
    // }),
    // baseLayerPicker: false,
    navigationHelpButton: false,
    fullscreenButton: false,
    animation: false,
    timeline: false,
    geocoder: false,
    shadows: false
};

var engine = new Cesium.Viewer('app', options);

// var cesiumTerrainProviderMeshes = new Cesium.CesiumTerrainProvider({
//     url: 'https://assets.agi.com/stk-terrain/v1/tilesets/world/tiles',
//     requestWaterMask: true,
//     requestVertexNormals: true
// });
//
// engine.terrainProvider = cesiumTerrainProviderMeshes;

module.exports = engine;