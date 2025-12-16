// Requires: THREE r150+ and BufferGeometryUtils.js
import * as THREE from 'three';
import { mergeGeometries } from 'three/addons/utils/BufferGeometryUtils.js';

export class TreeGenerator {
  constructor(scene, options = {}) {
    this.scene = scene;

    // === Core / Back-compat mappings ===
    const branchDepth = options.branchDepth ?? options.maxLife ?? 5;

    this.opts = {
      // RNG
      seed: options.seed ?? Math.floor(Math.random() * 1e9),

      // Structure
      branchDepth,
      branchingFactor: options.branchingFactor ?? 2,         // avg side-branches at a node
      forkProbability: options.forkProbability ?? 0.5,       // chance to create side branches
      branchLength: options.branchLength ?? 1.25,            // length of the first segment
      lengthFalloff: options.lengthFalloff ?? 0.78,          // <1 => shorter each level
      radius: options.baseRadius ?? 0.22,                    // trunk base radius
      radiusFalloff: options.radiusFalloff ?? 0.72,
      taper: options.taper ?? 0.72,                          // per-segment taper
      divergence: options.branchDivergence ?? 0.45,          // radian tilt envelope
      twist: options.branchTwist ?? 0.6,                     // around-axis random twist
      apicalDominance: options.apicalDominance ?? 0.55,      // favors "up"
      tropism: options.tropism ?? new THREE.Vector3(0, 0, 0),
      tropismStrength: options.tropismStrength ?? 0.22,

      // Geometry quality
      radialSegments: options.radialSegments ?? 6,
      lengthSegments: options.lengthSegments ?? 1,

      // Branch curvature
      branchCurvature: options.branchCurvature ?? 0.15,      // base curvature amount (0-1)
      curvatureDepthFalloff: options.curvatureDepthFalloff ?? 0.8, // how curvature changes with depth
      curvatureVariation: options.curvatureVariation ?? 0.5,  // randomness in curve direction

      // Branch divergence angles per depth: [[xMin, xMax, yMin, yMax, zMin, zMax], ...]
      // Angles in radians for X, Y, Z rotations - how much child branches rotate from parent.
      // Index is depth level. If depth exceeds array, uses last entry.
      branchAnglesPerDepth: options.branchAnglesPerDepth ?? [
        [0.2, 0.4, 0.2, 0.4, 0.2, 0.4],    // depth 0
        [0.3, 0.6, 0.3, 0.6, 0.3, 0.6],    // depth 1
        [0.4, 0.8, 0.4, 0.8, 0.4, 0.8],    // depth 2
        [0.5, 1.0, 0.5, 1.0, 0.5, 1.0],    // depth 3
        [0.6, 1.2, 0.6, 1.2, 0.6, 1.2],    // depth 4
        [0.7, 1.4, 0.7, 1.4, 0.7, 1.4]     // depth 5+
      ],

      // Branch sprouting controls
      branchStartHeight: options.branchStartHeight ?? 0.3,    // where branches start along trunk (0-1)
      branchEndHeight: options.branchEndHeight ?? 1.0,        // where branches end along trunk (0-1)
      branchSpacingRandom: options.branchSpacingRandom ?? 0.7, // spacing randomness (0-1)
      azimuthRandomness: options.azimuthRandomness ?? 0.5,    // angular randomness (0-1)

      // Debug mode
      debugMode: options.debugMode ?? false,

      // Leaves
      leafDistribution: options.leafDistribution ?? "terminalOnly",
      leafGeometry: options.leafGeometry ?? "icosahedron",
      leafGeometryParams: options.leafGeometryParams ?? {},
      leafSide: options.leafSide ?? "DoubleSide",
      leafCutBottom: options.leafCutBottom ?? false,
      leafNoRotation: options.leafNoRotation ?? false,
      leavesPerNode: options.leavesPerNode ?? 3,
      leafScale: Array.isArray(options.leafScale)
        ? options.leafScale
        : [0.12, options.leafScale ?? 0.38],
      leafColor: options.leafColor ?? 0x2e8b57,
      leafOpacity: options.leafTransparency ?? options.leafOpacity ?? 1.0,
      leafHueJitter: options.leafHueJitter ?? 0.03,
      leafSatJitter: options.leafSaturationJitter ?? 0.08,
      leafValJitter: options.leafValueJitter ?? 0.05,

      // Branch colors (vertex gradient bottom->top)
      branchColorBottom: options.branchColorBottom ?? options.branchColor ?? 0x4e3b2c,
      branchColorTop: options.branchColorTop ?? 0x806a52,

      // Rocks / ground dressing
      rockCount: options.rockCount ?? 19,
      rockScale: Array.isArray(options.rockScale)
        ? options.rockScale
        : [0.15, 1.2],
      rockFlatten: options.rockFlatten ?? 0.25, // 0=no flatten, 1=very flat
      rockFieldRadius: options.rockFieldRadius ?? 7.5,
      rockColor: options.rockColor ?? 0x666666,
      rockHueJitter: options.rockHueJitter ?? 0.02,
      rockSatJitter: options.rockSatJitter ?? 0.05,
      rockValJitter: options.rockValJitter ?? 0.05,

      // Placement
      groundY: options.groundY ?? -2, // Keeps your original visual offset
      globalScale: options.globalScale ?? 1
    };

    // Groups/meshes
    this.leavesGroup = new THREE.Group();           // kept for backward compatibility
    this.scene.add(this.leavesGroup);

    this.treeMesh = null;
    this.leafMesh = null;   // InstancedMesh
    this.rocksMesh = null;  // InstancedMesh

    // temp arrays reused per generate
    this._segments = [];      // {matrix, height, rTop, rBottom, depth, segmentId, isTrunk}
    this._leafMatrices = [];  // Matrix4 array
    this._leafColors = [];    // THREE.Color array
    this._minY = +Infinity;
    this._maxY = -Infinity;
    this._segmentCounter = 0; // unique ID for each segment
    this._trunkPath = [];     // Array of points forming the trunk path
    this._branchAngles = [];  // Array of Y-rotation angles for branches from trunk

    // seeded RNG
    this._rng = this._mulberry32(this.opts.seed);
  }

