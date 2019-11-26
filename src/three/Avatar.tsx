import * as THREE from "three";

import { Avatar, AvatarClass } from "../typings/avatar";
import { BoxGeometry, Mesh, MeshBasicMaterial } from "three";
import { GLTF, GLTFLoader } from "three/examples/jsm/loaders/GLTFLoader";
import React, {
  FC,
  Fragment,
  useContext,
  useEffect,
  useRef,
  useState
} from "react";
import { getLeftInput, getRightInput } from "./controller";
import { useFrame, useThree } from "react-three-fiber";

import AVATAR from "https://avatars.exokit.org/avatars.js";
import { ContainerContext } from "../Main";
import DebugUI from "./ui/debugUI";
import { Locomotion } from "./locomotion";

const userHeight = 1.7 as const;
const getHeightFactor = (rigHeight: number) => rigHeight / userHeight;

const AvatarManager: FC = () => {
  const { camera, gl } = useThree();
  const container = useContext(ContainerContext);
  const avatarRef = useRef<Avatar>();
  const paramRef = useRef({ heightFactor: 0 });
  const locomotion = useRef(new Locomotion(container));
  const logMeshRef = useRef(
    new Mesh(new BoxGeometry(1, 1, 0.1), new MeshBasicMaterial())
  );
  const [logText, setLogText] = useState("log");

  useEffect(() => {
    const promise = async () => {
      const model = await loadModel("/model2.vrm").catch(() => {});
      if (!model) return;
      container.add(model.scene);

      const avatar = (avatarRef.current = new (AVATAR as AvatarClass)(model, {
        fingers: true,
        hair: true,
        visemes: true
      }));
      const heightFactor = (paramRef.current.heightFactor = getHeightFactor(
        avatar.height
      ));
      container.scale.set(1, 1, 1).divideScalar(heightFactor);
    };
    promise();
  }, []);

  useEffect(() => {
    const logMesh = logMeshRef.current;
    logMesh.position.set(1, 1, 0);
    container.add(logMesh);
  }, []);

  useFrame(() => {
    const avatar = avatarRef.current;
    if (!avatar) return;

    camera.matrixWorld.decompose(
      camera.position,
      camera.quaternion,
      camera.scale
    );

    const heightFactor = paramRef.current.heightFactor;

    avatar.inputs.hmd.position
      .copy(camera.position)
      .sub(container.position)
      .multiplyScalar(heightFactor);
    avatar.inputs.hmd.quaternion.copy(camera.quaternion);

    let log = "";

    const rightInput = getRightInput();
    if (rightInput) {
      log += JSON.stringify(rightInput);
      const { pointer, grip, padX, padY, stick } = rightInput;
      avatar.inputs.rightGamepad.pointer = pointer;
      avatar.inputs.rightGamepad.grip = grip;

      const rightHand = gl.vr.getController(1);
      avatar.inputs.rightGamepad.quaternion.copy(rightHand.quaternion);
      const rightHandPos = new THREE.Vector3()
        .copy(rightHand.position)
        .sub(container.position)
        .multiplyScalar(heightFactor);
      avatar.inputs.rightGamepad.position.copy(rightHandPos);

      locomotion.current.update(
        padX,
        padY,
        stick,
        avatar.inputs.hmd.quaternion,
        avatar.height
      );
    }

    const leftInput = getLeftInput();
    if (leftInput) {
      log += "\n";
      log += JSON.stringify(leftInput);

      const { pointer, grip, padX, padY } = leftInput;
      avatar.inputs.leftGamepad.pointer = pointer;
      avatar.inputs.leftGamepad.grip = grip;

      const leftHand = gl.vr.getController(0);
      avatar.inputs.leftGamepad.quaternion.copy(leftHand.quaternion);
      const leftHandPos = new THREE.Vector3()
        .copy(leftHand.position)
        .sub(container.position)
        .multiplyScalar(heightFactor);
      avatar.inputs.leftGamepad.position.copy(leftHandPos);

      locomotion.current.update(
        padX,
        padY,
        false,
        avatar.inputs.hmd.quaternion,
        avatar.height
      );
    }

    setLogText(log);

    avatar.update();
  });

  return (
    <Fragment>
      {/* <DebugUI text={logText} mesh={logMeshRef.current} /> */}
    </Fragment>
  );
};

export default AvatarManager;

const loadModel = (url: string) =>
  new Promise<GLTF>((s, f) => {
    new GLTFLoader().load(
      url,
      gltf => s(gltf),
      () => {},
      f
    );
  });
