import { GameMapOptions, type Edge, type Node, type Prop, type Vehicle, type Zone } from "../types"

export class UIManager {
    private currentMap: keyof (typeof GameMapOptions) = "CITY"
    private sideMenu: Readonly<
        {
            activeMenu: "debug" | "node" | "edge" | "zone" | "prop" | "vehicle" | null,
            menuData: Node | Edge | Zone | Prop | Vehicle | null
        }
    > = { activeMenu: null, menuData: null }

    public getCurrentMap(): UIManager["currentMap"] {
        return this.currentMap
    }

    public setCurrentMap(newCurrentMap: UIManager["currentMap"]): void {
        this.currentMap = newCurrentMap
        this.updateUi()
    }

    public getSideMenu(): UIManager["sideMenu"] {
        return this.sideMenu
    }

    public setSideMenu(activeMenu: UIManager["sideMenu"]["activeMenu"], menuData: UIManager["sideMenu"]["menuData"]): void {
        this.sideMenu = { activeMenu: activeMenu, menuData: menuData }
        this.updateUi()
    }

    public hideSideMenu(): void {
        if (this.sideMenu.activeMenu === null) {
            console.log("Failed to hide side menu due to it already being hidden")
            return
        }

        this.setSideMenu(null, null)
        this.updateUi()
    }

    public updateUi() { }
}