  // -------- Public API --------

  generate(x = 0, y = 0, z = 0) {
    const base = new THREE.Vector3(x, y + this.opts.groundY, z);
    this._rng = this._mulberry32(this.opts.seed); // reset RNG for reproducibility

    // 1) Build procedural structure (segments + planned leaves)
    this._resetBuild();
    this._buildTree(base);

    // 2) Build & add trunk mesh
    this._buildTrunkMesh();

    // 3) Build & add instanced leaves
    this._buildLeaves();

    // 4) Build & add instanced rocks
    this._buildRocks(base);
  }

  clear() {
    // Clear leaves group (back-compat) – remove instanced meshes inside
    while (this.leavesGroup.children.length > 0) {
      const obj = this.leavesGroup.children.pop();
      if (obj.geometry) obj.geometry.dispose();
      if (obj.material) obj.material.dispose();
    }

    if (this.leafMesh) {
      if (this.leafMesh.geometry) this.leafMesh.geometry.dispose();
      if (this.leafMesh.material) this.leafMesh.material.dispose();
      this.scene.remove(this.leafMesh);
      this.leafMesh = null;
    }

    if (this.rocksMesh) {
      if (this.rocksMesh.geometry) this.rocksMesh.geometry.dispose();
      if (this.rocksMesh.material) this.rocksMesh.material.dispose();
      this.scene.remove(this.rocksMesh);
      this.rocksMesh = null;
    }

    if (this.treeMesh) {
      if (this.treeMesh.geometry) this.treeMesh.geometry.dispose();
      if (this.treeMesh.material) this.treeMesh.material.dispose();
      this.scene.remove(this.treeMesh);
      this.treeMesh = null;
    }
  }

  regenerate(x = 0, y = 0, z = 0) {
    this.clear();
    // small delay to allow GC to free buffers on some stacks
    setTimeout(() => this.generate(x, y, z), 10);
  }

  getBranchAngles() {
    return this._branchAngles;
  }

  // -------- Internal: build pipeline --------

  _resetBuild() {
    this._segments.length = 0;
    this._leafMatrices.length = 0;
    this._leafColors.length = 0;
    this._minY = +Infinity;
    this._maxY = -Infinity;
    this._segmentCounter = 0;
    this._trunkPath.length = 0;
    this._branchAngles.length = 0;
  }

  _buildTree(basePos) {
    const o = this.opts;
    const length0 = o.branchLength * o.globalScale;
    const radius0 = o.radius * o.globalScale;

    // initial orientation: up
    const q0 = new THREE.Quaternion(); // identity aligns local Y to world Y

    this._spawnBranch({
      basePos,
      quat: q0,
      depth: 0,
      length: length0,
      radius: radius0,
      isTrunk: true
    });
  }

