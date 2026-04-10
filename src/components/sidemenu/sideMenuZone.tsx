import { graphManager } from "../../core/main";
import type { Zone } from "../../types";

export default function SideMenuZone({ zone }: { zone: Zone }) {
    const graphic = graphManager.getZoneGraphic(zone.id)
    if (!graphic) {
        console.log("Failed to render zone side menu...")
        return <></>
    }

    return <>
        {JSON.stringify(graphic.getZoneObject(), null, 4)}

        <div className="">
            <label>Opacity</label>
            <input
                type="number"
                value={graphic.opacity}
                className="bg-gray-500 w-full p-1"
                step={0.1}
                min={0.1}
                max={1}
                onChange={(newValue) => {
                    graphic.updateZone({ ...graphic.getZoneObject(), opacity: Number(newValue.target.value) })
                }}
            />
        </div>
    </>
}