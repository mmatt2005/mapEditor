import { useEffect } from 'react'
import { create } from 'zustand'
import './App.css'
import { LeftMenuPopup, RightMenuButtons, SelectedNodeUI } from './components.tsx'
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
    <div className="absolute top-0 w-screen h-20 bg-black/25 flex items-center gap-4 ">
      {
        ui.currentMap
      }
      <SelectedNodeUI />
      <RightMenuButtons />
      <LeftMenuPopup />
    </div>
  </>
}
