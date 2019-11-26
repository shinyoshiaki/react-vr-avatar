import { GLTF } from "three/examples/jsm/loaders/GLTFLoader";
import { Object3D } from "three";

type Hand = Object3D & { pointer: number; grip: number };

export class Avatar {
  height: number;
  inputs: { hmd: Object3D; rightGamepad: Hand; leftGamepad: Hand };
  update: () => void;
  model: Object3D;
}

export type AvatarClass = {
  new (
    model: GLTF,
    options: { fingers: boolean; hair: boolean; visemes: boolean }
  ): Class;
};
