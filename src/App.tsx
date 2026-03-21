import { useEffect } from 'react'
import { create } from 'zustand'
import './App.css'
import { app, uiManager } from './main.ts'
import type { UiManager } from './uiManager.ts'
import { loadMap } from './loadMap.ts'

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
    <div className="absolute top-0 w-screen h-20 bg-black/25 flex items-center gap-4 ">
      {
        ui.selectedNode && <div className='flex items-center gap-1'>
          <p>Selected: ({uiManager.selectedNode?.position.x}, {uiManager.selectedNode?.position.y})</p>
          <button
            className='bg-gray-500 p-1 cursor-pointer'
            onClick={() => {
              uiManager.selectedNode = null
              uiManager.updateUi()
            }}
          >Remove</button>
        </div>
      }
      {
        ui.graphManager.nodes.length >= 1 && <div className="">
          <p>{ui.graphManager.nodes.length} Nodes</p>

        </div>
      }
      <div className="ml-auto mr-1 space-x-4">

        {
          ui.graphManager.nodes.length >= 1 && <>
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
            uiManager.sideMenuVisible = true
            uiManager.updateUi()
          }}
        >Load Map</button>


      </div>

      {
        uiManager.sideMenuVisible && <div className="absolute top-20 h-[calc(100vh-80px)] p-1 w-40 bg-black/25 flex flex-col">
          <div className="flex flex-col gap-4">

            <div
              className="bg-black/40 p-1 cursor-pointer hover:bg-black/60 transition-opacity"
              onClick={() => {
                loadMap("city")
              }}
            >
              <h2 className='text-xl'>Map 1</h2>
              <p>A city</p>
            </div>
            <div
              className="bg-black/40 p-1 cursor-pointer hover:bg-black/60 transition-opacity"
              onClick={() => {
                loadMap("smallTown")
              }}
            >
              <h2 className='text-xl'>Map 2</h2>
              <p>A small town</p>
            </div>
          </div>
          <button
            className='bg-black/50 w-full h-10 cursor-pointer mt-auto'
            onClick={() => {
              uiManager.sideMenuVisible = false
              uiManager.updateUi()
            }}
          >Close</button>
        </div>
      }

    </div>

  </>
}
