import { uiManager } from "../core/main"
import type { Prop } from "../types"
import SideMenuDebug from "./sidemenu/sideMenuDebug"
import SideMenuEdge from "./sidemenu/sideMenuEdge"
import SideMenuNode from "./sidemenu/sideMenuNode"
import SideMenuPropsMenu from "./sidemenu/sideMenuPropsMenu"
import SideMenuSelectedProp from "./sidemenu/sideMenuSelectedProp"
import SideMenuVehicle from "./sidemenu/sideMenuVehicle"
import SideMenuZone from "./sidemenu/sideMenuZone"

export default function SideMenu() {
    const sideMenu = uiManager.getSideMenu()
    const isSideMenuActive = sideMenu.activeMenu !== null
    if (!isSideMenuActive) return <></>

    return <div className="absolute top-20 h-[calc(100vh-80px)] p-1 w-40 bg-black/25 flex flex-col">
        <label className="text-xl font-bold mb-1">{sideMenu.activeMenu.toUpperCase()}</label>
        {
            sideMenu.activeMenu === "node" && sideMenu.menuData?.editorType === "node" && <SideMenuNode node={sideMenu.menuData}/>
        }
        {
            sideMenu.activeMenu === "edge" && sideMenu.menuData?.editorType === "edge" && <SideMenuEdge edge={sideMenu.menuData} />
        }
        {
            sideMenu.activeMenu === "zone" && sideMenu.menuData?.editorType === "zone" && <SideMenuZone zone={sideMenu.menuData}/>
        }
        {
            sideMenu.activeMenu === "prop" && (
                sideMenu.menuData ? ( 
                    <SideMenuSelectedProp prop={sideMenu.menuData as Prop}/>
                ) : <SideMenuPropsMenu/>
            )
        }
        {
            sideMenu.activeMenu === "debug" && <SideMenuDebug/>
        }
        {
            sideMenu.activeMenu === "vehicle" && sideMenu.menuData?.editorType === "vehicle" && <SideMenuVehicle vehicle={sideMenu.menuData}/>
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