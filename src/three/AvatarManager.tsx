import React, { FC, Fragment, useContext, useMemo } from "react";
import { useFrame, useThree } from "react-three-fiber";

import AvatarManagerClass from "./avatarManager.class";
import { ContainerContext } from "../Main";
import { useStart } from "../hooks/useStart";

const AvatarManager: FC = () => {
  const { camera, gl } = useThree();
  const container = useContext(ContainerContext);
  const avatarManager = useMemo(
    () => new AvatarManagerClass(container, camera, gl),
    [container, camera, gl]
  );

  useStart(() => {
    avatarManager.load();
  });

  useFrame(() => {
    avatarManager.frameUpdate();
  });

  return <Fragment />;
};

export default AvatarManager;
