import React, { FC } from "react";

import Main from "./Main";
import { WEBVR } from "three/examples/jsm/vr/WebVR";
import { Canvas as canvas } from "react-three-fiber";
import styled from "styled-components";

const App: FC = () => {
  return (
    <Canvas
      vr
      camera={{ position: [0, 0, 15] }}
      onCreated={({ gl }) => {
        const button = WEBVR.createButton(gl);
        document.body.appendChild(button);
      }}
    >
      <Main />
    </Canvas>
  );
};

export default App;

const Canvas = styled(canvas)`
  width: 100%;
  height: 100%;
  & > canvas {
    width: 100% !important;
    height: 100% !important;
  }
`;