  _spawnBranch({ basePos, quat, depth, length, radius, isTrunk }) {
    const o = this.opts;
    if (depth >= o.branchDepth || radius < 0.01 * o.globalScale || length < 0.05 * o.globalScale) {
      // terminal leaves (for "terminalOnly" distribution)
      if (o.leafDistribution === "terminalOnly") {
        this._maybeAddLeaves(basePos, quat, depth);
      }
      return;
    }

    // Compute direction to grow from parent
    const upWorld = new THREE.Vector3(0, 1, 0).applyQuaternion(quat).normalize();

    // Random divergence around the current direction
    const randVec = new THREE.Vector3(
      (this._rng() - 0.5) * 2,
      (this._rng() - 0.5) * 2,
      (this._rng() - 0.5) * 2
    ).multiplyScalar(o.divergence);

    // Add tropism (e.g., gravity, wind-average)
    const delta = randVec.add(o.tropism.clone().multiplyScalar(o.tropismStrength));

    // Favor "up"
    const dir = upWorld.clone().add(delta);
    dir.y += o.apicalDominance * (isTrunk ? 1.0 : 0.5);
    if (dir.lengthSq() < 1e-6) dir.set(0, 1, 0);
    dir.normalize();

    // Quaternion rotating "upWorld" into "dir"
    const qRot = new THREE.Quaternion().setFromUnitVectors(upWorld, dir);

    // Random twist around the new axis
    const qTwist = new THREE.Quaternion().setFromAxisAngle(dir, (this._rng() - 0.5) * o.twist);

    // Orientation for this segment
    const qNext = qTwist.multiply(qRot).multiply(quat).normalize();

    // Segment dimensions
    const height = length; // already scaled
    const rBottom = Math.max(radius, 0.001);
    const rTop = Math.max(radius * o.taper, 0.001);

    // Compute transform that places a Y-up cylinder from base->tip
    const tipPos = basePos.clone().add(dir.clone().multiplyScalar(height));
    const midPos = basePos.clone().add(dir.clone().multiplyScalar(height * 0.5));
    const m = new THREE.Matrix4().compose(
      midPos,
      qNext,
      new THREE.Vector3(1, 1, 1)
    );

    // Record overall Y bounds (for gradient coloring later)
    this._minY = Math.min(this._minY, basePos.y, tipPos.y);
    this._maxY = Math.max(this._maxY, basePos.y, tipPos.y);

    // Track trunk path for continuous tube
    if (isTrunk && depth === 0) {
      // Start of trunk - add base position
      if (this._trunkPath.length === 0) {
        this._trunkPath.push({ pos: basePos.clone(), radius: rBottom });
      }
    }

    // Push this segment to be meshed later
    this._segments.push({
      matrix: m,
      height,
      rTop,
      rBottom,
      depth,
      segmentId: this._segmentCounter++,
      isTrunk,
      basePos: basePos.clone(),
      tipPos: tipPos.clone()
    });

    // Continue building trunk path
    if (isTrunk) {
      this._trunkPath.push({ pos: tipPos.clone(), radius: rTop });
    }

    // Leaves along branches (non-terminal)
    if (this.opts.leafDistribution !== "terminalOnly" && depth >= 1) {
      this._maybeAddLeaves(midPos, qNext, depth);
    }

    // Continue the "primary" direction (apical)
    const nextLength = height * o.lengthFalloff;
    const nextRadius = rTop * o.radiusFalloff;
    this._spawnBranch({
      basePos: tipPos,
      quat: qNext,
      depth: depth + 1,
      length: nextLength,
      radius: nextRadius,
      isTrunk
    });

    // Optionally spawn side branches at this node
    if (this._rng() < o.forkProbability && depth < o.branchDepth - 1) {
      // Number of branches at this node
      const n = Math.max(1, Math.round(o.branchingFactor + this._rng() * 2 - 1));

      // Get angle ranges for this depth level [xMin, xMax, yMin, yMax, zMin, zMax]
      const depthIndex = Math.min(depth + 1, o.branchAnglesPerDepth.length - 1);
      const [xMin, xMax, yMin, yMax, zMin, zMax] = o.branchAnglesPerDepth[depthIndex];

      for (let i = 0; i < n; i++) {
        // Random Euler angles within the ranges for this depth
        const rotX = xMin + this._rng() * (xMax - xMin);
        const rotY = yMin + this._rng() * (yMax - yMin);
        const rotZ = zMin + this._rng() * (zMax - zMin);

        // Apply Euler rotation to the parent quaternion
        const euler = new THREE.Euler(rotX, rotY, rotZ, 'XYZ');
        const qRotation = new THREE.Quaternion().setFromEuler(euler);

        // Add radial spread around parent axis with configurable randomness
        const baseAzimuth = (i / n) * Math.PI * 2;
        const azimuthRandom = (this._rng() - 0.5) * Math.PI * o.azimuthRandomness;
        const azimuthAngle = baseAzimuth + azimuthRandom;
        const qAzimuth = new THREE.Quaternion().setFromAxisAngle(dir, azimuthAngle);

        // Combine rotations: azimuth spread, then euler angles, applied to parent orientation
        const qChild = qNext.clone().multiply(qAzimuth).multiply(qRotation);

        // Spawn branch at a position along this segment based on controls
        let branchT;
        if (isTrunk) {
          // Use branchStartHeight and branchEndHeight with spacing randomness
          const heightRange = o.branchEndHeight - o.branchStartHeight;
          const uniformT = o.branchStartHeight + heightRange * (i / n);
          const randomOffset = (this._rng() - 0.5) * heightRange * o.branchSpacingRandom;
          branchT = Math.max(0, Math.min(1, uniformT + randomOffset));
        } else {
          // Non-trunk branches: spawn in upper half of segment
          branchT = this._rng() * 0.5 + 0.5;
        }
        const branchPos = basePos.clone().add(dir.clone().multiplyScalar(height * branchT));

        // Track branch angle if this is sprouting from trunk
        if (isTrunk) {
          // For trunk branches, the azimuthAngle IS the angle around the vertical axis
          // since the trunk grows primarily upward (Y-axis)
          this._branchAngles.push(azimuthAngle);
        }

        // shorter & thinner than the apical continuation
        const lenChild = nextLength * (0.85 + 0.3 * this._rng());
        const radChild = nextRadius * (0.9 + 0.2 * this._rng());

        this._spawnBranch({
          basePos: branchPos,
          quat: qChild,
          depth: depth + 1,
          length: lenChild,
          radius: radChild,
          isTrunk: false
        });
      }
    }
  }

