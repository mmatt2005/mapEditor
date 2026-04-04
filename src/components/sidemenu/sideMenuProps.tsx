import { propsManager } from "../../main";
import { PROPS } from "../../types";

export default function SideMenuProp() {
    return <div className="flex flex-col gap-2">
        {
            PROPS.map(prop => (
                <div
                    className="w-full bg-gray-500 p-1 cursor-pointer"
                    onClick={() => propsManager.setSelectedProp(prop.frame)}
                >{prop.propName}</div>
            ))
        }
    </div>
}