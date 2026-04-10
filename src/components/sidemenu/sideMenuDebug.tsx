import { pathFindingDebug } from "../../core/main";

export default function SideMenuDebug() {
    return <div className="">
        <h1 className="text-lg my-4">Pathfinding</h1>
        <p className={pathFindingDebug.getStartEdge() ? "text-green-500" : ""}>Start Edge</p>
        <p className={pathFindingDebug.getEndEdge() ? "text-green-500" : ""}>End Edge</p>
        {
            pathFindingDebug.getStartEdge() && pathFindingDebug.getEndEdge() && <button
                className="bg-blue-500 p-1 w-full cursor-pointer"
                onClick={() => pathFindingDebug.pathfind()}
            >
                Create path!
            </button>
        }
    </div>
}