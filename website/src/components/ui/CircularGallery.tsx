"use client";

import {
  Camera,
  Mesh,
  Plane,
  Program,
  Renderer,
  Texture,
  Transform,
} from "ogl";
import { useEffect, useRef, useState } from "react";

type Item = { src: string; caption: string };

export function CircularGallery({
  items,
  index,
  select,
}: {
  items: readonly Item[];
  index: number;
  select: (index: number) => void;
}) {
  const host = useRef<HTMLDivElement>(null);
  const target = useRef(index);
  const drag = useRef<number | null>(null);
  const [ready, setReady] = useState(false);

  useEffect(() => {
    target.current = index;
  }, [index]);

  useEffect(() => {
    const element = host.current;
    if (!element || items.length < 2) return;
    let renderer: Renderer;
    try {
      renderer = new Renderer({
        alpha: true,
        dpr: Math.min(
          devicePixelRatio,
          matchMedia("(max-width: 700px)").matches ? 1.25 : 1.5,
        ),
      });
    } catch {
      return;
    }
    const gl = renderer.gl;
    const scene = new Transform();
    const camera = new Camera(gl, { fov: 45 });
    camera.position.z = 10;
    const geometry = new Plane(gl, { widthSegments: 28, heightSegments: 12 });
    let disposed = false;
    let loaded = 0;
    const cards = items.map(({ src }) => {
      const texture = new Texture(gl, { generateMipmaps: false });
      const photo = new window.Image();
      const program = new Program(gl, {
        transparent: true,
        uniforms: {
          map: { value: texture },
          bend: { value: 0 },
          visible: { value: 0 },
        },
        vertex: `
          attribute vec3 position; attribute vec2 uv;
          uniform mat4 modelViewMatrix; uniform mat4 projectionMatrix;
          uniform float bend; varying vec2 vUv;
          void main() { vUv=uv; vec3 p=position; p.z-=position.x*position.x*bend;
          gl_Position=projectionMatrix*modelViewMatrix*vec4(p,1.); }
        `,
        fragment: `
          precision mediump float; uniform sampler2D map; uniform float visible; varying vec2 vUv;
          void main() { if (visible < .5) discard; gl_FragColor=texture2D(map,vUv); }
        `,
      });
      const mesh = new Mesh(gl, { geometry, program });
      mesh.setParent(scene);
      photo.onload = () => {
        if (disposed) return;
        texture.image = photo;
        program.uniforms.visible.value = 1;
        if (++loaded === items.length) setReady(true);
      };
      photo.src = src;
      return { mesh, photo, program, texture };
    });
    element.appendChild(gl.canvas);
    const lost = () => setReady(false);
    gl.canvas.addEventListener("webglcontextlost", lost);
    let aspect = 1;
    const resize = () => {
      const { clientWidth: width, clientHeight: height } = element;
      if (!width || !height) return;
      aspect = width / height;
      renderer.setSize(width, height);
      camera.perspective({ aspect });
    };
    const observer = new ResizeObserver(resize);
    observer.observe(element);
    resize();
    let current = target.current;
    let frame = 0;
    let inView = false;
    const render = () => {
      let distance = target.current - current;
      distance -= Math.round(distance / cards.length) * cards.length;
      current += distance * 0.09;
      const viewWidth = 8.28 * aspect;
      const width = Math.min(5.9, viewWidth * (aspect < 1.25 ? 0.9 : 0.76));
      cards.forEach(({ mesh, photo, program }, i) => {
        let offset = i - current;
        offset -= Math.round(offset / cards.length) * cards.length;
        mesh.visible = Math.abs(offset) < 2.5;
        mesh.position.set(
          offset * (width + 0.38),
          -Math.min(1.35, offset * offset * 0.35),
          -Math.abs(offset) * 0.42,
        );
        mesh.rotation.z = -Math.max(-2, Math.min(2, offset)) * 0.15;
        mesh.scale.set(
          width,
          Math.min(
            5.3,
            width / (photo.naturalWidth / photo.naturalHeight || 1.5),
          ),
          1,
        );
        program.uniforms.bend.value = Math.min(0.35, Math.abs(distance) * 0.18);
      });
      renderer.render({ scene, camera });
      if (inView) frame = requestAnimationFrame(render);
    };
    const visibility = new IntersectionObserver(([entry]) => {
      inView = entry.isIntersecting;
      cancelAnimationFrame(frame);
      if (inView) frame = requestAnimationFrame(render);
    });
    visibility.observe(element);
    return () => {
      disposed = true;
      visibility.disconnect();
      observer.disconnect();
      cancelAnimationFrame(frame);
      gl.canvas.removeEventListener("webglcontextlost", lost);
      cards.forEach(({ photo, program, texture }) => {
        photo.onload = null;
        program.remove();
        gl.deleteTexture(texture.texture);
      });
      geometry.remove();
      gl.canvas.remove();
    };
  }, [items]);

  return (
    <div
      ref={host}
      className="project-circular-gallery"
      data-ready={ready}
      aria-hidden="true"
      onPointerDown={(event) => {
        drag.current = event.clientX;
        event.currentTarget.setPointerCapture(event.pointerId);
      }}
      onPointerCancel={() => {
        drag.current = null;
      }}
      onPointerUp={(event) => {
        if (drag.current === null) return;
        const difference = drag.current - event.clientX;
        drag.current = null;
        if (Math.abs(difference) > 25) select(index + Math.sign(difference));
      }}
    />
  );
}
