/**
 * Created by jiang on 2017/9/15.
 */
import React, { Component } from 'react';
import ProPTypes from 'prop-types';
import * as THREE from 'three';
import './ThreeBg.scss';
const materials = [];
let container;
let camera, scene, renderer, particles, geometry, parameters, h, color, size, sprite;
let mouseX = 0, mouseY = 0;
let windowHalfX;
let windowHalfY;

export default class ThreeBg extends Component {
    static propTypes = {
        style: ProPTypes.object,
        colorCb: ProPTypes.func
    };

    constructor(...arg) {
        super(...arg);
    }

    componentDidMount() {
        window.THREE = THREE;
        windowHalfX = window.innerWidth / 2;
        windowHalfY = window.innerHeight / 2;
        this.init();
        this._animate();
    }

    componentWillUnmount() {
        cancelAnimationFrame(this.time);
        THREE.Cache.clear();
    }

    init = () => {
        container = document.getElementById('three-content');
        camera = new THREE.PerspectiveCamera(75, window.innerWidth / window.innerHeight, 1, 3000);
        camera.position.z = 1000;

        scene = new THREE.Scene();
        scene.fog = new THREE.FogExp2(0x000000, 0.0007);

        geometry = new THREE.Geometry();

        const textureLoader = new THREE.TextureLoader();
        const _sprite = textureLoader.load('textures/lensflare/lensflare0.png');

        for (let i = 0; i < 500; i++) {
            const vertex = new THREE.Vector3();

            vertex.x = Math.random() * 2000 - 1000;
            vertex.y = Math.random() * 2000 - 1000;
            vertex.z = Math.random() * 2000 - 1000;
            geometry.vertices.push(vertex);
        }

        parameters = [
            [[1, 1, 0.5], _sprite, 50],
            [[0.95, 1, 0.5], _sprite, 35],
            [[0.90, 1, 0.5], _sprite, 20],
            [[0.85, 1, 0.5], _sprite, 18],
            [[0.80, 1, 0.5], _sprite, 5]
        ];

        for (let i = 0; i < parameters.length; i++) {
            color = parameters[i][0];
            sprite = parameters[i][1];
            size = parameters[i][2];
            materials[i] = new THREE.PointsMaterial({
                size: size,
                map: sprite,
                blending: THREE.AdditiveBlending,
                depthTest: false,
                transparent: true
            });
            materials[i].color.setHSL(color[0], color[1], color[2]);

            particles = new THREE.Points(geometry, materials[i]);
            particles.rotation.x = Math.random() * 6;
            particles.rotation.y = Math.random() * 6;
            particles.rotation.z = Math.random() * 6;
            scene.add(particles);
        }

        renderer = new THREE.WebGLRenderer();
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
            if (object instanceof THREE.Points) {
                object.rotation.y = time * ( i < 4 ? i + 1 : -( i + 1 ) );
            }
        }
        for (let i = 0; i < materials.length; i++) {
            color = parameters[i][0];
            h = ( 360 * ( color[0] + time ) % 360 ) / 360;
            materials[i].color.setHSL(h, color[1], color[2]);
        }
        if (this.props.colorCb) this.props.colorCb([h, color[1], color[2]]);
        renderer.render(scene, camera);
    };

    _animate = () => {
        this.time = requestAnimationFrame(this._animate);
        this._render();
    };

    render() {
        return <div style={this.props.style} id="three-content" className="three-content"></div>;
    }
}
