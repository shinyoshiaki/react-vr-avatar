import * as THREE from "three";

import { Color, FrontSide, Material, Vector2, Vector3 } from "three";
import React, { FC, Fragment, useContext, useEffect } from "react";

import { ContainerContext } from "../Main";
import { Reflector } from "three/examples/jsm/objects/Reflector";

const Mirror: FC<{ size: Vector2; position: Vector3 }> = ({
  position,
  size
}) => {
  const container = useContext(ContainerContext);

  useEffect(() => {
    const geometry = new THREE.PlaneBufferGeometry(size.x, size.y).applyMatrix(
      new THREE.Matrix4().makeTranslation(0, 1, 0)
    );
    const mesh = new Reflector(geometry, {
      clipBias: 0.003,
      textureWidth: 1024 * window.devicePixelRatio,
      textureHeight: 2048 * window.devicePixelRatio,
      color: new Color().set(0x889999),
      recursion: 10000
    });
    const mat = mesh.material as Material;
    mat.side = FrontSide;

    mesh.position.set(position.x, position.y, position.z);
    container.add(mesh);
  }, []);

  return <Fragment />;
};

export default Mirror;
