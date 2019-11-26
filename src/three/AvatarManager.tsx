import React, { FC, Fragment, useContext, useEffect, useRef } from "react";
import { useFrame, useThree } from "react-three-fiber";

import AvatarManagerClass from "./avatarManager.class";
import { ContainerContext } from "../Main";

const AvatarManager: FC = () => {
  const { camera, gl } = useThree();
  const container = useContext(ContainerContext);
  const avatarManagerRef = useRef(
    new AvatarManagerClass(container, camera, gl)
  );

  useEffect(() => {
    avatarManagerRef.current.load();
  }, []);

  useFrame(() => {
    avatarManagerRef.current.frameUpdate();
  });

  return <Fragment />;
};

export default AvatarManager;
