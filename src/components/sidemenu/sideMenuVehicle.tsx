import { graphManager, pathFindingDebug } from "../../core/main";
import type { Vehicle } from "../../types";

export default function SideMenuVehicle({ vehicle }: { vehicle: Vehicle }) {
    const vehicleSprite = graphManager.getVehicleGraphic(vehicle.id)
    if (!vehicleSprite) {
        console.log("Failed to render side menu vehicle due to no vehicle sprite")
        return <></>
    }

    return <div className="">
        {
            JSON.stringify(vehicle, null, 4)
        }
        <button
            className="bg-green-500 p-1 w-full cursor-pointer"
            onClick={() => {
                pathFindingDebug.setStartEdge(vehicleSprite.getCurrentEdge())
                vehicleSprite.moveTo()
            }}
        >Move to location</button>
    </div>
}