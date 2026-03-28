// import { Graphics, Ticker, type Point } from "pixi.js";
// import { app, car, uiManager } from "./main";
// import type { Node } from "./types";

// export class TestCar {
//     position: Point
//     carGraphic: Graphics
//     constructor() {
//         const startPoint = uiManager.graphManager.nodes[0].position

//         this.position = startPoint

//         this.carGraphic = new Graphics()
//         this.carGraphic.circle(this.position.x, this.position.y, 20)
//         this.carGraphic.fill("black")
//         this.carGraphic.alpha = 0.5
//         this.carGraphic.zIndex = 5
//         app.stage.addChild(this.carGraphic)
//     }

//     moveTo(node: Node): void {
//         const carTicker = new Ticker()

//         carTicker.add(() => {

//             const dx = node.position.x - this.position.x
//             const dy = node.position.y - this.position.y
//             const distance = Math.sqrt(dx * dx + dy * dy)

//             const speed = 0.8
//             const vx = (dx / distance) * speed
//             const vy = (dy / distance) * speed

//             if (distance < 1) {
//                 console.log("We've reached the node!")
//                 carTicker.stop()
//             }


//             this.position.x += vx
//             this.position.y += vy

//             this.carGraphic.clear()
//             this.carGraphic.circle(this.position.x, this.position.y, 20)
//             this.carGraphic.fill("black")
//             this.carGraphic.alpha = 0.5
//             this.carGraphic.zIndex = 5

//         })

//         carTicker.start()

//         console.log(node)
//         console.log("move there now!")
//     }
// }