  _maybeAddLeaves(anchorPos, quat, depth) {
    const o = this.opts;
    const n = typeof o.leavesPerNode === 'function'
      ? o.leavesPerNode(depth)
      : o.leavesPerNode;

    for (let i = 0; i < n; i++) {
      // slightly offset leaves away from the branch axis
      const off = new THREE.Vector3(
        (this._rng() - 0.5) * 0.35 * o.globalScale,
        (this._rng() - 0.2) * 0.25 * o.globalScale,
        (this._rng() - 0.5) * 0.35 * o.globalScale
      ).applyQuaternion(quat);

      const pos = anchorPos.clone().add(off);

      // Determine leaf orientation based on leafNoRotation setting
      let qLeaf;
      if (o.leafNoRotation) {
        // No rotation - use identity quaternion (no rotation at all)
        qLeaf = new THREE.Quaternion();
      } else {
        // small random rotation around local axes
        const axis = new THREE.Vector3(this._rng(), this._rng(), this._rng()).normalize();
        qLeaf = new THREE.Quaternion().setFromAxisAngle(axis, (this._rng() - 0.5) * Math.PI)
          .multiply(quat);
      }

      const s = this._lerp(o.leafScale[0], o.leafScale[1], this._rng()) * o.globalScale;
      const mat = new THREE.Matrix4().makeRotationFromQuaternion(qLeaf)
        .setPosition(pos);
      // bake scale
      mat.multiply(new THREE.Matrix4().makeScale(s, s, s));

      this._leafMatrices.push(mat);
      this._leafColors.push(this._jitterHSV(new THREE.Color(o.leafColor), o.leafHueJitter, o.leafSatJitter, o.leafValJitter));
    }
  }

  _buildContinuousTrunk() {
    const o = this.opts;

    // Create a CatmullRomCurve3 through all trunk points for smooth continuity
    const points = this._trunkPath.map(p => p.pos);
    const curve = new THREE.CatmullRomCurve3(points);

    // Calculate total length for tubular segments
    const totalLength = curve.getLength();
    const tubularSegments = Math.max(10, Math.ceil(totalLength / (0.2 * o.globalScale)));

    // Create radius function based on trunk path
    const radiusFunction = (u) => {
      // Interpolate between trunk path radii
      const segmentIndex = u * (this._trunkPath.length - 1);
      const lowerIndex = Math.floor(segmentIndex);
      const upperIndex = Math.min(lowerIndex + 1, this._trunkPath.length - 1);
      const t = segmentIndex - lowerIndex;

      const r1 = this._trunkPath[lowerIndex].radius;
      const r2 = this._trunkPath[upperIndex].radius;

      return r1 * (1 - t) + r2 * t;
    };

    // Create TubeGeometry
    const g = new THREE.TubeGeometry(
      curve,
      tubularSegments,
      1, // will be scaled by radiusFunction
      o.radialSegments,
      false
    );

    // Apply radius tapering
    const pos = g.attributes.position;
    const radialSegments = o.radialSegments;
    const tubularVertices = tubularSegments + 1;
    const radialVertices = radialSegments + 1;

    for (let t = 0; t < tubularVertices; t++) {
      const u = t / tubularSegments;
      const radius = radiusFunction(u);

      for (let r = 0; r <= radialSegments; r++) {
        const i = t * radialVertices + r;

        const vx = pos.getX(i);
        const vy = pos.getY(i);
        const vz = pos.getZ(i);

        const pathPoint = curve.getPoint(u);

        const dx = vx - pathPoint.x;
        const dy = vy - pathPoint.y;
        const dz = vz - pathPoint.z;

        const currentRadius = Math.sqrt(dx * dx + dy * dy + dz * dz);

        if (currentRadius > 0.0001) {
          const scale = radius / currentRadius;
          pos.setXYZ(i, pathPoint.x + dx * scale, pathPoint.y + dy * scale, pathPoint.z + dz * scale);
        }
      }
    }

    pos.needsUpdate = true;

    // Apply vertex colors based on Y
    const cLow = new THREE.Color(o.branchColorBottom);
    const cHigh = new THREE.Color(o.branchColorTop);
    const ySpan = Math.max(1e-6, this._maxY - this._minY);

    const vertexCount = pos.count;
    const colors = new Float32Array(vertexCount * 3);

    for (let i = 0; i < vertexCount; i++) {
      const y = pos.getY(i);
      const t = (y - this._minY) / ySpan;
      const col = cLow.clone().lerp(cHigh, this._smoothstep(0, 1, t));
      colors[i * 3 + 0] = col.r;
      colors[i * 3 + 1] = col.g;
      colors[i * 3 + 2] = col.b;
    }

    g.setAttribute('color', new THREE.BufferAttribute(colors, 3));
    g.computeVertexNormals();

    return g;
  }

