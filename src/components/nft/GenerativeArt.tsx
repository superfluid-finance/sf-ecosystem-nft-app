// @ts-nocheck
import { useEffect, useRef } from "react";
import { PRNG } from "../../lib/utils";

/** Component that takes a seed, and display the generative art */
export const GenerativeArt = ({
  parentElement = window,
  seed = new Date().getTime(),
}: {
  parentElement?: any;
  seed?: number;
}) => {
  const canvasRef = useRef(null);

  //change this to change how the glass looks
  // between 1 and 0
  const refractionCoefficient = (PRNG(10, 1212, seed) / 10).toString();

  // changing this number changes the frequency of the pulsating effect
  // between 1 and 300. Safer between 20 and 100
  const lineFrequency = (PRNG(80, 3423, seed) + 20).toString();

  // changing this number changes the speed of the pulsating effect
  // between 1 and 36
  const speedModifier = (PRNG(7, 1234, seed) + 2).toString() + ".";

  //change this to change the thickness of the glass
  // between 0.1 and 1
  const thickness = ((PRNG(9, 1284, seed) + 1) / 10).toString();

  useEffect(() => {
    const canvas = canvasRef.current;
    // @ts-ignore
    const gl = canvas.getContext("webgl2");
    const dpr = window.devicePixelRatio;
    const touches = new Map();

    const vertexSource = `#version 300 es
        #ifdef GL_FRAGMENT_PRECISION_HIGH
        precision highp float;
        #else
        precision mediump float;
        #endif
        
        in vec2 position;
        
        void main(void) {
            gl_Position = vec4(position, 0., 1.);
        }
        `;

    const fragmentSource = `#version 300 es
        /*********
         * made by Matthias Hurrle (@atzedent)
         */
        
        #ifdef GL_FRAGMENT_PRECISION_HIGH
        precision highp float;
        #else
        precision mediump float;
        #endif
        
        out vec4 fragColor;
        
        uniform float time;
        uniform vec2 resolution;
        uniform vec2 touch;
        uniform int pointerCount;
        
        #define T time
        #define S smoothstep
        #define TAU 6.28318
        #define PHI (.5+.5*sqrt(5.))
        #define mouse (touch/resolution)
        #define hue(a) (.24+.4*cos(10.3*(a)+vec3(0,83,21)))
        #define rot(a) mat2(cos(a),-sin(a),sin(a),cos(a))
        
        float smin(float a, float b, float k) {
            float h = clamp(
            .5+.5*(b-a)/k,
            .0,
            1.
            );
        
            return mix(b, a, h)-k*h*(1.-h);
        }
        
        float noise(vec2 p) {
            float dist = 1.;
            vec2 f = fract(p);
        
            for(float x=-1.; x<=1.; x++)
            for(float y=-1.; y<=1.; y++) {
            vec2 p= vec2(x,y);
            float d = distance(p,f);
            dist = smin(dist,S(.0,1.,d),.1);
            }
            
            return dist;
        }
        
        // The pattern function generates a pattern based on the input uv coordinates.
        vec3 pattern(vec2 uv) {
            // Initialize the color of the lines to light green.
            vec3 col = vec3(1,2,1);
        
            // Define an array of points that will be used to generate the pattern.
            vec2 point[5]; //change the number of points and their positions. 
            // they are currently all behind the object
            point[0] = vec2(0, 1);
            point[1] = vec2(.50, .50);
            point[2] = vec2(1, 0);
            point[3] = vec2(1, 1);
            point[4] = vec2(0, 0);
        
            // Calculate the initial distance based on the resolution.
            float dist = sqrt(dot(resolution, vec2(2)));
        
            // Loop over each point in the array.
            for (int i = 0; i < 5; i++) {
            // Calculate the distance from the current uv coordinates to the current point.
            float d = distance(uv, point[i] - .5);
        
            // Update the distance to be the minimum of the current distance and the calculated distance.
            dist = min(dist, d);
            }
        
            // Add the distance to the color. This will make the color lighter the further away it is from the points.
            col -= dist; // by subtracting rather than adding, the background is made black
        
            // Subtract a value based on the sine of the time and the distance. This creates a pulsating effect.
            col -= S(
                0.94, 
                .90, 
                abs(
                sin(T*0.25*
                    ${speedModifier} // changing this number changes the speed of the pulsating effect
                    - ${lineFrequency}. // changing this number changes the frequency of the pulsating effect
                    * sqrt(dist)
                    )));
        
            // Return the final color.
            return col;
        }
        
        float box(vec3 p, vec3 s, float r) {
            p = abs(p)-s;
        
            return length(max(p,.0))+
            min(.0, max(max(p.x, p.y), p.z))-r;
        }
        
        float disc(vec3 p, vec2 s, float r) {
            vec2 e = vec2(length(abs(p.xy)), abs(p.z)) - s;
        
            return length(max(e, .0)) +
                min(.0, max(e.x, e.y)) - r;
        }
        
        float mat=.0;
        float map(vec3 p) {
            vec3 q=p;
            q.z+=-abs(noise(q.xy*.1)*.1);
            q.z=-q.z;
            float d=5e5,
            room=-disc(p, vec2(2e2,9), .0),
            bx=box(
            p //q+S(-.2,3.,noise((p-vec3(10.,10.,0)).xy*2.))*.025
            ,vec3(1.25,1.25,.05),
            ${thickness} //change this to change the roundness of the glass
            );
            
            d=min(d, room);
            d=min(d, bx);
        
            if (d==bx) mat=1.;
            else mat=.0;
        
            return d;
        }
        
        vec3 norm(vec3 p) {
            vec2 e = vec2(1e-3, 0);
            float d = map(p);
            vec3 n = d-vec3(
            map(p-e.xyy),
            map(p-e.yxy),
            map(p-e.yyx)
            );
        
            return normalize(n);
        }
        
        void cam(inout vec3 p) {
            if(pointerCount > 0) {
            float newY = -mouse.y*acos(-1.)+acos(.0);
            float newX = acos(-1.)-mouse.x*acos(-1.) * 2.;
        
            // Clamp the new angles to be within -45 and 45 degrees in radians
            newY = clamp(newY, -0.785398, 0.785398);
            newX = clamp(newX, -0.785398, 0.785398);
        
            p.yz *= rot(newY);
            p.xz *= rot(newX);
            }
        }
        
        void main(void) {
            // Calculate normalized device coordinates, ranging from -1 to 1, for the current fragment.
            // gl_FragCoord.xy gives the coordinates of the current fragment in pixels.
            // resolution.xy gives the resolution of the screen in pixels.
            // The result is a 2D vector where x and y range from -1 to 1.
            vec2 uv = (
            gl_FragCoord.xy - .5 * resolution.xy
            ) / min(resolution.x, resolution.y);
        
            // Initialize variables for the color, camera position, camera direction, and light position.
            vec3 col = vec3(0), // The color of the current fragment.
            cameraPosition = vec3(0, 0, -6), // The position of the camera.
            cameraDirection = normalize(vec3(uv, 1)), // The direction the camera is pointing.
            lightPosition = vec3(1, 2, -3); // The position of the light.
        
            // Apply the camera transformation to the camera position, direction, and light position.
            cam(cameraPosition);
            cam(cameraDirection);
            cam(lightPosition);
        
            // Initialize the ray position to the camera position.
            vec3 p = cameraPosition;
        
            // Initialize constants for the number of raymarching steps and the maximum raymarching distance.
            const float steps = 100., maxd = 200.;
            // Initialize variables for the current raymarching distance, the current material index, the current noise value, and the current side.
            float dd = .0, at = .0, bnz = .0, side = 1.;
            for (float i=.0; i<steps; i++) {
            float d=map(p)*side;
        
            if (d<1e-3) {
                vec3 n=norm(p)*side,
                l=normalize(lightPosition-p);
                
                if (dot(l,n) < .0) l=-l;
        
                float diff=S(.0,1.,dot(l,n)),
                fres = S(1.,.0,dot(-l,n));
        
                if (mat == .0) { //if not glass
                if (bnz++>1.) break;
        
                if (abs(p.z)>4.49) {
                    col=mix(col,pattern(p.xy*.1),.5);
                    break;
                    
                } else if (abs(p.x)>1e2 || abs(p.y)>1e2) {
                    col=max(col,vec3(1));
                }
        
                break;
                } else { // if glass, it probably hit the box
                vec3 r=reflect(cameraDirection,n),
                h=normalize(l-r);
        
                vec3 mat = vec3(0);
                mat += diff * fres * (
                    2.8 * pow(max(.0, dot(h, n)), 64.) +
                    .5 * pow(max(.0, dot(r, n)), 32.)
                );
                mat+=5e-2*fres*vec3(0,0,0);
                mat-=5e-2*diff*vec3(0,100,0);
                    
                col=mix(col,mat*2.,fres);
                side = -side;
        
                vec3 rdo=refract(cameraDirection, n, 1.+side*
                    ${refractionCoefficient} //change this to change how the glass looks
                );
        
                if (dot(rdo,rdo) == .0) {
                    rdo = r;
                }
                cameraDirection=rdo;
                d=1e-2;
                }    
            }
            p+=cameraDirection*d;
            dd+=d;
            at+=.1*(.1/dd);
            }
        
            col=exp(-col*16.);
            col=sqrt(col);
            col=exp(-col*9.);
            col+=at;
            fragColor = vec4(col, 1);
        }
        `;

    let time;
    let buffer;
    let program;
    let touch;
    let resolution;
    let pointerCount;
    let vertices = [];
    let touching = false;

    function resize() {
      let width = parentElement?.clientWidth || window.innerWidth;
      let height = parentElement?.clientHeight - 100 || window.innerHeight;

      canvas.width = width * dpr;
      canvas.height = height * dpr;

      gl.viewport(0, 0, width * dpr, height * dpr);
    }

    function compile(shader, source) {
      gl.shaderSource(shader, source);
      gl.compileShader(shader);

      if (!gl.getShaderParameter(shader, gl.COMPILE_STATUS)) {
        console.error(gl.getShaderInfoLog(shader));
      }
    }

    function setup() {
      const vs = gl.createShader(gl.VERTEX_SHADER);
      const fs = gl.createShader(gl.FRAGMENT_SHADER);

      program = gl.createProgram();

      compile(vs, vertexSource);
      compile(fs, fragmentSource);

      gl.attachShader(program, vs);
      gl.attachShader(program, fs);
      gl.linkProgram(program);

      if (!gl.getProgramParameter(program, gl.LINK_STATUS)) {
        console.error(gl.getProgramInfoLog(program));
      }

      vertices = [
        -1.0, -1.0, 1.0, -1.0, -1.0, 1.0, -1.0, 1.0, 1.0, -1.0, 1.0, 1.0,
      ];

      buffer = gl.createBuffer();

      gl.bindBuffer(gl.ARRAY_BUFFER, buffer);
      gl.bufferData(
        gl.ARRAY_BUFFER,
        new Float32Array(vertices),
        gl.STATIC_DRAW,
      );

      const position = gl.getAttribLocation(program, "position");

      gl.enableVertexAttribArray(position);
      gl.vertexAttribPointer(position, 2, gl.FLOAT, false, 0, 0);

      time = gl.getUniformLocation(program, "time");
      touch = gl.getUniformLocation(program, "touch");
      pointerCount = gl.getUniformLocation(program, "pointerCount");
      resolution = gl.getUniformLocation(program, "resolution");
    }

    function draw(now) {
      gl.clearColor(0, 0, 0, 1);
      gl.clear(gl.COLOR_BUFFER_BIT);

      gl.useProgram(program);
      gl.bindBuffer(gl.ARRAY_BUFFER, null);
      gl.bindBuffer(gl.ARRAY_BUFFER, buffer);

      gl.uniform1f(time, now * 0.001);
      gl.uniform2f(touch, ...getTouches());
      gl.uniform1i(pointerCount, touches.size);
      gl.uniform2f(resolution, canvas.width, canvas.height);
      gl.drawArrays(gl.TRIANGLES, 0, vertices.length * 0.5);
    }

    function getTouches() {
      if (!touches.size) {
        return [0, 0];
      }

      for (let [id, t] of touches) {
        const result = [dpr * t.clientX, dpr * (innerHeight - t.clientY)];

        return result;
      }
    }

    function loop(now) {
      draw(now);
      requestAnimationFrame(loop);
    }

    function init() {
      setup();
      resize();
      loop(0);
    }

    init();
    window.onresize = resize;
    canvas.onpointerdown = (e) => {
      touching = true;
      touches.set(e.pointerId, e);
    };
    canvas.onpointermove = (e) => {
      if (!touching) return;
      touches.set(e.pointerId, e);
    };
    canvas.onpointerup = (e) => {
      touching = false;
      touches.clear();
    };
    canvas.onpointerout = (e) => {
      touching = false;
      touches.clear();
    };
  }, [seed, parentElement]);

  return (
    <div className="w-full h-full">
      <canvas className="w-full h-full object-cover" ref={canvasRef}></canvas>
    </div>
  );
};
