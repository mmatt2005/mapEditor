import { Assets, Graphics, Point, Rectangle, Sprite, Texture } from "pixi.js";
import { viewport, worldLayer } from "./main";
import { GameObjectsZIndex, type Prop, type PROPS } from "./types";
import { v4 as uuidv4 } from "uuid"

export class PropsManager {
    selectedProp: PropSprite | null = null
    spritesheet: Texture | null = null
    
    constructor() {
        this.loadSpritesheet()

        viewport.on("mousemove", (event) => {
            if (this.selectedProp) {
                const position = viewport.toWorld(event.global.x, event.global.y)
                this.selectedProp.position.set(position.x, position.y)
            }
        })
    }

    private async loadSpritesheet(): Promise<void> {
        const spritesheet = await Assets.load("/assets/places.png")
        this.spritesheet = spritesheet
    }

    public setSelectedProp(selectedPropFrame: Rectangle): void {
        if (!this.spritesheet) {
            console.log("Failed to select prop due to spritesheet being null")
            return
        }

        const propTexture = new Texture({source: this.spritesheet.source, frame: selectedPropFrame})
        this.selectedProp = new PropSprite(propTexture)
        this.selectedProp.zIndex = GameObjectsZIndex.prop

        worldLayer.addChild(this.selectedProp)
    }
}

export class PropSprite extends Sprite implements Prop {
    parentPoint: { x: number; y: number; } = new Point()
    editorType: Prop["editorType"] = "prop"
    id: string = uuidv4()
    propName: Prop["propName"] = "basic house"



    constructor(texture: Texture) {
        super(texture)
    }


}