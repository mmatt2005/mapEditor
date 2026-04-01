import { Circle, Graphics, Point } from "pixi.js"
import { v4 as uuidv4 } from "uuid"
import { GraphManager } from "./graphManager"
import { app } from "./main"
import { PropsManager } from "./propsManager"
import { GameObjectsZIndex, GameMapOptions, type Edge, type Node, type Prop, type Zone } from "./types"
import { ZoneManager } from "./zoneManager"

export class UiManager {
    graphManager: GraphManager = new GraphManager()
    zoneManager: ZoneManager = new ZoneManager()
    propsManager: PropsManager = new PropsManager()
    selected: Node | Edge | Zone | Prop | null = null
    isCtrlKeyDown: boolean = false
    sideMenu: { visibile: boolean, selected: "map" | "node" | "edge" | "zone" | "place-prop" | "prop" | null } = { visibile: false, selected: null }
    currentMap: keyof (typeof GameMapOptions) = "CITY"

    constructor() {
        document.addEventListener("keydown", event => {
            if (event.key === "Control") {
                this.isCtrlKeyDown = true
            }
        })

        document.addEventListener("keyup", event => {
            if (event.key === "Control") {
                this.isCtrlKeyDown = false
            }
        })

        app.canvas.addEventListener("click", event => {
            if (this.isCtrlKeyDown) {
                const position = new Point(event.clientX, event.clientY)
                const id = uuidv4()

                for (const pt of this.graphManager.nodes) {
                    if (this.calculateDistanceBetweenTwoNodes(pt.position, position) <= 50) {
                        console.log("Failed to draw point due to point being too close to another point...")
                        return
                    }
                }

                this.drawNode(position, id)
                this.graphManager.addNode(position, id)
            }
        })

    }

    /** @description updates the react ui with the most up to date uiManager class  */
    updateUi(): void { }

    /**
     * @description draws a node (point) at a given point (x, y)
     * @param {Point} point 
     */
    drawNode(point: Point, id: string): void {
        const node = new NodeGraphics(id)
        node.circle(point.x, point.y, 10)
        node.fill("white")
        node.zIndex = GameObjectsZIndex.point
        node.eventMode = "static"
        node.hitArea = new Circle(point.x, point.y, 30)
        node.on("click", () => {
            const getNode = this.graphManager.getNodeById(node.id)
            if (!getNode) return console.log("Failed to get node so nopoe!")

            if (!this.selected || this.selected.editorType !== "node") {
                this.selected = getNode
            } else {
                const edgeId = uuidv4()
                this.graphManager.addNodeConnection(this.selected.id, getNode.id, edgeId)
                this.drawEdge(this.selected.position, new Point(point.x, point.y), edgeId)
                this.selected = null

            }

            this.updateUi()
        })
        app.stage.addChild(node)
    }

    drawEdge(pt1: Point, pt2: Point, edgeId: string): void {
        const edge = this.graphManager.getEdgeById(edgeId)
        if (!edge) {
            console.log("Failed to draw edge due to not finding edge object")
            return
        }

        const edgeHitbox = new Graphics()
        edgeHitbox.moveTo(pt1.x, pt1.y)
        edgeHitbox.lineTo(pt2.x, pt2.y)
        edgeHitbox.stroke({ width: edge.edgeWidth + 10, alpha: 0.0 })
        edgeHitbox.eventMode = "static"
        edgeHitbox.zIndex = GameObjectsZIndex.edge
        edgeHitbox.on("click", () => {
            console.log("A edge was clicked!")
            const getEdge = this.graphManager.getEdgeById(edgeGraphic.id)
            if (!getEdge) {
                console.log("Failed to select edge due to not finding edge")
                return
            }
            this.selected = getEdge
            this.showSideMenu("edge")
            this.updateUi()
        })

        const edgeGraphic = new EdgeGraphics(edgeId)
        edgeGraphic.moveTo(pt1.x, pt1.y)
        edgeGraphic.lineTo(pt2.x, pt2.y)
        edgeGraphic.stroke({ color: "blue", width: edge.edgeWidth })
        edgeGraphic.zIndex = GameObjectsZIndex.edge
        app.stage.addChild(edgeGraphic)

        app.stage.addChild(edgeHitbox)
    }

    reDrawEdge(edgeId: Edge["id"]): void {
        const getConnectionNodesOfEdge = this.graphManager.getConnectionNodesOfEdge(edgeId)
        if (!getConnectionNodesOfEdge) {
            console.log("Failed to reDrawEdge due to failing to get connection node of edge")
            return
        }
        const { node1, node2 } = getConnectionNodesOfEdge

        const edge = this.graphManager.getEdgeById(edgeId)
        if (!edge) {
            console.log("Failed to re draw edge due to not finding edge object")
            return
        }

        app.stage.children.filter(e => e instanceof EdgeGraphics).forEach(e => {
            if (e.id === edgeId) {
                // Re draw the edge itself
                e.clear()
                e.moveTo(node1.position.x, node1.position.y)
                e.lineTo(node2.position.x, node2.position.y)
                e.stroke({ color: "blue", width: edge.edgeWidth })
                app.stage.addChild(e)
            }
        })
    }

    // getClosestNodeToPoint(point: Point): number { 

    //     const closestNode = uiManager.graphManager.nodes.sort((nodeA, nodeB) => { 
    //         const nodeADistance = Math.hypot(point.x - nodeA.position.x, point.y - nodeA.position.y)
    //         const nodeBDistance = Math.hypot(point.x, - nodeB.position.x, point.y - nodeB.position.y)

    //         return nodeADistance - nodeBDistance
    //     })

    //     const distance = Math.hypot(point.x - closestNode[0].position.x, point.y - closestNode[0].position.y)

    //     return Math.round(distance)
    // }

    calculateDistanceBetweenTwoNodes(node1: Point, node2: Point): number {
        const dx = node1.x - node2.x;
        const dy = node1.y - node2.y;
        const distance = Math.sqrt(dx * dx + dy * dy);

        return distance
    }

    showSideMenu(selectedOption: UiManager["sideMenu"]["selected"]): void {
        this.sideMenu.visibile = true
        this.sideMenu.selected = selectedOption
    }

    hideSideMenu(): void {
        this.sideMenu.visibile = false
        this.sideMenu.selected = null
    }
}

class NodeGraphics extends Graphics {
    id: string

    constructor(id: string) {
        super()
        this.id = id
    }

}

class EdgeGraphics extends Graphics {
    id: string

    constructor(id: string) {
        super()
        this.id = id
    }
}