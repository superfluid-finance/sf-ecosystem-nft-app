// @ts-nocheck
import React, { useEffect, useRef } from "react";

/** Component that takes a seed, and display the generative art */
const GenArt = ({
  parentElement = window,
  seed = 123456,
}: {
  parentElement?: any;
  seed?: number;
}) => {
  const canvasRef = useRef(null);

  function PRNG(e, o) {
    return (
      `${((2147483648 - 1) & Math.imul(48271, seed / o)) / 2147483648}`
        .split("")
        .slice(-10)
        .join("") % e
    );
  }
  function colorDifference(e, o) {
    let t = (e[0] - o[0]) / 2,
      r = e[0] - o[0],
      n = e[1] - o[1],
      c = e[2] - o[2];
    return Math.sqrt(
      (((512 + t) * r * r) >> 8) + 4 * n * n + (((767 - t) * c * c) >> 8),
    );
  }
  const vec3Color = (e) => `vec3(${e[0] / 255},${e[1] / 255},${e[2] / 255})`,
    randomColour = (e) => [
      PRNG(255, 11 + e),
      PRNG(255, 34 + e),
      PRNG(255, 14 + e),
    ];
  let glassColor,
    bgColor,
    diff = 35,
    threshold = 200,
    i = 0;
  do
    (bgColor = randomColour(i)),
      (glassColor = randomColour(diff)),
      (diff = colorDifference(bgColor, glassColor)),
      i++;
  while (diff < threshold);
  console.log("color difference:", diff);
  const base = seed % 2 > 0 ? "light" : "dark";
  console.log("bgColor:", bgColor), console.log("glassColor:", glassColor);
  const generateSeeds = (e) => {
      let o = [[], []];
      for (let t = 0; t < e; t++)
        (o[0][t] = (PRNG(10, t) / 10).toString()),
          (o[1][t] = (PRNG(10, 100 + t) / 10).toString());
      return o;
    },
    pointLength = PRNG(9, 1234) + 1,
    pointSeeds = generateSeeds(pointLength);
  console.log(`points: 
  ${pointSeeds[0].map((e, o) => `point_${o} = (${e}, ${pointSeeds[1][o]});`).join("\n")}`);
  let refractionCoefficient = (PRNG(16, 1212) / 10 + 0.1).toString();
  refractionCoefficient.includes(".") || (refractionCoefficient += "."),
    console.log("refraction:", refractionCoefficient);
  const noiseModifier = (PRNG(98, 1234) / 100 + 0.01).toString();
  console.log("noise:", noiseModifier);
  const lineFrequency = (PRNG(80, 3423) + 20).toString();
  console.log("frequency:", lineFrequency);
  const speedModifier = (PRNG(7, 1234) + 2).toString() + ".";
  console.log("speed:", speedModifier);
  const thickness = (PRNG(9, 1284) / 10 + 0.1).toString();
  console.log("thickness:", thickness);

  useEffect(() => {
    const canvas = canvasRef.current,
      gl = canvas.getContext("webgl2"),
      dpr = window.devicePixelRatio,
      touches = new Map();

    const vertexSource = `#version 300 es
    #ifdef GL_FRAGMENT_PRECISION_HIGH
    precision highp float;
    #else
    precision mediump float;
    #endif
    in vec2 position;void main(void){gl_Position = vec4(position, 0., 1.);}`,
      fragmentSource = `#version 300 es
    /*********
    * made by Matthias Hurrle (@atzedent)
    */
    #ifdef GL_FRAGMENT_PRECISION_HIGH
    precision highp float;
    #else
    precision mediump float;
    #endif
    out vec4 fragColor;uniform float time;uniform vec2 resolution;uniform vec2 touch;uniform int pointerCount; 
    #define T time
    #define S smoothstep
    #define mouse (touch/resolution)
    #define rot(a) mat2(cos(a),-sin(a),sin(a),cos(a))
    float mat=.0;float smin(float a, float b, float k){float h=clamp(.5+.5*(b-a)/k,.0,1.);return mix(b,a,h)-k*h*(1.-h);}float noise(vec2 p){float dist=1.;vec2 f=fract(p);for(float x=-1.;x<=1.;x++)for(float y=-1.;y<=1.;y++){vec2 p=vec2(x,y);float d=distance(p,f);dist=smin(dist,S(.0,1.,d),.1);}return dist;}vec3 ptr(vec2 uv){vec2 point[${pointLength}];${pointSeeds[0].map((e, o) => `point[${o}]=vec2(${e},${pointSeeds[1][o]});`).join("")}float dist=sqrt(dot(resolution,vec2(2)));for(int i=0;i<${pointLength};i++){dist = min(dist, distance(uv, point[i] - .5));};return ${vec3Color(bgColor)}${"dark" == base ? "-" : "+"}dist ${"dark" == base ? "+" : "-"} S(0.94,.90,abs(sin(T*0.25*${speedModifier}-${lineFrequency}.*sqrt(dist))));}float disc(vec3 p, vec2 s, float r){vec2 e=vec2(length(abs(p.xy)),abs(p.z))-s;return length(max(e,.0))+min(.0,max(e.x,e.y))-r;}float box(vec3 p, vec3 s, float r){p=abs(p)-s;return length(max(p,.0))+min(.0,max(max(p.x,p.y),p.z))-r;}vec3 qz(vec3 q){q.z=-(q.z-abs(noise(q.xy*.1)*.1));return q;}float cb(vec3 q){return box(qz(q),vec3(.5,.5,.4),0.001);}float map(vec3 p){vec3 q=qz(p);float combo=max(box(q+S(-0.99,${noiseModifier},noise((q-vec3(50.,40.,0)).xy*1.))*.05,vec3(2.5,2.5,.01),.1),-min(min(cb(p+vec3(1.,1.,0)),cb(p+vec3(-1.,-1.,0))),min(cb(p+vec3(-1.,0,0)),cb(p+vec3(0,-1.,0))))),d=min(min(5e5,-disc(p,vec2(2000,8),.0)),combo);if(d==combo)mat=1.;else mat=.0;return d;}vec3 norm(vec3 p){vec2 e = vec2(1e-3, 0);return normalize(map(p)-vec3(map(p-e.xyy),map(p-e.yxy),map(p-e.yyx)));}void cam(inout vec3 p){if(pointerCount>0){float newY=-mouse.y*acos(-1.)+acos(.0);float newX=acos(-1.)-mouse.x*acos(-1.)*2.;newY=clamp(newY,-0.785398,0.785398);newX=clamp(newX,-0.785398,0.785398);p.yz*=rot(newY);p.xz*=rot(newX);}}void main(void){vec2 uv=(gl_FragCoord.xy-.5*resolution.xy)/min(resolution.x,resolution.y);vec3 col=vec3(${"dark" == base ? 0 : 1}),cp=vec3(0,0,-6),cd=normalize(vec3(uv,1)),lp=vec3(1,2,-3);cam(cp);cam(cd);cam(lp);vec3 p=cp;const float steps=100.,maxd=200.;float dd=.0,at=.0,bnz=.0,side=1.;for(float i=.0;i<steps;i++){float d=map(p)*side;if(d<1e-3){vec3 n=norm(p)*side,l=normalize(lp-p);if(dot(l,n)<.0)l=-l;float diff=S(.0,1.,dot(l,n)),fres = S(1.,.0,dot(-l,n));if(mat==.0){if(bnz++>1.)break;if(abs(p.z)>4.49){col=mix(col,ptr(p.xy*.1),.5);break;} else if (abs(p.x)>1e2||abs(p.y)>1e2){col=max(col,vec3(1));};break;}else{vec3 r=reflect(cd,n);col=mix(col,${vec3Color(glassColor)}+5e-2*fres*vec3(0,0,0)-5e-2*diff*vec3(0,0,0)*2.,fres);side=-side;vec3 rdo=refract(cd,n,1.+side*${refractionCoefficient});if(dot(rdo,rdo)==.0){cd=r;};cd=rdo;d=1e-2;}};p+=cd*d;dd+=d;at+=.1*(.1/dd);};col+=at;fragColor = vec4(col, 1);}`;
    let time,
      buffer,
      program,
      touch,
      resolution,
      pointerCount,
      vertices = [],
      touching = !1;
    function resize() {
      let e = parentElement?.clientWidth || window.innerWidth;
      let o = parentElement?.clientHeight - 100 || window.innerHeight;
      (canvas.width = e * dpr),
        (canvas.height = o * dpr),
        gl.viewport(0, 0, e * dpr, o * dpr);
    }
    function compile(e, o) {
      gl.shaderSource(e, o),
        gl.compileShader(e),
        gl.getShaderParameter(e, gl.COMPILE_STATUS) ||
          console.error(gl.getShaderInfoLog(e));
    }
    function setup() {
      let e = gl.createShader(gl.VERTEX_SHADER),
        o = gl.createShader(gl.FRAGMENT_SHADER);
      (program = gl.createProgram()),
        compile(e, vertexSource),
        compile(o, fragmentSource),
        gl.attachShader(program, e),
        gl.attachShader(program, o),
        gl.linkProgram(program),
        gl.getProgramParameter(program, gl.LINK_STATUS) ||
          console.error(gl.getProgramInfoLog(program)),
        (vertices = [-1, -1, 1, -1, -1, 1, -1, 1, 1, -1, 1, 1]),
        (buffer = gl.createBuffer()),
        gl.bindBuffer(gl.ARRAY_BUFFER, buffer),
        gl.bufferData(
          gl.ARRAY_BUFFER,
          new Float32Array(vertices),
          gl.STATIC_DRAW,
        );
      let t = gl.getAttribLocation(program, "position");
      gl.enableVertexAttribArray(t),
        gl.vertexAttribPointer(t, 2, gl.FLOAT, !1, 0, 0),
        (time = gl.getUniformLocation(program, "time")),
        (touch = gl.getUniformLocation(program, "touch")),
        (pointerCount = gl.getUniformLocation(program, "pointerCount")),
        (resolution = gl.getUniformLocation(program, "resolution"));
    }
    function draw(e) {
      gl.clearColor(0, 0, 0, 1),
        gl.clear(gl.COLOR_BUFFER_BIT),
        gl.useProgram(program),
        gl.bindBuffer(gl.ARRAY_BUFFER, null),
        gl.bindBuffer(gl.ARRAY_BUFFER, buffer),
        gl.uniform1f(time, 0.001 * e),
        gl.uniform2f(touch, ...getTouches()),
        gl.uniform1i(pointerCount, touches.size),
        gl.uniform2f(resolution, canvas.width, canvas.height),
        gl.drawArrays(gl.TRIANGLES, 0, 0.5 * vertices.length);
    }
    function getTouches() {
      if (!touches.size) return [0, 0];
      for (let [e, o] of touches) {
        let t = [dpr * o.clientX, dpr * (innerHeight - o.clientY)];
        return t;
      }
    }
    function loop(e) {
      draw(e), requestAnimationFrame(loop);
    }
    function init() {
      setup(), resize(), loop(0);
    }
    init(),
      (window.onresize = resize),
      (canvas.onpointerdown = (e) => {
        (touching = !0), touches.set(e.pointerId, e);
      }),
      (canvas.onpointermove = (e) => {
        touching && touches.set(e.pointerId, e);
      }),
      (canvas.onpointerup = (e) => {
        touching = !1;
      }),
      (canvas.onpointerout = (e) => {
        touching = !1;
      });
  }, [seed, parentElement]);

  return (
    <div className="w-full h-full">
      <canvas
        className="w-full h-[50vh] md:h-full object-cover rounded-t-2xl md:rounded-b-2xl"
        ref={canvasRef}
      ></canvas>
    </div>
  );
};

export const GenerativeArt = React.memo(GenArt);
