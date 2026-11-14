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
import { gsap } from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";
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
  const drag = useRef<{ x: number; index: number } | null>(null);
  const wheelTotal = useRef(0);
  const selectRef = useRef(select);
  useEffect(() => {
    selectRef.current = select;
  }, [select]);
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
        dpr: 1,
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
    let needsDraw = true;
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
        needsDraw = true;
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
      // Use the screen density while staying within a bounded pixel budget.
      renderer.dpr = Math.min(
        devicePixelRatio || 1,
        3,
        Math.sqrt(1_500_000 / (width * height)),
      );
      renderer.setSize(width, height);
      needsDraw = true;
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
      if (inView) frame = requestAnimationFrame(render);
      if (!needsDraw && Math.abs(distance) < 0.001) return;
      needsDraw = Math.abs(distance) >= 0.001;
      current += needsDraw ? distance * 0.09 : distance;
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

  useEffect(() => {
    const element = host.current;
    const section = element?.closest(".project-layout");
    if (!element || !section || !ready) return;
    gsap.registerPlugin(ScrollTrigger);
    const trigger = ScrollTrigger.create({
      trigger: section,
      start: "top 85%",
      end: "bottom 25%",
      onUpdate({ progress }) {
        if (drag.current) return;
        const position = progress * (items.length - 1);
        target.current = position;
        selectRef.current(Math.round(position));
      },
    });
    const onWheel = (event: WheelEvent) => {
      if (event.ctrlKey || Math.abs(event.deltaX) <= Math.abs(event.deltaY))
        return;
      wheelTotal.current += event.deltaX;
      if (Math.abs(wheelTotal.current) < 65) return;
      selectRef.current(
        Math.round(target.current) + Math.sign(wheelTotal.current),
      );
      wheelTotal.current = 0;
    };
    element.addEventListener("wheel", onWheel, { passive: true });
    return () => {
      trigger.kill();
      element.removeEventListener("wheel", onWheel);
    };
  }, [items.length, ready]);

  return (
    <div
      ref={host}
      className="project-circular-gallery"
      data-ready={ready}
      aria-hidden="true"
      onPointerDown={(event) => {
        if (event.button !== 0) return;
        drag.current = { x: event.clientX, index };
        event.currentTarget.setPointerCapture(event.pointerId);
      }}
      onPointerMove={(event) => {
        if (!drag.current) return;
        target.current =
          drag.current.index +
          (drag.current.x - event.clientX) /
            Math.max(120, event.currentTarget.clientWidth * 0.55);
      }}
      onPointerCancel={() => {
        drag.current = null;
        target.current = index;
      }}
      onPointerUp={(event) => {
        if (drag.current === null) return;
        const { x, index: start } = drag.current;
        const difference = x - event.clientX;
        drag.current = null;
        target.current =
          start + (Math.abs(difference) > 25 ? Math.sign(difference) : 0);
        select(Math.round(target.current));
      }}
    />
  );
}
