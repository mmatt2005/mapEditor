import { CheckIcon } from "lucide-react"
import { loadMap } from "./loadMap"
import { app, uiManager } from "./main"
import type { Edge } from "./graphManager"

export function SelectedNodeUI() {
    return <>
        {
            uiManager.selected && uiManager.selected.type === "node" && <div className='flex items-center gap-1'>
                <p>Selected: ({uiManager.selected.position.x}, {uiManager.selected.position.y})</p>
                <button
                    className='bg-gray-500 p-1 cursor-pointer'
                    onClick={() => {
                        uiManager.selected = null
                        uiManager.updateUi()
                    }}
                >Remove</button>
            </div>
        }
        {
            uiManager.graphManager.nodes.length >= 1 && <div className="">
                <p>{uiManager.graphManager.nodes.length} Nodes</p>

            </div>
        }
    </>
}

export function RightMenuButtons() {
    return <div className="ml-auto mr-1 space-x-4">

        {
            uiManager.graphManager.nodes.length >= 1 && <>
                <button
                    className='bg-blue-500 p-1 cursor-pointer'
                    onClick={() => {
                        navigator.clipboard.writeText(JSON.stringify(uiManager.graphManager.nodes))
                        console.log("Copied!")
                    }}
                >Export</button>
                <button
                    className='bg-gray-400 p-1 cursor-pointer'
                    onClick={() => {
                        uiManager.graphManager.nodes = []
                        app.stage.removeChildren()
                        uiManager.updateUi()
                    }}
                >Clear Canvas</button>
            </>
        }
        <button
            className='bg-gray-400 p-1 cursor-pointer'
            onClick={() => {
                uiManager.sideMenu.visibile = true
                uiManager.sideMenu.selected = "map"
                uiManager.updateUi()
            }}
        >Load Map</button>


    </div>
}

export function LeftMenuPopup() {
    return uiManager.sideMenu.visibile && <div className="absolute top-20 h-[calc(100vh-80px)] p-1 w-40 bg-black/25 flex flex-col">
        {
            uiManager.sideMenu.selected === "map" && <LeftMenuPopupMapOptionsSelected />
        }
        {
            uiManager.sideMenu.selected === "edge" && uiManager.selected?.type === "edge" && <LeftMenuPopupEdgeSelected />
        }
        <button
            className='bg-black/50 w-full h-10 cursor-pointer mt-auto'
            onClick={() => {
                uiManager.sideMenu.visibile = false
                uiManager.sideMenu.selected = null
                uiManager.updateUi()
            }}
        >Close</button>
    </div>

}

function LeftMenuPopupEdgeSelected() {
    const selectedEdge = uiManager.selected as Edge
    const edge = uiManager.graphManager.getEdgeById(selectedEdge.id)
    if (!edge) {
        console.log("Failed to find edge for LeftMenuPopupEdgeSelected")
        return <>nope</>
    }

    return <div className="">
        {
            JSON.stringify(edge, null, 2)
        }
        <input
            type="number"
            className="bg-gray-400 p-1 h-10 w-full"
            value={edge.edgeWidth}
            onChange={(newValue) => {
                const newWidth = Number(newValue.target.value)
                const newEdgeObject: Edge = {...edge, edgeWidth: newWidth}
                uiManager.graphManager.updateEdge(edge.id, newEdgeObject)
                uiManager.updateUi()
            }}
        />
    </div>
}


function LeftMenuPopupMapOptionsSelected() {
    return <>
        <div className="flex flex-col gap-4">

            <div
                className="bg-black/40 p-1 cursor-pointer hover:bg-black/60 transition-opacity flex flex-row items-center"
                onClick={() => {
                    loadMap("city")
                }}
            >
                <div className="">
                    <h2 className='text-xl'>Map 1</h2>
                    <p>A city</p>
                </div>
                {
                    uiManager.currentMap === "city" && <CheckIcon className='ml-auto' />
                }
            </div>
            <div
                className="bg-black/40 p-1 cursor-pointer hover:bg-black/60 transition-opacity flex flex-row items-center"
                onClick={() => {
                    loadMap("smallTown")
                }}
            >
                <div className="">
                    <h2 className='text-xl'>Map 2</h2>
                    <p>A small town</p>
                </div>
                {
                    uiManager.currentMap === "smallTown" && <CheckIcon className='ml-auto' />
                }
            </div>
        </div>

    </>
}