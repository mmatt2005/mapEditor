import { Graphics } from "pixi.js"
import { v4 as uuidv4 } from "uuid"
import { GAME_VALUES } from "../constants"
import { graphManager, highlightManager, uiManager, worldLayer } from "../core/main"
import { GameObjectsZIndex, type Edge, type Node } from "../types"
import type { NodeGraphic } from "./node"

export class EdgeGraphic extends Graphics implements Edge {
    id: string = uuidv4()
    edgeWidth: number = GAME_VALUES.MIN_EDGE_WIDTH
    type: Edge["type"] = "normal"
    editorType: Edge["editorType"] = "edge"
    node1Id: Node["id"] = ""
    node2Id: Node["id"] = ""

    public updateEdge(newEdge: Edge): void {
        const nodes = this.getNodesFromIds()
        if (!nodes) return console.log("no nodes")
        const { node1, node2 } = nodes

        this.edgeWidth = newEdge.edgeWidth
        this.type = newEdge.type

        this.clear()
        this.draw(node1, node2)

        uiManager.updateUi()
    }

    private handleClick() {
        highlightManager.highlight(this)
        uiManager.setSideMenu("edge", this.getEdgeObject())
    }

    public getEdgeObject(): Edge {
        return {
            id: this.id,
            edgeWidth: this.edgeWidth,
            type: this.type,
            editorType: this.editorType,
            node1Id: this.node1Id,
            node2Id: this.node2Id
        }
    }

    public createEdgeGraphic(node1: Node, node2: Node): void {
        this.node1Id = node1.id
        this.node2Id = node2.id
        this.draw(node1, node2)

        this.eventMode = "static"
        this.on("click", this.handleClick)

        worldLayer.addChild(this)
    }

    private draw(node1: Node, node2: Node): void {
        // Draw the gray road
        this.moveTo(node1.position.x, node1.position.y)
        this.lineTo(node2.position.x, node2.position.y)
        this.stroke({ width: this.edgeWidth, color: "darkgray" })
        this.zIndex = GameObjectsZIndex.edge

        // Draw the Yellow line
        this.moveTo(node1.position.x, node1.position.y)
        this.lineTo(node2.position.x, node2.position.y)
        this.stroke({ width: 5, color: "yellow" })
    }

    public getNodesFromIds(): { node1: NodeGraphic, node2: NodeGraphic } | null {
        const node1 = graphManager.getNodeGraphic(this.node1Id)
        const node2 = graphManager.getNodeGraphic(this.node2Id)

        if (!node1 || !node2) {
            console.log("Failed to get NodesFromIds.")
            return null
        }

        return { node1: node1, node2: node2 }
    }
}


export class LoadEdgeGraphic extends EdgeGraphic {
    constructor(node1: Node, node2: Node, edge: Edge) {
        super()
        this.id = edge.id
        this.type = edge.type
        this.edgeWidth = edge.edgeWidth
        this.createEdgeGraphic(node1, node2)
    }
}