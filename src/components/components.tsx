import { uiManager, worldLayer } from "../main"
import { saveMap } from "../utils/saveMap"
import { LeftMenuPopUpDebug, LeftMenuPopupEdgeSelected, LeftMenuPopupMapOptionsSelected, LeftMenuPopUpPlaceProps, LeftMenuPopUpPropSelected, LeftMenuPopupZoneSelected } from "./leftMenuComponents"

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
                    type="button"
                    onClick={async (e) => {
                        e.preventDefault()
                        const { status } = await saveMap(uiManager.currentMap)
                        if (status === 200) {
                            console.log("Successfully saved map!")
                        } else console.log("Failed to save map...")
                    }}
                >Save</button>
                <button
                    className='bg-gray-400 p-1 cursor-pointer'
                    onClick={() => {
                        uiManager.graphManager.nodes = []
                        uiManager.zoneManager.zones = []
                        uiManager.propsManager.props = []
                        worldLayer.removeChildren()
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
        <button
            className='bg-gray-400 p-1 cursor-pointer'
            onClick={() => {
                uiManager.showSideMenu("place-prop")
                uiManager.updateUi()
            }}

        >Place Props</button>
        <button
            className='bg-gray-400 p-1 cursor-pointer'
            onClick={() => {
                uiManager.showSideMenu("debug")
                uiManager.updateUi()
            }}

        >Debug</button>

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
        {
            uiManager.sideMenu.selected === "place-prop" && <LeftMenuPopUpPlaceProps />
        }
        {
            uiManager.sideMenu.selected === "prop" && <LeftMenuPopUpPropSelected />
        }
        {
            uiManager.sideMenu.selected === "debug" && <LeftMenuPopUpDebug />
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