  _buildTrunkMesh() {
    const o = this.opts;
    if (!this._segments.length) return;

    const geoms = [];
    const tmpPos = new THREE.Vector3();
    const tmpQuat = new THREE.Quaternion();
    const tmpScale = new THREE.Vector3();

    // colors for gradient
    const cLow = new THREE.Color(o.branchColorBottom);
    const cHigh = new THREE.Color(o.branchColorTop);
    const ySpan = Math.max(1e-6, this._maxY - this._minY);

    // Build continuous trunk if we have trunk path
    if (this._trunkPath.length > 1) {
      const trunkGeom = this._buildContinuousTrunk();
      if (trunkGeom) {
        geoms.push(trunkGeom);
      }
    }

    // Build individual branch segments (non-trunk segments)
    for (const seg of this._segments) {
      // Skip trunk segments - they're handled by the continuous trunk
      if (seg.isTrunk) continue;
      // Decompose matrix to get position and orientation
      seg.matrix.decompose(tmpPos, tmpQuat, tmpScale);

      // Create a curved path from base to tip
      const localUp = new THREE.Vector3(0, 1, 0).applyQuaternion(tmpQuat);
      const localRight = new THREE.Vector3(1, 0, 0).applyQuaternion(tmpQuat);
      const localForward = new THREE.Vector3(0, 0, 1).applyQuaternion(tmpQuat);
      const basePos = tmpPos.clone().sub(localUp.clone().multiplyScalar(seg.height * 0.5));
      const tipPos = tmpPos.clone().add(localUp.clone().multiplyScalar(seg.height * 0.5));

      // Create a curved path using a quadratic bezier curve
      // Get angle range for this depth level
      const depthIndex = Math.min(seg.depth, o.branchAnglesPerDepth.length - 1);
      const [minAngle, maxAngle] = o.branchAnglesPerDepth[depthIndex];

      // Use segment ID for unique curvature per segment
      const bendSeed = ((seg.segmentId * 0.618033988749895) % 1.0); // golden ratio for better distribution

      // Random angle within the range for this depth
      const angleRange = maxAngle - minAngle;
      const curvatureAngle = minAngle + (bendSeed * angleRange);

      // Convert angle to curvature offset (perpendicular displacement)
      // Scale down the curvature to make it more subtle
      const curvature = seg.height * Math.tan(curvatureAngle) * 0.3;

      // Random direction around the growth axis
      const bendDirection = (seg.segmentId * 2.39996322972865332) % (Math.PI * 2); // 0 to 2π

      // Combine right and forward vectors for varied curve directions
      const bendDir = localRight.clone().multiplyScalar(Math.cos(bendDirection))
        .add(localForward.clone().multiplyScalar(Math.sin(bendDirection)));

      const controlPoint = tmpPos.clone().add(bendDir.multiplyScalar(curvature));

      const path = new THREE.QuadraticBezierCurve3(basePos, controlPoint, tipPos);

      // Create TubeGeometry with more tubular segments to show the curve
      const tubularSegments = Math.max(3, Math.ceil(seg.height / (0.2 * o.globalScale)));

      // Create tube with a custom radius function for tapering
      const radiusFunction = (u) => {
        // u goes from 0 to 1 along the tube
        return seg.rBottom * (1 - u) + seg.rTop * u;
      };

      const g = new THREE.TubeGeometry(
        path,
        tubularSegments,         // tubular segments (more for curved appearance)
        1,                       // base radius (will be scaled by radiusFunction)
        o.radialSegments,        // radial segments
        false                    // closed
      );

      // Apply radius tapering using the Frenet frame approach
      const pos = g.attributes.position;
      const vertexCount = pos.count;
      const radialSegments = o.radialSegments;

      // Vertices are organized as: (tubularSegments + 1) rings of (radialSegments + 1) vertices
      const tubularVertices = tubularSegments + 1;
      const radialVertices = radialSegments + 1;

      for (let t = 0; t < tubularVertices; t++) {
        const u = t / tubularSegments; // 0 to 1 along tube
        const radius = radiusFunction(u);

        for (let r = 0; r <= radialSegments; r++) {
          const i = t * radialVertices + r;

          // Get current position
          const vx = pos.getX(i);
          const vy = pos.getY(i);
          const vz = pos.getZ(i);

          // Get path point
          const pathPoint = path.getPoint(u);

          // Calculate radial offset
          const dx = vx - pathPoint.x;
          const dy = vy - pathPoint.y;
          const dz = vz - pathPoint.z;

          // Current distance from center
          const currentRadius = Math.sqrt(dx * dx + dy * dy + dz * dz);

          // Scale to target radius
          if (currentRadius > 0.0001) {
            const scale = radius / currentRadius;
            pos.setXYZ(i, pathPoint.x + dx * scale, pathPoint.y + dy * scale, pathPoint.z + dz * scale);
          }
        }
      }

      pos.needsUpdate = true;

      // allocate vertex colors per vertex
      const colors = new Float32Array(vertexCount * 3);

      if (o.debugMode) {
        // Debug mode: color by depth
        const debugColors = [
          new THREE.Color(0xff0000), // depth 0: red
          new THREE.Color(0xff8800), // depth 1: orange
          new THREE.Color(0xffff00), // depth 2: yellow
          new THREE.Color(0x00ff00), // depth 3: green
          new THREE.Color(0x0088ff), // depth 4: blue
          new THREE.Color(0x8800ff), // depth 5: purple
          new THREE.Color(0xff00ff), // depth 6: magenta
          new THREE.Color(0xff0088), // depth 7: pink
          new THREE.Color(0x00ffff), // depth 8: cyan
          new THREE.Color(0xffffff)  // depth 9+: white
        ];
        const depthColor = debugColors[Math.min(seg.depth, debugColors.length - 1)];

        for (let i = 0; i < vertexCount; i++) {
          colors[i * 3 + 0] = depthColor.r;
          colors[i * 3 + 1] = depthColor.g;
          colors[i * 3 + 2] = depthColor.b;
        }
      } else {
        // Normal mode: gradient based on world Y
        for (let i = 0; i < vertexCount; i++) {
          const y = pos.getY(i);
          const t = (y - this._minY) / ySpan; // 0..1
          const col = cLow.clone().lerp(cHigh, this._smoothstep(0, 1, t));
          colors[i * 3 + 0] = col.r;
          colors[i * 3 + 1] = col.g;
          colors[i * 3 + 2] = col.b;
        }
      }

      g.setAttribute('color', new THREE.BufferAttribute(colors, 3));
      geoms.push(g);
    }

    // merge all segments into one BufferGeometry
    const merged = mergeGeometries(geoms, false);
    merged.computeVertexNormals();

    const branchMat = new THREE.MeshStandardMaterial({
      vertexColors: true,
      roughness: 0.95,
      metalness: 0.0,
      side: THREE.DoubleSide
    });

    this.treeMesh = new THREE.Mesh(merged, branchMat);
    this.treeMesh.castShadow = true;
    this.treeMesh.receiveShadow = true;

    this.scene.add(this.treeMesh);
  }

