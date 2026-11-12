import Game from "./Game";
import inventory from "../docs/raptor-fluidity/runtime-inventory.json";

export default function Home() {
 const allowRaptor = inventory.selectorAndGameplayVerifiedFiles > 0 &&
  inventory.slots.every(slot => slot.status !== "open-for-replacement");
 return <Game cameraPreset="kinetic" allowRaptor={allowRaptor}/>;
}
