import { Point } from "pixi.js";
import { uiManager } from "./main";
import type { Edge, Node } from "./types";
import { GAME_VALUES } from "./constants";

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
                connections: [],
                editorType: "node"
            }
        )

        uiManager.updateUi()
    }

    getNodeById(nodeId: Node["id"]): Node | null {
        return this.nodes.find(node => node.id === nodeId) || null
    }

    getEdgeById(edgeId: Edge["id"]): Edge | null {
        for (const node of this.nodes) {
            if (node.connections.length > 0) {
                for (const connection of node.connections) {
                    if (connection.id === edgeId) {
                        return connection
                    }
                }
            }
        }

        console.log(`failed to find edge with if of: ${edgeId}`)
        return null
    }


    /**
     * @description gets a edge (line) from the two nodes that make the edge
     * @param {Node["id"]} node1Id 
     * @param {Node["id"]} node2Id 
     * @returns {(Edge | null)} 
     */
    getEdgeByConnectingNodes(node1Id: Node["id"], node2Id: Node["id"]): Edge | null {
        for (const node of this.nodes) {
            if (node.connections.length > 0) {
                for (const connection of node.connections) {
                    if (node.id === node1Id && connection.connectionNodeId === node2Id) {
                        return connection
                    }
                }
            }
        }
        console.log(`failed to find edge`)
        return null
    }


    /**
     * @description gets the two Nodes (points) that make up the given edge
     * @param {Edge["id"]} edgeId 
     * @returns {({ node1: Node, node2: Node } | null)} 
     */
    getConnectionNodesOfEdge(edgeId: Edge["id"]): { node1: Node, node2: Node } | null {
        let connectionNodes: { node1: Node | null, node2: Node | null } = { node1: null, node2: null }

        for (const node of this.nodes) {
            if (node.connections.length > 0) {
                if (node.connections.some(c => c.id === edgeId)) {
                    if (!connectionNodes.node1) {
                        connectionNodes.node1 = node
                    } else {
                        connectionNodes.node2 = node
                        if (connectionNodes.node1 && connectionNodes.node2) {
                            return { node1: connectionNodes.node1, node2: connectionNodes.node2 }
                        }
                    }
                }
            }
        }

        console.log("Failed to getConnectionNodesOfEdges")
        return null
    }


    /**
     * @description updates a edge object with a new edge object.
     * @param {Edge["id"]} edgeId 
     * @param {Edge} newEdgeObject 
     */
    updateEdge(edgeId: Edge["id"], newEdgeObject: Edge): void {
        let wasUpdated = false

        const getEdge = this.getEdgeById(edgeId)
        if (!getEdge) {
            console.log("failed to updateEdge due to not getting edge")
            return
        }

        this.nodes = this.nodes.map(node => {
            if (node.connections.length > 0) {
                if (node.connections.some(c => c.id === edgeId)) {
                    node.connections = node.connections.map(edge => {
                        if (edge.id === edgeId) {
                            wasUpdated = true
                            return newEdgeObject
                        }
                        return edge
                    })
                }
            }
            return node
        })

        if (!wasUpdated) {
            console.log("Failed to update edge object!")
        }

        uiManager.reDrawEdge(edgeId)
    }

    addNodeConnection(nodeId: Node["id"], connectsTo: Node["id"], edgeId: Edge["id"]): void {
        const node = this.getNodeById(nodeId)
        if (!node) {
            console.log("failed to add node connection due to not finding node!")
            return
        }

        if (node.connections.some(connections => connections.connectionNodeId === connectsTo)) {
            console.log("Failed to addNodeConnection due to node already being connected to node!")
            return
        }

        const connectingNode = this.getNodeById(connectsTo)
        if (!connectingNode) {
            console.log("Failed to add node connection due to not finding connecting node!")
            return
        }

        if (connectingNode.connections.some(c => c.connectionNodeId === node.id)) {
            console.log("failed to addNodeConnections due to node already being connected to node...")
            return
        }


        // for (const n of this.nodes) {
        //     if (n.connections.length > 0) {
        //         for (const edge of n.connections) {
        //             const edgeConnection = this.getNodeById(edge.connectionNodeId)
        //             if (!edgeConnection) return console.log("No edge connection node..")

        //             const test = checkIntersection(
        //                 node.position.x, node.position.y, connectingNode.position.x, connectingNode.position.y,
        //                 n.position.x, n.position.y, edgeConnection.position.x, edgeConnection.position.y
        //             )

        //             if (test.type === "intersecting") {
        //                 const dis = uiManager.getClosestNodeToPoint(new Point(test.point.x, test.point.y))

        //                 console.log(dis)
        //                 if (dis <= 75) {
        //                     console.log("intercestion point is too close to an actual point...")
        //                     return
        //                 }
        //                 uiManager.drawNode(new Point(test.point.x, test.point.y), "1241")

        //             }
        //         }
        //     }
        // }

        const edgeObject: Edge = { connectionNodeId: connectsTo, editorType: "edge", id: edgeId, edgeWidth: GAME_VALUES.EDGE_WIDTH, type: "normal" }
        connectingNode.connections.push(edgeObject)
        node.connections.push(edgeObject)
    }

    doesNodeAlreadyExistAtPosition(position: Point): boolean {
        return this.nodes.some(n => n.position.x === position.x && n.position.y === position.y)
    }

    isNodeAlreadyConnectedToNode(node1: Node, node2: Node): boolean {
        return node1.connections.some(c => c.connectionNodeId === node2.id)
    }
}