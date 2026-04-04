import { graphManager, uiManager } from "../../main";
import type { Edge } from "../../types";

export default function SideMenuEdge({ edge }: { edge: Edge }) {
    const edgeGraphic = graphManager.getEdgeGraphic(edge.id)
    if (!edgeGraphic) {
        console.log("Failed to render edge side menu due to not finding edge graphic")
        return <></>
    }

    return <>
        {JSON.stringify(edge, null, 4)}
        <div className="">
            <label>Width</label>
            <input 
            type="number" 
            className="bg-gray-500 p-1 w-full"
            value={edgeGraphic.edgeWidth}
            onChange={(newValue) => { 
                edgeGraphic.updateEdge({...edgeGraphic.getEdgeObject(), edgeWidth: Number(newValue.target.value)})
                uiManager.updateUi()
            }}
            />
        </div>
    </>
}