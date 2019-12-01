export function getRightInput() {
  const hand = getInput("right");
  console.log(hand);
  if (hand) return { ...hand };
  return undefined;
}

export function getLeftInput() {
  const hand = getInput("left");
  if (hand) return { ...hand };
  return undefined;
}

function getInput(target: "right" | "left") {
  const gamepads = navigator.getGamepads();
  let gamepad: Gamepad | undefined;
  for (let input of gamepads) {
    if (!input) continue;
    if (input.hand === target) {
      gamepad = input;
      break;
    }
  }

  if (!gamepad) return undefined;

  const pointer = gamepad.buttons[1].value;
  const grip = gamepad.buttons[2].value;
  const stick = !!gamepad.buttons[3] && gamepad.buttons[3].pressed;
  const a = !!gamepad.buttons[4] && gamepad.buttons[4].pressed;
  const b = !!gamepad.buttons[5] && gamepad.buttons[5].pressed;

  const pad = gamepad.axes[1] <= -0.5 || gamepad.axes[3] <= -0.5;
  const padX = gamepad.axes[0] !== 0 ? gamepad.axes[0] : gamepad.axes[2];
  const padY = gamepad.axes[1] !== 0 ? gamepad.axes[1] : gamepad.axes[3];

  return {
    pointer,
    grip,
    pad,
    padX,
    padY,
    stick,
    a,
    b
  };
}
