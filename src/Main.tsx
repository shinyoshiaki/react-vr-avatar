import { GridHelper, Object3D, Vector2, Vector3 } from "three";
import React, { FC, createContext } from "react";

import AvatarManager from "./three/AvatarManager";
import Mirror from "./three/Mirror";
import { useInstance } from "./hooks/useInstance";
import { useStart } from "./hooks/useStart";
import { useThree } from "react-three-fiber";

export const ContainerContext = createContext<Object3D>(null as any);

const Main: FC = () => {
  const { scene } = useThree();
  const [container] = useInstance(new Object3D());

  useStart(() => {
    scene.add(container);
    const gridHelper = new GridHelper(10, 10);
    container.add(gridHelper);
  });

  return (
    <ContainerContext.Provider value={container}>
      <ambientLight intensity={0.5} />
      <spotLight
        intensity={0.6}
        position={[30, 30, 50]}
        angle={0.2}
        penumbra={1}
        castShadow
      />
      <Mirror size={new Vector2(2, 2)} position={new Vector3(0, 0, -0.5)} />
      <AvatarManager />
    </ContainerContext.Provider>
  );
};

export default Main;
