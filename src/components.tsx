import { CheckIcon } from "lucide-react"
import { useState } from "react"
import { loadMap } from "./loadMap"
import { app, uiManager, type GameData } from "./main"
import { ZONE_TYPES, type Zone } from "./zoneManager"
import { EDGE_TYPES, type Edge } from "./graphManager"

export function SelectedNodeUI() {
    return <>
        {
            uiManager.selected && uiManager.selected.editorType === "node" && <div className='flex items-center gap-1'>
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
                        const exportObject: GameData = { mapGraph: uiManager.graphManager.nodes, zones: uiManager.zoneManager.zones }
                        navigator.clipboard.writeText(JSON.stringify(exportObject))
                        console.log("Copied!")
                    }}
                >Export</button>
                <button
                    className='bg-gray-400 p-1 cursor-pointer'
                    onClick={() => {
                        uiManager.graphManager.nodes = []
                        uiManager.zoneManager.zones = []
                        app.stage.removeChildren()
                        uiManager.updateUi()
                    }}
                >Clear Canvas</button>
            </>
        }
        <button
            className='bg-gray-400 p-1 cursor-pointer'
            onClick={() => {
                uiManager.showSideMenu("map")
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
            uiManager.sideMenu.selected === "edge" && uiManager.selected?.editorType === "edge" && <LeftMenuPopupEdgeSelected />
        }
        {
            uiManager.sideMenu.selected === "zone" && <LeftMenuPopupZoneSelected />
        }
        <button
            className='bg-black/50 w-full h-10 cursor-pointer mt-auto'
            onClick={() => {
                uiManager.hideSideMenu()
                uiManager.updateUi()
            }}
        >Close</button>
    </div>

}

function LeftMenuPopUpLabel({ label }: { label: string }) {
    return <h1 className="text-xl font-bold">{label}</h1>
}

function LeftMenuPopupZoneSelected() {
    const selectedZone = uiManager.selected as Zone
    const zone = uiManager.zoneManager.getZoneById(selectedZone.id)
    if (!zone) {
        return <>Failed to render popup for zone</>
    }

    const [zoneColor, setZoneColor] = useState(zone.color)

    return <>
        <LeftMenuPopUpLabel label="Zone" />
        {
            JSON.stringify(selectedZone, null, 2)
        }
        <div className="flex flex-row">
            <input
                className="bg-gray-500 p-1 w-full h-10"
                value={zoneColor}
                onChange={(newValue) => {
                    setZoneColor(prev => newValue.target.value)
                }}
            />
            <button
                className="bg-blue-500 p-1 w-12 cursor-pointer"
                onClick={() => {
                    uiManager.zoneManager.updateZone(zone.id, { ...zone, color: zoneColor })
                }}
            >Save</button>
        </div>
        <label htmlFor="zoneOpacity">Opacity</label>
        <input
            type="number"
            id="zoneOpacity"
            min={0.1}
            max={1}
            step={0.1}
            className="bg-gray-500 p-1 w-full h-10"
            value={zone.opacity}
            onChange={(newValue) => {
                uiManager.zoneManager.updateZone(zone.id, { ...zone, opacity: Number(newValue.target.value) })
            }}
        />

        <label htmlFor="zoneType">Type:</label>
        <select
            name="zoneType"
            id="zoneType"
            className="w-full h-10 bg-gray-500 border"
            value={zone.type}
            onChange={(newValue) => {
                const newType = newValue.target.value as Zone["type"]
                uiManager.zoneManager.updateZone(zone.id, {...zone, type: newType})
                uiManager.updateUi()
            }}
        >
            {
                ZONE_TYPES.map(type => (
                    <option value={type}>{type} {zone.type === type && "✔️"}</option>
                ))
            }
        </select>

        <button
            onClick={() => {
                uiManager.zoneManager.deleteZone(zone.id)
                uiManager.hideSideMenu()
            }}
            className="w-full h-10 mt-8 bg-red-500"
        >
            Delete
        </button>
    </>
}

function LeftMenuPopupEdgeSelected() {
    const selectedEdge = uiManager.selected as Edge
    const edge = uiManager.graphManager.getEdgeById(selectedEdge.id)
    if (!edge) {
        console.log("Failed to find edge for LeftMenuPopupEdgeSelected")
        return <>nope</>
    }

    return <div className="">
        <LeftMenuPopUpLabel label="Edge" />

        {
            JSON.stringify(edge, null, 2)
        }
        <input
            type="number"
            className="bg-gray-400 p-1 h-10 w-full"
            value={edge.edgeWidth}
            onChange={(newValue) => {
                const newWidth = Number(newValue.target.value)
                const newEdgeObject: Edge = { ...edge, edgeWidth: newWidth }
                uiManager.graphManager.updateEdge(edge.id, newEdgeObject)
                uiManager.updateUi()
            }}
        />

        <label htmlFor="edgeType">Type:</label>
        <select
            name="edgeType"
            id="edgeType"
            className="w-full h-10 bg-gray-500 border"
            value={edge.type}
            onChange={(newValue) => {
                const newType = newValue.target.value as Edge["type"]
                uiManager.graphManager.updateEdge(edge.id, { ...edge, type: newType })
                uiManager.updateUi()
            }}
        >
            {
                EDGE_TYPES.map(type => (
                    <option value={type}>{type} {edge.type === type && "✔️"}</option>
                ))
            }
        </select>
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