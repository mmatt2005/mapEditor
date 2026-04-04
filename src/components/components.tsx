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
