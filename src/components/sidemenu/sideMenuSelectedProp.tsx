import { propsManager } from "../../core/main";
import type { Prop } from "../../types";

export default function SideMenuSelectedProp({ prop }: { prop: Prop }) {
    const propSprite = propsManager.getPropSprite(prop.id)
    if (!propSprite) {
        console.log("failed to render prop side menu due to not having propSprite object")
        return <></>
    }


    return <div>
        {
            JSON.stringify(propSprite.getPropObject(), null, 4)
        }

        <div className="bg-gray-500 w-full p-1">
            <label>Angle</label>
            <input
                type="range"
                min={0}
                max={360}
                className="bg-gray-500 w-full p-1"
                value={propSprite.angle}
                onChange={(newValue) => {
                    propSprite.updateProp({ ...propSprite.getPropObject(), angle: Number(newValue.target.value) })
                }}
            />
        </div>

        <div className="">
            <label>Parent Edge Id</label>
            <input
                className="bg-gray-500 w-full p-1"
                value={propSprite.parentEdgeId || ""}
                onChange={(newValue) => {
                    propSprite.updateProp({ ...propSprite.getPropObject(), parentEdgeId: newValue.target.value })
                }} />
        </div>

        <div className="">
            <label>Parent Point X</label>
            <input
                type="number"
                className="bg-gray-500 w-full p-1"
                value={propSprite.parentPoint?.x}
                onChange={(newValue) => {
                    propSprite.updateProp({ ...propSprite.getPropObject(), parentPoint: { x: Number(newValue.target.value), y: propSprite.parentPoint?.y || 0 } })
                }}
            />
        </div>

        <div className="">
            <label>Parent Point Y</label>
            <input
                type="number"
                className="bg-gray-500 w-full p-1"
                value={propSprite.parentPoint?.y}
                onChange={(newValue) => {
                    propSprite.updateProp({ ...propSprite.getPropObject(), parentPoint: { x: propSprite.parentPoint?.x || 0, y: Number(newValue.target.value) } })
                }}
            />
        </div>
    </div>
}