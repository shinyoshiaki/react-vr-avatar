import * as Comlink from "comlink";

import { BoxGeometry, CanvasTexture, Mesh, MeshBasicMaterial } from "three";
import React, { FC, Fragment, useContext, useEffect, useRef } from "react";

import CanvasWorker from "./debugUI.worker";
import { ContainerContext } from "../../Main";
import { useFrame } from "react-three-fiber";

const DebugUI: FC<{ text: string; mesh: Mesh }> = ({ text, mesh }) => {
  const workerRef = useRef<Comlink.Remote<CanvasWorker>>();

  const canvasRef = useRef(document.createElement("canvas"));

  useEffect(() => {
    const canvas = canvasRef.current;
    canvas.width = 1024;
    canvas.height = 1024;

    const ctx = canvas.getContext("2d")!;
    ctx.fillStyle = "#002000";
    ctx.fillRect(0, 0, canvas.width, canvas.height);

    const texture = new CanvasTexture(canvas);
    const mat = new MeshBasicMaterial({ map: texture });
    mesh.material = mat;
    texture.needsUpdate = true;
  }, []);

  useEffect(() => {
    const canvas = canvasRef.current;
    const ctx = canvas.getContext("2d")!;
    ctx.fillStyle = "#002000";
    ctx.fillRect(0, 0, canvas.width, canvas.height);

    const fHeight = 20;
    ctx.font = fHeight.toString() + "px monospace";
    ctx.fillStyle = "#ffffff";

    const px = 8;
    let py = fHeight + 30;
    const arr = text.split("\n");
    arr.forEach(s => {
      ctx.fillText(s, px, fHeight + py);
      py += fHeight + 4;
    });
    const texture = new CanvasTexture(canvas);
    const mat = new MeshBasicMaterial({ map: texture });
    mesh.material = mat;
    texture.needsUpdate = true;
  }, [text]);

  return <Fragment />;
};

export default DebugUI;
