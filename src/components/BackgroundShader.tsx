import React, { useEffect, useRef } from 'react';

export const BackgroundShader: React.FC = () => {
  const canvasRef = useRef<HTMLCanvasElement | null>(null);

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;

    let animationFrameId: number;

    function syncSize() {
      if (!canvas) return;
      const w = window.innerWidth || 1280;
      const h = window.innerHeight || 720;
      if (canvas.width !== w || canvas.height !== h) {
        canvas.width = w;
        canvas.height = h;
      }
    }

    syncSize();
    window.addEventListener('resize', syncSize);

    const gl = canvas.getContext('webgl') || canvas.getContext('experimental-webgl') as WebGLRenderingContext | null;
    if (!gl) return;

    const vs = `attribute vec2 a_position;
varying vec2 v_texCoord;
void main() {
  v_texCoord = a_position * 0.5 + 0.5;
  gl_Position = vec4(a_position, 0.0, 1.0);
}`;

    const fs = `precision highp float;
uniform float u_time;
uniform vec2 u_resolution;

void main() {
    vec2 uv = gl_FragCoord.xy / u_resolution.xy;
    float time = u_time * 0.2;
    
    // Deep black grid matrix & ambient risk glow
    vec2 grid = fract(uv * 22.0);
    float line = smoothstep(0.0, 0.04, grid.x) * smoothstep(0.0, 0.04, grid.y);
    
    // Deep obsidian tones (#05070D to #0A0E1A)
    vec3 color1 = vec3(0.019, 0.027, 0.051); 
    vec3 color2 = vec3(0.039, 0.055, 0.102); 
    
    vec3 finalColor = mix(color1, color2, uv.y + 0.15 * sin(time + uv.x * 2.0));
    finalColor += (1.0 - line) * 0.04; // Cyber matrix grid
    
    // Subtle pulsing indigo/cyan cosmic risk nodes
    float pulse1 = sin(uv.x * 5.0 + time * 1.2) * cos(uv.y * 5.0 - time);
    finalColor += vec3(0.38, 0.40, 0.95) * pow(max(0.0, pulse1), 8.0) * 0.08;

    float pulse2 = cos(uv.x * 3.0 - time * 0.8) * sin(uv.y * 3.0 + time);
    finalColor += vec3(0.0, 0.85, 0.95) * pow(max(0.0, pulse2), 10.0) * 0.05;

    gl_FragColor = vec4(finalColor, 1.0);
}`;

    function createShader(type: number, source: string): WebGLShader | null {
      if (!gl) return null;
      const shader = gl.createShader(type);
      if (!shader) return null;
      gl.shaderSource(shader, source);
      gl.compileShader(shader);
      if (!gl.getShaderParameter(shader, gl.COMPILE_STATUS)) {
        gl.deleteShader(shader);
        return null;
      }
      return shader;
    }

    const vertShader = createShader(gl.VERTEX_SHADER, vs);
    const fragShader = createShader(gl.FRAGMENT_SHADER, fs);
    if (!vertShader || !fragShader) return;

    const prog = gl.createProgram();
    if (!prog) return;
    gl.attachShader(prog, vertShader);
    gl.attachShader(prog, fragShader);
    gl.linkProgram(prog);

    if (!gl.getProgramParameter(prog, gl.LINK_STATUS)) {
      return;
    }

    gl.useProgram(prog);

    const buf = gl.createBuffer();
    gl.bindBuffer(gl.ARRAY_BUFFER, buf);
    gl.bufferData(gl.ARRAY_BUFFER, new Float32Array([-1, -1, 1, -1, -1, 1, 1, 1]), gl.STATIC_DRAW);

    const pos = gl.getAttribLocation(prog, 'a_position');
    gl.enableVertexAttribArray(pos);
    gl.vertexAttribPointer(pos, 2, gl.FLOAT, false, 0, 0);

    const uTime = gl.getUniformLocation(prog, 'u_time');
    const uRes = gl.getUniformLocation(prog, 'u_resolution');

    let startTime = performance.now();

    function render() {
      if (!gl || !canvas) return;
      const currentTime = performance.now() - startTime;
      gl.viewport(0, 0, canvas.width, canvas.height);
      if (uTime) gl.uniform1f(uTime, currentTime * 0.001);
      if (uRes) gl.uniform2f(uRes, canvas.width, canvas.height);
      gl.drawArrays(gl.TRIANGLE_STRIP, 0, 4);
      animationFrameId = requestAnimationFrame(render);
    }

    render();

    return () => {
      window.removeEventListener('resize', syncSize);
      cancelAnimationFrame(animationFrameId);
    };
  }, []);

  return (
    <div className="fixed inset-0 z-0 pointer-events-none opacity-60">
      <canvas ref={canvasRef} className="w-full h-full block" />
      <div className="absolute inset-0 bg-[#05070D]/80 backdrop-blur-[2px]" />
    </div>
  );
};
