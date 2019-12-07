import { Avatar, AvatarClass } from "../typings/avatar";
import { Camera, Object3D, Vector3, WebGLRenderer } from "three";
import { GLTF, GLTFLoader } from "three/examples/jsm/loaders/GLTFLoader";
import { getLeftInput, getRightInput } from "./controller";

import AVATAR from "https://avatars.exokit.org/avatars.js";
import { Locomotion } from "./locomotion";

export default class AvatarManagerClass {
  avatar?: Avatar;
  locomotion: Locomotion;

  params = { heightFactor: 0 };

  constructor(
    private container: Object3D,
    private camera: Camera,
    private gl: WebGLRenderer
  ) {
    this.locomotion = new Locomotion(container);
  }

  load = async () => {
    const model = await loadModel("570234664353338085.vrm").catch(() => {});
    if (!model) return;
    this.container.add(model.scene);

    const avatar = new (AVATAR as AvatarClass)(model, {
      fingers: true,
      hair: true,
      visemes: true
    });
    this.params.heightFactor = getHeightFactor(avatar.height);
    this.container.scale.set(1, 1, 1).divideScalar(this.params.heightFactor);
    this.avatar = avatar;
  };

  frameUpdate = () => {
    const { heightFactor } = this.params;
    const { avatar, camera, container, locomotion, gl } = this;
    if (!avatar) return;

    avatar.inputs.hmd.position
      .copy(camera.position)
      .sub(container.position)
      .multiplyScalar(heightFactor);
    avatar.inputs.hmd.quaternion.copy(camera.quaternion);

    // right hand
    const rightInput = getRightInput();
    if (rightInput) {
      const { pointer, grip, padX, padY, stick } = rightInput;
      const leftHand = gl.vr.getController(0);
      const avatarGamepad = avatar.inputs.leftGamepad;

      avatarGamepad.pointer = pointer;
      avatarGamepad.grip = grip;
      avatarGamepad.quaternion.copy(leftHand.quaternion);
      avatarGamepad.position.copy(
        new Vector3()
          .copy(leftHand.position)
          .sub(container.position)
          .multiplyScalar(heightFactor)
      );

      locomotion.update(
        padX,
        padY,
        stick,
        avatar.inputs.hmd.quaternion,
        avatar.height
      );
    }

    // left hand
    const leftInput = getLeftInput();
    if (leftInput) {
      const { pointer, grip, padX, padY } = leftInput;
      const leftHand = gl.vr.getController(1);
      const avatarGamepad = avatar.inputs.rightGamepad;

      avatarGamepad.pointer = pointer;
      avatarGamepad.grip = grip;
      avatarGamepad.quaternion.copy(leftHand.quaternion);
      avatarGamepad.position.copy(
        new Vector3()
          .copy(leftHand.position)
          .sub(container.position)
          .multiplyScalar(heightFactor)
      );

      locomotion.update(
        padX,
        padY,
        false,
        avatar.inputs.hmd.quaternion,
        avatar.height
      );
    }

    avatar.update();
  };
}

const userHeight = 1.7 as const;
const getHeightFactor = (rigHeight: number) => rigHeight / userHeight;
const loadModel = (url: string) =>
  new Promise<GLTF>((s, f) => {
    new GLTFLoader().load(
      url,
      gltf => s(gltf),
      () => {},
      f
    );
  });
