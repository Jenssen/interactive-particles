import * as Three from 'three';
import { TweenLite } from 'gsap/TweenMax';

import InteractiveControls from './controls/InteractiveControls';
import Particles from './particles/Particles';

import oc from 'three-orbit-controls'
const OrbitControls = oc(Three)

const glslify = require('glslify');

export default class WebGLView {

	constructor(app) {
		this.app = app;

		this.samples = [];
		if (window.innerWidth <= 768) {
			this.samples.push('images/image-tablet.png');
		} else {
			this.samples.push('images/image.png');
		}

		this.initThree();
		this.initParticles();
		this.initControls();

		const rnd = ~~(Math.random() * this.samples.length);
		this.goto(rnd);
	}

	initThree() {
		// scene
		this.scene = new THREE.Scene();

		// camera
		this.camera = new THREE.PerspectiveCamera(50, window.innerWidth / window.innerHeight, 1, 10000);
		this.camera.position.z = 300;

		if (window.innerWidth <= 768 && window.innerWidth > 411) {
			this.camera.zoom = 1;
		} else if (window.innerWidth <= 411) {
			this.camera.zoom = 0.7;
		} else {
			this.camera.zoom = 1;
		}

		// renderer
    this.renderer = new THREE.WebGLRenderer({ antialias: true, alpha: true });

  	// clock
		this.clock = new THREE.Clock(true);

		this.controls = new OrbitControls( this.camera, this.renderer.domElement );
		this.controls.enableKeys = false;
		this.controls.maxDistance = 400;
		this.controls.minDistance = 50;
		this.controls.minPolarAngle = 0.5;
		this.controls.maxPolarAngle = 2.5;
		this.controls.minAzimuthAngle = -1.5;
		this.controls.maxAzimuthAngle = 1.5;
	}

	initControls() {
		this.interactive = new InteractiveControls(this.camera, this.renderer.domElement);
	}

	initParticles() {
		this.particles = new Particles(this);
		this.scene.add(this.particles.container);
	}

	// ---------------------------------------------------------------------------------------------
	// PUBLIC
	// ---------------------------------------------------------------------------------------------

	update() {
		const delta = this.clock.getDelta();
		if (this.particles) this.particles.update(delta);
		this.controls.update()
	}

	draw() {
		this.renderer.render(this.scene, this.camera);
	}


	goto(index) {
		// init next
		if (this.currSample == null) this.particles.init(this.samples[index]);
		// hide curr then init next
		else {
			this.particles.hide(true).then(() => {
				this.particles.init(this.samples[index]);
			});
		}

		this.currSample = index;
	}

	next() {
		if (this.currSample < this.samples.length - 1) this.goto(this.currSample + 1);
		else this.goto(0);
	}

	// ---------------------------------------------------------------------------------------------
	// EVENT HANDLERS
	// ---------------------------------------------------------------------------------------------

	resize() {
		if (!this.renderer) return;
		this.camera.aspect = window.innerWidth / window.innerHeight;
		this.camera.updateProjectionMatrix();

		this.fovHeight = 2 * Math.tan((this.camera.fov * Math.PI) / 180 / 2) * this.camera.position.z;

		this.renderer.setSize(window.innerWidth, window.innerHeight);

		if (this.interactive) this.interactive.resize();
		if (this.particles) this.particles.resize();
	}
}
