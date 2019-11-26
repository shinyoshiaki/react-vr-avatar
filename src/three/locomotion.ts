import { Euler, Object3D, Quaternion, Vector3 } from "three";

const walkSpeed = 0.025;

export class Locomotion {
  constructor(private container: Object3D) {}

  update = (
    padX: number | undefined,
    padY: number | undefined,
    stick: boolean,
    quaternion: Quaternion,
    height: number
  ) => {
    if (padX && padY)
      if (padX !== 0 || padY !== 0) {
        const vec = new Vector3(0, 0, 0);
        vec.set(padX, 0, padY);
        const moveLength = vec.length();

        if (moveLength > 1) {
          vec.divideScalar(moveLength);
        }

        const euler = new Euler();

        const hmdEuler = euler.setFromQuaternion(quaternion, "YXZ");
        euler.x = 0;
        euler.z = 0;

        this.container.position.sub(
          vec
            .multiplyScalar(walkSpeed * (stick ? 3 : 1) * height)
            .applyEuler(hmdEuler)
        );
      }
  };
}