  // Helper function to remove vertices below Y=0 from geometry
  _cutGeometryBottom(geometry) {
    // Convert to non-indexed geometry for easier manipulation
    const geo = geometry.toNonIndexed();

    const positions = geo.attributes.position;
    const normals = geo.attributes.normal;
    const uvs = geo.attributes.uv;

    const newPositions = [];
    const newNormals = normals ? [] : null;
    const newUvs = uvs ? [] : null;

    // Process each triangle (3 vertices at a time)
    for (let i = 0; i < positions.count; i += 3) {
      // Get Y coordinates of the three vertices
      const y0 = positions.getY(i);
      const y1 = positions.getY(i + 1);
      const y2 = positions.getY(i + 2);

      // Keep triangle if ALL vertices are at Y >= 0
      // This creates a clean cut
      if (y0 >= 0 && y1 >= 0 && y2 >= 0) {
        // Add positions
        for (let j = 0; j < 3; j++) {
          newPositions.push(
            positions.getX(i + j),
            positions.getY(i + j),
            positions.getZ(i + j)
          );

          // Add normals if they exist
          if (normals) {
            newNormals.push(
              normals.getX(i + j),
              normals.getY(i + j),
              normals.getZ(i + j)
            );
          }

          // Add UVs if they exist
          if (uvs) {
            newUvs.push(
              uvs.getX(i + j),
              uvs.getY(i + j)
            );
          }
        }
      }
    }

    // Create new geometry with filtered data
    const newGeometry = new THREE.BufferGeometry();
    newGeometry.setAttribute('position', new THREE.Float32BufferAttribute(newPositions, 3));

    if (newNormals) {
      newGeometry.setAttribute('normal', new THREE.Float32BufferAttribute(newNormals, 3));
    }

    if (newUvs) {
      newGeometry.setAttribute('uv', new THREE.Float32BufferAttribute(newUvs, 2));
    }

    // Recompute normals for better lighting
    newGeometry.computeVertexNormals();

    return newGeometry;
  }

