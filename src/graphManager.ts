import type { Point } from "pixi.js"
import { uiManager } from "./main"

export interface Node { 
    id: string
    position: Point
    connections: Node["id"][]
}

export class GraphManager { 
    nodes: Node[] = []
    addNode(position: Point, id: string): void { 
        if (this.doesNodeAlreadyExistAtPosition(position)) {
            console.log(`Failed to add node due to another node already being at position: (${position.x}, ${position.y})`)
            return
        }

        this.nodes.push(
            {
                id: id,
                position: position,
                connections: []               
            }
        )

        uiManager.updateUi()
    }

    getNodeById(nodeId: Node["id"]): Node | null { 
        return this.nodes.find(node => node.id === nodeId) || null
    }

    addNodeConnection(nodeId: Node["id"], connectsTo: Node["id"]): void { 
        const node = this.getNodeById(nodeId)
        if (!node) {
            console.log("failed to add node connection due to not finding node!")
            return 
        }

        if (node.connections.includes(connectsTo)) {
            console.log("Failed to addNodeConnection due to node already being connected to node!")
            return
        }

        const connectingNode = this.getNodeById(connectsTo)
        if (!connectingNode) {
            console.log("Failed to add node connection due to not finding connecting node!")
            return
        }

        connectingNode.connections.push(nodeId)
        node.connections.push(connectsTo)
    }

    doesNodeAlreadyExistAtPosition(position: Point): boolean { 
        return this.nodes.some(n => n.position.x === position.x && n.position.y === position.y)
    }

    isNodeAlreadyConnectedToNode(node1: Node, node2: Node): boolean { 
        return node1.connections.includes(node2.id)
    }
}