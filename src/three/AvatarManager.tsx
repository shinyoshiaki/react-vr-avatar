import React, { FC, Fragment, useContext } from "react";
import { useFrame, useThree } from "react-three-fiber";

import AvatarManagerClass from "./avatarManager.class";
import { ContainerContext } from "../Main";
import { useInstance } from "../hooks/useInstance";
import { useStart } from "../hooks/useStart";

const AvatarManager: FC = () => {
  const { camera, gl } = useThree();
  const container = useContext(ContainerContext);
  const [avatar] = useInstance(new AvatarManagerClass(container, camera, gl));

  useStart(() => {
    avatar.load();
  });

  useFrame(() => {
    avatar.frameUpdate();
  });

  return <Fragment />;
};

export default AvatarManager;
