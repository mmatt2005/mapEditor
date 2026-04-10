import type { EdgeGraphic } from "./edge";
import { graphManager, uiManager } from "../core/main";
import type { Node } from "../types";

export class PathFindingDebug {
    private startEdge: EdgeGraphic | null = null
    private endEdge: EdgeGraphic | null = null
    nodesToVisit: Node["id"][] = []
    visitedNodes: Node["id"][] = []
    path: Node[] = []
    private cameFrom: Record<Node["id"], Node["id"] | null> = {}

    public setStartEdge(startEdge: PathFindingDebug["startEdge"]): void {
        this.startEdge = startEdge
        uiManager.updateUi()
    }

    public setEndEdge(endEdge: PathFindingDebug["endEdge"]): void {
        this.endEdge = endEdge
        uiManager.updateUi()
    }

    public getStartEdge(): PathFindingDebug["startEdge"] {
        return this.startEdge
    }

    public getEndEdge(): PathFindingDebug["endEdge"] {
        return this.endEdge
    }

    public pathfind(): Node[] {
        const startingEdge = this.getStartEdge()

        if (!startingEdge || !this.endEdge) {
            console.log("Failed to pathfind due to no start / end edge ")
            return []
        }

        const startingNodes = startingEdge.getNodesFromIds()
        if (!startingNodes) return console.log("No starting nodes"), []
        const { node1: startingNode1, node2: startingNode2 } = startingNodes
        this.cameFrom[startingNode1.id] = null
        this.cameFrom[startingNode2.id] = startingNode1.id

        // Get the neighbor node for ONLY the startingNode1. 
        this.getNeighborNodes(startingNode1.id)
        this.nodesToVisit.push(startingNode2.id)

        while (this.nodesToVisit.length > 0) {
            this.getNeighborNodes(this.nodesToVisit[0])
            this.visitedNodes.push(this.nodesToVisit[0])
            this.nodesToVisit.shift()
        }

        return this.path
    }

    public getNeighborNodes(targetNode: Node["id"]): Node["id"][] {
        const endEdge = this.getEndEdge()
        if (!endEdge) return []

        const neighborNodes: Node["id"][] = []

        const connectedEdges: EdgeGraphic[] = []
        // Get any edges that are connected to the target nodes
        graphManager.getAllEdgeGraphics().forEach(edge => {
            if (targetNode === edge.node1Id || targetNode === edge.node2Id) {
                connectedEdges.push(edge)
            }
        })


        for (const edge of connectedEdges) {
            if (edge.id === endEdge.id) {
                console.log("We've found the end edge!")

                const nodes = edge.getNodesFromIds()
                if (nodes) {
                    this.reconstructPath(nodes.node1.id) // or node2.id
                }

                this.nodesToVisit = []
                break
            }

            const nodes = edge.getNodesFromIds()
            if (nodes) {
                const { node1, node2 } = nodes

                if (!this.visitedNodes.includes(node1.id)) {
                    if (!this.visitedNodes.includes(node1.id) && !this.nodesToVisit.includes(node1.id)) {
                        this.nodesToVisit.push(node1.id)
                    }

                    if (!(node1.id in this.cameFrom)) {
                        this.cameFrom[node1.id] = targetNode
                    }
                }

                if (!this.visitedNodes.includes(node2.id)) {
                    this.nodesToVisit.push(node2.id)

                    if (!(node2.id in this.cameFrom)) {
                        this.cameFrom[node2.id] = targetNode
                    }
                }
            }
        }

        return neighborNodes
    }

    private reconstructPath(endNodeId: Node["id"]): Node["id"][] {
        const path: Node["id"][] = []

        let current: Node["id"] | null = endNodeId

        while (current !== null) {
            path.push(current)
            current = this.cameFrom[current] ?? null
        }

        path.reverse()

        path.forEach(nodeId => { 
            const getNode = graphManager.getNodeGraphic(nodeId)
            if (getNode) {
                // getNode.highlight()
                this.path.push(getNode)
            }
        })

        return path
    }


}