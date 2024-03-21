import {PostProcessEffect, LightingEffect, AmbientLight, DirectionalLight} from '@deck.gl/core';
import {zoomBlur, vignette} from '@luma.gl/shadertools';
import {hexagons, points} from 'deck.gl-test/data';

import {ScatterplotLayer, ColumnLayer} from '@deck.gl/layers';
import {SimpleMeshLayer} from '@deck.gl/mesh-layers';

import {CubeGeometry} from '@luma.gl/core';
const cube = new CubeGeometry();

export default [
  {
    name: 'shadow-effect',
    effects: [
      new LightingEffect({
        ambientLight: new AmbientLight({
          color: [255, 255, 255],
          intensity: 1.0
        }),
        dirLight: new DirectionalLight({
          color: [255, 255, 255],
          intensity: 1.0,
          direction: [-10, 2, -15],
          _shadow: true
        })
      })
    ],
    viewState: {
      latitude: 37.751537058389985,
      longitude: -122.42694203247012,
      zoom: 11.5,
      pitch: 30,
      bearing: 0,
      orthographic: true
    },
    layers: [
      new ColumnLayer({
        id: 'column-layer',
        data: hexagons,
        radius: 250,
        angle: Math.PI / 2,
        coverage: 1,
        extruded: true,
        pickable: true,
        getPosition: h => h.centroid,
        getFillColor: h => [48, 128, h.value * 255, 255],
        getElevation: h => h.value * 5000
      }),
      new SimpleMeshLayer({
        id: 'mesh-layer',
        data: points.slice(0, 50),
        mesh: cube,
        sizeScale: 150,
        shadowEnabled: false,
        getPosition: d => d.COORDINATES,
        getColor: [200, 200, 200],
        getTranslation: d => [0, 0, d.RACKS * 500],
        getOrientation: d => [45, 0, d.SPACES * 10]
      })
    ],
    goldenImage: './test/render/golden-images/shadow-effect.png'
  },

  {
    name: 'post-process-effects',
    effects: [new PostProcessEffect(zoomBlur, {strength: 0.6}), new PostProcessEffect(vignette)],
    viewState: {
      latitude: 37.751537058389985,
      longitude: -122.42694203247012,
      zoom: 11.5,
      pitch: 0,
      bearing: 0
    },
    layers: [
      new ScatterplotLayer({
        id: 'post-process-effects',
        data: points,
        getPosition: d => d.COORDINATES,
        getFillColor: d => [255, 128, 0],
        getRadius: d => d.SPACES,
        pickable: true,
        radiusScale: 30,
        radiusMinPixels: 1,
        radiusMaxPixels: 30
      })
    ],
    imageDiffOptions: {
      threshold: 0.985
    },
    goldenImage: './test/render/golden-images/post-process-effects.png'
  }
];
