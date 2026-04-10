import { Point } from "pixi.js"
import { EdgeGraphic } from "./edge"
import { eventsManager, uiManager, viewport, worldLayer } from "../core/main"
import { NodeGraphic } from "./node"
import { type Edge, type Node, type Vehicle, type Zone } from "../types"
import { VehicleSprite } from "./vehicle"
import { ZoneGraphic } from "./zoneManager"

export class GraphManager {
    private selectedNode: Node | null = null

    constructor() {
        viewport.on("click", (event) => {
            if (eventsManager.isCtrlKeyDown) {
                const position = viewport.toWorld(event.global.x, event.global.y)
                new NodeGraphic().createNodeGraphic(position)
            }
        })
    }

    public getSelectedNode(): Node | null {
        return this.selectedNode
    }

    public setSelectedNode(selectedNode: Node | null): void {
        this.selectedNode = selectedNode
        uiManager.updateUi()
    }

    public getZoneGraphic(zoneId: Zone["id"]): ZoneGraphic | null {
        return worldLayer.children.filter(f => f instanceof ZoneGraphic).find(z => z.id === zoneId) || null
    }

    public getEdgeGraphic(edgeId: Edge["id"]): EdgeGraphic | null {
        return worldLayer.children.filter(f => f instanceof EdgeGraphic).find(e => e.id === edgeId) || null
    }

    public getVehicleGraphic(vehicleId: Vehicle["id"]): VehicleSprite | null { 
        return worldLayer.children.filter(f => f instanceof VehicleSprite).find(veh => veh.id === vehicleId) || null
    }

    public getNodeGraphic(nodeId: Node["id"]): NodeGraphic | null {
        return worldLayer.children.filter(f => f instanceof NodeGraphic).find(n => n.id === nodeId) || null
    }

    public getAllEdgeGraphics(): EdgeGraphic[] {
        return worldLayer.children.filter(child => child instanceof EdgeGraphic)
    }

    public selectRandomPointOnEdge(edge: EdgeGraphic): Point | null {
        const nodes = edge.getNodesFromIds()
        if (!nodes) {
            console.log("Failed to select random point on edge due to not having nodes...")
            return null
        }
        const { node1, node2} = nodes

        const t = Math.random()

        const randomX = node1.x + t * (node2.x - node1.x)
        const randomY = node1.y + t * (node2.y - node1.y)

        return new Point(randomX, randomY)
    }

    public getAngleOfEdgeInDegrees(edge: EdgeGraphic): number | null { 
        const nodes = edge.getNodesFromIds()
        if (!nodes) {
            console.log("Failed to get angle of edge in degrees due to nodes being null")
            return null
        }
        const {node1, node2} = nodes

        const dx = node2.x - node1.x
        const dy = node2.y - node1.y

        const angleInRadians = Math.atan2(dy, dx)

        const angleInDegrees = angleInRadians * (180 / Math.PI)

        return angleInDegrees
    }

}