import { propsManager } from "../../core/main";
import { PROPS } from "../../types";

export default function SideMenuPropsMenu() {
    return <div className="flex flex-col gap-2">
        {
            PROPS.map(prop => (
                <div
                    className="w-full bg-gray-500 p-1 cursor-pointer"
                    onClick={() => propsManager.selectProp(prop.propName, prop.frame)}
                >{prop.propName}</div>
            ))
        }
    </div>
}