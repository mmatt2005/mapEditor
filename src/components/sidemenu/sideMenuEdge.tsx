import { graphManager, pathFindingDebug, uiManager } from "../../core/main";
import { EDGE_TYPES, type Edge } from "../../types";

export default function SideMenuEdge({ edge }: { edge: Edge }) {
    const edgeGraphic = graphManager.getEdgeGraphic(edge.id)
    if (!edgeGraphic) {
        console.log("Failed to render edge side menu due to not finding edge graphic")
        return <></>
    }

    return <>
        {JSON.stringify(edge, null, 4)}
        <div className="bg-gray-500 p-1 w-full">
            <label>Id: {edgeGraphic.id}</label>
            <button
                className="w-full border cursor-pointer p-1"
                onClick={() => {
                    navigator.clipboard.writeText(edgeGraphic.id)
                    console.log(`Copied Id: ${edgeGraphic.id}`)
                }}
            >Copy</button>
        </div>
        <div className="">
            <label>Width</label>
            <input
                type="number"
                className="bg-gray-500 p-1 w-full"
                value={edgeGraphic.edgeWidth}
                onChange={(newValue) => {
                    edgeGraphic.updateEdge({ ...edgeGraphic.getEdgeObject(), edgeWidth: Number(newValue.target.value) })
                    uiManager.updateUi()
                }}
            />
        </div>
        <div className="mt-4">
            <label>Type</label>
            <select
                name="type"
                id="type"
                className="bg-gray-500 w-full p-1"
                value={edgeGraphic.type}
                onChange={(newValue) => {
                    const newType = newValue.target.value as Edge["type"]
                    edgeGraphic.updateEdge({ ...edgeGraphic.getEdgeObject(), type: newType })
                }}
            >
                {
                    EDGE_TYPES.map(type => (
                        <option value={type}>{type} {edgeGraphic.type === type && "✔️"}</option>
                    ))
                }
            </select>
        </div>
        <div className="mt-4 space-y-2">
            <button
                className="bg-green-500 p-1 w-full cursor-pointer"
                onClick={() => {
                    pathFindingDebug.setStartEdge(edgeGraphic)
                    // edgeGraphic.setHighlightColor("green")
                }}
            >Set as start edge (pathfinding)</button>
            <button
                className="bg-red-500 p-1 w-full cursor-pointer"
                onClick={() => {
                    pathFindingDebug.setEndEdge(edgeGraphic)
                    // edgeGraphic.setHighlightColor("red")

                }}
            >Set as end edge (pathfinding)</button>
        </div>
    </>
}