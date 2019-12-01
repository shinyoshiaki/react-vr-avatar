import { Object3D } from "three";

export class SnapRotation {
  state = { snapping: false };

  constructor(private container: Object3D) {}

  update(padX: number) {
    const { snapping } = this.state;
    if (snapping) {
      if (!padX) {
        this.state.snapping = false;
      }
    } else {
      if (padX > 0.9) {
        this.state.snapping = true;
        this.container.rotateY(Math.PI / 4);
      }
      if (padX < -0.9) {
        this.state.snapping = true;
        this.container.rotateY(-Math.PI / 4);
      }
    }
  }
}
