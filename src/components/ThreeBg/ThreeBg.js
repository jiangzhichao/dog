/**
 * Created by jiang on 2017/9/15.
 */
import React, { Component } from 'react';
import {
  PerspectiveCamera,
  Scene,
  FogExp2,
  Geometry,
  Vector3,
  PointsMaterial,
  Points,
  WebGLRenderer,
  Cache
} from 'three';
import './ThreeBg.scss';
const materials = [];
let container;
let camera, scene, renderer, particles, geometry, parameters, h, color, size;
let mouseX = 0, mouseY = 0;
let windowHalfX;
let windowHalfY;

export default class ThreeBg extends Component {
  constructor(...arg) {
    super(...arg);
  }

  componentDidMount() {
    windowHalfX = window.innerWidth / 2;
    windowHalfY = window.innerHeight / 2;

    this.init();
    this._animate();
  }

  componentWillUnmount() {
    cancelAnimationFrame(this.time);
    Cache.clear();
  }

  init = () => {
    container = document.getElementById('three-content');
    camera = new PerspectiveCamera(75, window.innerWidth / window.innerHeight, 1, 3000);
    camera.position.z = 1000;

    scene = new Scene();
    scene.fog = new FogExp2(0x000000, 0.0007);

    geometry = new Geometry();

    for (let i = 0; i < 500; i++) {
      const vertex = new Vector3();
      vertex.x = Math.random() * 2000 - 1000;
      vertex.y = Math.random() * 2000 - 1000;
      vertex.z = Math.random() * 2000 - 1000;
      geometry.vertices.push(vertex);
    }

    parameters = [
      [[1, 1, 0.5], 5],
      [[0.95, 1, 0.5], 4],
      [[0.90, 1, 0.5], 3],
      [[0.85, 1, 0.5], 2],
      [[0.80, 1, 0.5], 1]
    ];

    for (let i = 0; i < parameters.length; i++) {
      color = parameters[i][0];
      size = parameters[i][1];
      materials[i] = new PointsMaterial({ size: size });
      particles = new Points(geometry, materials[i]);
      particles.rotation.x = Math.random() * 6;
      particles.rotation.y = Math.random() * 6;
      particles.rotation.z = Math.random() * 6;
      scene.add(particles);
    }

    renderer = new WebGLRenderer();
    renderer.setPixelRatio(window.devicePixelRatio);
    renderer.setSize(window.innerWidth, window.innerHeight);
    container.appendChild(renderer.domElement);

    function onWindowResize() {
      windowHalfX = window.innerWidth / 2;
      windowHalfY = window.innerHeight / 2;
      camera.aspect = window.innerWidth / window.innerHeight;
      camera.updateProjectionMatrix();
      renderer.setSize(window.innerWidth, window.innerHeight);
    }

    function onDocumentMouseMove(event) {
      mouseX = event.clientX - windowHalfX;
      mouseY = event.clientY - windowHalfY;
    }

    function onDocumentTouchStart(event) {
      if (event.touches.length === 1) {
        event.preventDefault();
        mouseX = event.touches[0].pageX - windowHalfX;
        mouseY = event.touches[0].pageY - windowHalfY;
      }
    }

    function onDocumentTouchMove(event) {
      if (event.touches.length === 1) {
        event.preventDefault();
        mouseX = event.touches[0].pageX - windowHalfX;
        mouseY = event.touches[0].pageY - windowHalfY;
      }
    }

    document.addEventListener('mousemove', onDocumentMouseMove, false);
    document.addEventListener('touchstart', onDocumentTouchStart, false);
    document.addEventListener('touchmove', onDocumentTouchMove, false);
    window.addEventListener('resize', onWindowResize, false);

  };

  _render = () => {
    const time = Date.now() * 0.00005;
    camera.position.x += ( mouseX - camera.position.x ) * 0.05;
    camera.position.y += ( -mouseY - camera.position.y ) * 0.05;
    camera.lookAt(scene.position);
    for (let i = 0; i < scene.children.length; i++) {
      const object = scene.children[i];
      if (object instanceof Points) {
        object.rotation.y = time * ( i < 4 ? i + 1 : -( i + 1 ) );
      }
    }
    for (let i = 0; i < materials.length; i++) {
      color = parameters[i][0];
      h = ( 360 * ( color[0] + time ) % 360 ) / 360;
      materials[i].color.setHSL(h, color[1], color[2]);
    }
    renderer.render(scene, camera);
  };

  _animate = () => {
    this.time = requestAnimationFrame(this._animate);
    this._render();
  };

  render() {
    return <div {...this.props} id="three-content" className="three-content"></div>;
  }
}
