import { useEffect } from 'react'
import { create } from 'zustand'
import './App.css'
import { uiManager } from './core/main.ts'
import type { UIManager } from './core/uiManager.ts'
import { RightMenuButtons } from './components/rightMenuButtons.tsx'
import SideMenu from './components/sideMenu.tsx'

interface UiState {
  ui: UIManager
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
      <SideMenu />
      <RightMenuButtons />
    </div>
  </>
}
