import { uiManager } from "../main"
import { clearCanvas } from "../utils/clearCanvas"
import { saveMap } from "../utils/saveMap"

export function RightMenuButtons() {
    return <div className="ml-auto mr-1 space-x-4">

        <button
            className='bg-blue-500 p-1 cursor-pointer'
            type="button"
            onClick={() => saveMap(uiManager.getCurrentMap())}
        >Save</button>
        <button
            className='bg-gray-400 p-1 cursor-pointer'
            onClick={clearCanvas}
        >Clear Canvas</button>
        <button
            className='bg-gray-400 p-1 cursor-pointer'
        >Load Map</button>
        <button
            className='bg-gray-400 p-1 cursor-pointer'
            onClick={() => uiManager.setSideMenu("prop", null)}
        >Place Props</button>
        <button
            className='bg-gray-400 p-1 cursor-pointer'
            onClick={() => {
                uiManager.setSideMenu("debug", null)
            }}
        >Debug</button>

    </div>
}