  _buildLeaves() {
    const count = this._leafMatrices.length;
    if (count === 0) return;

    // Create leaf geometry based on user selection
    let leafGeo;
    const size = 0.25;
    const params = this.opts.leafGeometryParams;

    switch (this.opts.leafGeometry) {
      case 'sphere':
        leafGeo = new THREE.SphereGeometry(
          size,
          params.widthSegments ?? 8,
          params.heightSegments ?? 6
        );
        break;
      case 'box':
        leafGeo = new THREE.BoxGeometry(
          size, size, size,
          params.widthSegments ?? 1,
          params.heightSegments ?? 1,
          params.depthSegments ?? 1
        );
        break;
      case 'cone':
        leafGeo = new THREE.ConeGeometry(
          size,
          size * 2,
          params.radialSegments ?? 6,
          params.heightSegments ?? 1
        );
        break;
      case 'tetrahedron':
        leafGeo = new THREE.TetrahedronGeometry(size, params.detail ?? 0);
        break;
      case 'octahedron':
        leafGeo = new THREE.OctahedronGeometry(size, params.detail ?? 0);
        break;
      case 'dodecahedron':
        leafGeo = new THREE.DodecahedronGeometry(size, params.detail ?? 0);
        break;
      case 'icosahedron':
      default:
        leafGeo = new THREE.IcosahedronGeometry(size, params.detail ?? 0);
        break;
    }

    // Optionally cut the bottom half of the geometry
    if (this.opts.leafCutBottom) {
      leafGeo = this._cutGeometryBottom(leafGeo);
    }

    const leafMat = new THREE.MeshStandardMaterial({
      roughness: 0.7,
      metalness: 0.0,
      transparent: this.opts.leafOpacity < 1,
      opacity: this.opts.leafOpacity,
      side: THREE[this.opts.leafSide]
    });

    this.leafMesh = new THREE.InstancedMesh(leafGeo, leafMat, count);
    this.leafMesh.instanceMatrix.setUsage(THREE.DynamicDrawUsage);
    this.leafMesh.castShadow = true;
    this.leafMesh.receiveShadow = true;

    const color = new THREE.Color();
    for (let i = 0; i < count; i++) {
      this.leafMesh.setMatrixAt(i, this._leafMatrices[i]);
      color.copy(this._leafColors[i]);
      this.leafMesh.setColorAt(i, color);

      // Log the final color for debugging
      if (i === 0) {
        console.log('Leaf color (first leaf):', {
          baseLeafColorHex: '0x' + this.opts.leafColor.toString(16),
          jitteredHex: '#' + this._leafColors[i].getHexString(),
          finalHex: '#' + color.getHexString(),
          finalRGB: { r: color.r, g: color.g, b: color.b }
        });
      }
    }
    // Tell three.js that instance colors changed
    this.leafMesh.instanceColor.needsUpdate = true;
    this.leafMesh.instanceMatrix.needsUpdate = true;

    // Keep backward-compat: put leaves under leavesGroup AND add to scene so shadows work
    this.leavesGroup.add(this.leafMesh);
    this.scene.add(this.leafMesh);
  }

