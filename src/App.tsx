import './App.css'
import { uiManager } from './main.ts'
import { create } from 'zustand'
import type { UiManager } from './uiManager.ts'
import { useEffect } from 'react'

interface UiState {
  ui: UiManager
  refreshed: boolean
  refreshUi: () => void
}

const useUiStore = create<UiState>((set) => (
  {
    ui: uiManager,
    refreshed: false,
    refreshUi: () => set((state) => ({ refreshed: !state.refreshed }))
  }
))

export default function App() {
  const { ui, refreshUi, refreshed } = useUiStore()
  useEffect(() => {
    ui.updateUi = function () {
      refreshUi()
    }
  }, [])

  return <>
    <div className="absolute top-0 w-screen h-20 bg-black/25 flex items-center gap-4">
      <DrawLineCheckBox />
      <EnableSnapPointsCheckbox />
      <DebugModeCheckbox />
      <div className="">
        <h1>Point 1: ({ui.drawLineManager.firstPoint?.x}, {ui.drawLineManager.firstPoint?.y})</h1>
        <h1>Point 2: ({ui.drawLineManager.secondPoint?.x}, {ui.drawLineManager.secondPoint?.y})</h1>
      </div>
      <div className="">
        <p>Points: {ui.editorObjectsManager.getNumberOfEditorObject("point")}</p>
        <p>Lines: {ui.editorObjectsManager.getNumberOfEditorObject("line")}</p>
      </div>
      <div className="">
        <p>Selected: {ui.selectedObject?.type}</p>
      </div>
      <button className='bg-blue-500 p-1 cursor-pointer ml-auto' onClick={() => {
        const exportData = ui.editorObjectsManager.export()
        navigator.clipboard.writeText(JSON.stringify(exportData))

      }}>Export</button>
    </div>
    {
      ui.selectedObject && <div className="absolute top-20 h-[calc(100vh-80px)] p-1 bg-black/25">
        {
          ui.selectedObject.type === "line" ? (
            <div>
              <h1>You selected a line</h1>
              <input
                type='number'
                value={ui.selectedObject.graphic.strokeStyle.width}
                className='border-blue-500 h-10 border'
                onChange={(newValue) => ui.editorObjectsManager.updateEditorObjectLineWidth(ui.selectedObject?.id || "", Number(newValue.target.value))}
              />
            </div>
          ) : ui.selectedObject.type === "point" && (
            <h1>You selected a point!</h1>
          )
        }
        <button className='bg-blue-100 p-1' onClick={() => ui.setSelectedObject(null)}>Close</button>
      </div>
    }
  </>

}
function DrawLineCheckBox() {
  const { ui } = useUiStore()

  return <div className="flex items-center">
    <label htmlFor='drawLineCheckbox'>Draw Line</label>
    <input
      className='w-6 h-6'
      type='checkbox'
      id='drawLineCheckbox'
      checked={ui.drawLineManager.isDrawLineModeEnabled}
      onChange={(event) => {
        if (event.target.checked) {
          ui.drawLineManager.enableDrawLine()
        } else ui.drawLineManager.disbaleDrawLine()
      }}
    />
  </div>
}

function EnableSnapPointsCheckbox() {
  const { ui } = useUiStore()

  return <div className="flex items-center">
    <label htmlFor='snapPointsCheckbox'>Snap Points</label>
    <input
      className='w-6 h-6'
      type='checkbox'
      id='snapPointsCheckbox'
      checked={ui.drawLineManager.isSnapPointModeEnabled}
      onChange={(event) => {
        if (event.target.checked) {
          ui.drawLineManager.enableSnapPoint()
        } else ui.drawLineManager.disbaleSnapPoint()
      }}
    />
  </div>
}

function DebugModeCheckbox() {
  const { ui } = useUiStore()

  return <div className="flex items-center">
    <label htmlFor='debugCheckbox'>Debug</label>
    <input
      className='w-6 h-6'
      type='checkbox'
      id='debugCheckbox'
      checked={ui.debugMode}
      onChange={(event) => {
        if (event.target.checked) {
          ui.setDebugMode(true)
        } else ui.setDebugMode(false)
      }}
    />
  </div>
}