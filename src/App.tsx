import { useEffect } from 'react'
import { create } from 'zustand'
import './App.css'
import { uiManager } from './main.ts'
import type { UiManager } from './uiManager.ts'

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


    </div>

  </>
}