  _buildRocks(center) {
    const o = this.opts;
    const count = o.rockCount | 0;
    if (count <= 0) return;

    const rockGeo = new THREE.IcosahedronGeometry(0.15, 0); // base primitive
    const rockMat = new THREE.MeshStandardMaterial({
      vertexColors: true,
      roughness: 1.0,
      metalness: 0.0
    });

    this.rocksMesh = new THREE.InstancedMesh(rockGeo, rockMat, count);
    this.rocksMesh.instanceMatrix.setUsage(THREE.DynamicDrawUsage);
    this.rocksMesh.receiveShadow = true;

    const tmpMat = new THREE.Matrix4();
    const tmpQuat = new THREE.Quaternion();
    const tmpScale = new THREE.Vector3();
    const tmpPos = new THREE.Vector3();
    const dir = new THREE.Vector3();
    const col = new THREE.Color();

    for (let i = 0; i < count; i++) {
      const r = this._lerp(0.5, 1, Math.sqrt(this._rng())) * this.opts.rockFieldRadius * this.opts.globalScale;
      const a = this._rng() * Math.PI * 2;
      tmpPos.set(center.x + Math.cos(a) * r, center.y, center.z + Math.sin(a) * r);

      // random non-uniform scale + flatten
      const uni = this._lerp(this.opts.rockScale[0], this.opts.rockScale[1], this._rng()) * this.opts.globalScale;
      const flatten = 1 - this.opts.rockFlatten;
      tmpScale.set(
        uni * (0.8 + 0.4 * this._rng()),
        uni * (0.4 + 0.6 * flatten),  // squash in Y
        uni * (0.8 + 0.4 * this._rng())
      );

      // random orientation
      tmpQuat.setFromAxisAngle(new THREE.Vector3(0, 1, 0), this._rng() * Math.PI * 2);

      tmpMat.compose(tmpPos, tmpQuat, tmpScale);
      this.rocksMesh.setMatrixAt(i, tmpMat);

      // color jitter
      col.copy(this._jitterHSV(new THREE.Color(this.opts.rockColor),
        this.opts.rockHueJitter,
        this.opts.rockSatJitter,
        this.opts.rockValJitter));
      this.rocksMesh.setColorAt(i, col);
    }
    if (this.rocksMesh.instanceColor) this.rocksMesh.instanceColor.needsUpdate = true;

    // Put under leavesGroup for backward-compat (your original code grouped rocks with leaves)
    this.leavesGroup.add(this.rocksMesh);
    this.scene.add(this.rocksMesh);
  }

  // -------- Utilities --------

  _mulberry32(a) {
    // Deterministic PRNG
    return function () {
      let t = a += 0x6D2B79F5;
      t = Math.imul(t ^ (t >>> 15), t | 1);
      t ^= t + Math.imul(t ^ (t >>> 7), t | 61);
      return ((t ^ (t >>> 14)) >>> 0) / 4294967296;
    };
  }

  _lerp(a, b, t) { return a + (b - a) * t; }

  _smoothstep(a, b, t) {
    t = Math.min(1, Math.max(0, (t - a) / (b - a)));
    return t * t * (3 - 2 * t);
  }

  _jitterHSV(color, hJit = 0, sJit = 0, vJit = 0) {
    // Convert RGB -> HSV (simple util), jitter, back to RGB
    const hsv = this._rgbToHsv(color.r, color.g, color.b);
    hsv.h = (hsv.h + (this._rng() * 2 - 1) * hJit + 1) % 1;
    hsv.s = THREE.MathUtils.clamp(hsv.s + (this._rng() * 2 - 1) * sJit, 0, 1);
    hsv.v = THREE.MathUtils.clamp(hsv.v + (this._rng() * 2 - 1) * vJit, 0, 1);
    const rgb = this._hsvToRgb(hsv.h, hsv.s, hsv.v);
    return new THREE.Color(rgb.r, rgb.g, rgb.b);
  }

  _rgbToHsv(r, g, b) {
    const max = Math.max(r, g, b), min = Math.min(r, g, b);
    const d = max - min;
    let h = 0;
    if (d !== 0) {
      switch (max) {
        case r: h = ((g - b) / d + (g < b ? 6 : 0)); break;
        case g: h = (b - r) / d + 2; break;
        case b: h = (r - g) / d + 4; break;
      }
      h /= 6;
    }
    const s = max === 0 ? 0 : d / max;
    const v = max;
    return { h, s, v };
  }

  _hsvToRgb(h, s, v) {
    const i = Math.floor(h * 6);
    const f = h * 6 - i;
    const p = v * (1 - s);
    const q = v * (1 - f * s);
    const t = v * (1 - (1 - f) * s);
    let r, g, b;
    switch (i % 6) {
      case 0: r = v; g = t; b = p; break;
      case 1: r = q; g = v; b = p; break;
      case 2: r = p; g = v; b = t; break;
      case 3: r = p; g = q; b = v; break;
      case 4: r = t; g = p; b = v; break;
      case 5: r = v; g = p; b = q; break;
    }
    return { r, g, b };
  }
}
