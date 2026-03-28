import { Assets, Sprite, Texture } from "pixi.js";
import { v4 as uuidv4 } from "uuid";
import { app, uiManager } from "./main";
import { GameObjectsZIndex, PROPS, type Prop } from "./types";

export class PropsManager {
    selectedProp: PropSprite | null = null
    props: Prop[] = []
    isBackTickKeyDown: boolean = false
    spritesheet: Texture | null = null

    constructor() {
        this.loadSpriteSheet()

        document.addEventListener("mousemove", (event) => {
            if (this.selectedProp) {
                this.selectedProp.position.set(event.clientX, event.clientY)
            }
        })

        document.addEventListener("keydown", (event) => {
            if (event.key === "`") {
                this.isBackTickKeyDown = true
            }
        })

        document.addEventListener("keyup", (event) => {
            if (event.key === "`") {
                this, this.isBackTickKeyDown = false
            }
        })

        app.canvas.addEventListener("click", (event) => {
            if (this.isBackTickKeyDown) {
                console.log(event.clientX, event.clientY)
            }

            if (this.selectedProp) {
                this.placeProp(this.selectedProp.propName)
            }
        })
    }

    private async loadSpriteSheet(): Promise<void> {
        const spritesheet: Texture = await Assets.load("/assets/places.png")

        this.spritesheet = spritesheet
    }

    loadProp(propId: Prop["id"]): void {
        const getProp = this.getPropById(propId)
        if (!getProp) {
            console.log("Failed to load prop due to no prop object")
            return
        }

        const propTexture = this.getPropTexture(getProp.name)
        if (!propTexture) {
            console.log("Failed to load prop due to no prop texture")
            return
        }

        const propSprite = new PropSprite(propTexture, getProp.name)
        propSprite.position.set(getProp.x, getProp.y)
        propSprite.zIndex = GameObjectsZIndex.prop
        propSprite.eventMode = "static"
        propSprite.on("click", () => {
            uiManager.selected = getProp
            uiManager.showSideMenu("prop")
            uiManager.updateUi()
        })
        app.stage.addChild(propSprite)

    }

    placeProp(propName: Prop["name"]): void {
        if (!this.selectedProp) {
            console.log("Failed to place prop due to no selected prop object")
            return
        }

        const propTexture = this.getPropTexture(propName)
        if (!propTexture) {
            console.log("Failed to place prop due to no prop texture")
            return
        }

        const propSprite = new PropSprite(propTexture, propName)
        propSprite.position.set(this.selectedProp.x, this.selectedProp.y)
        propSprite.zIndex = GameObjectsZIndex.prop

        const prop: Prop = {
            id: propSprite.propId,
            name: propName,
            x: propSprite.position.x,
            y: propSprite.position.y,
            rotation: 0,
            parentPoint: { x: 0, y: 0 },
            editorType: "prop"
        }
        this.props.push(prop)

        propSprite.eventMode = "static"
        propSprite.on("click", () => {
            uiManager.selected = prop
            uiManager.showSideMenu("prop")
            uiManager.updateUi()
        })


        app.stage.addChild(propSprite)

        this.unselectProp()
    }

    selectProp(propName: Prop["name"]): void {
        this.unselectProp()

        const propTexture = this.getPropTexture(propName)
        if (!propTexture) {
            console.log("Failed to set selected prop due to failing to get prop texture")
            return
        }

        const propSprite = new PropSprite(propTexture, propName)
        app.stage.addChild(propSprite)

        this.selectedProp = propSprite
        uiManager.updateUi()
    }

    unselectProp(): void {
        if (this.selectedProp) {
            app.stage.removeChild(this.selectedProp)
            this.selectedProp = null
            uiManager.updateUi()
        }
    }

    updateProp(propName: Prop["name"], newProp: Prop): void {
        const getProp = this.getPropByName(propName)
        if (!getProp) {
            console.log("Failed to update prop due to not finding prop object")
            return
        }

        this.props = this.props.map(prop => {
            if (prop.name === propName) {
                return newProp
            } else return prop
        })

        this.reDrawProp(propName)
        uiManager.updateUi()
    }

    reDrawProp(propName: Prop["name"]): void {
        const getProp = this.getPropByName(propName)
        if (!getProp) {
            console.log("Failed to re draw prop due to not finding prop object")
            return
        }

        const getPropSprite = app.stage.children.filter(c => c instanceof PropSprite).find(prop => prop.propName === propName)
        if (!getPropSprite) {
            console.log("Failed to re draw prop due to not finding prop sprite")
            return
        }

        // getPropSprite.rotation = Math.PI / getProp.rotation 
    }

    getPropTexture(propName: string): Texture | null {
        const propFrame = PROPS.find(prop => prop.name === propName)
        if (!propFrame) {
            console.log("Failed to get prop texture due to failing to find prop frame")
            return null
        }

        if (!this.spritesheet) {
            console.log("Failed to get prop texture due to spritesheet being null")
            return null
        }

        return new Texture({ source: this.spritesheet.source, frame: propFrame.frame })
    }

    getPropByName(propName: Prop["name"]): Prop | null {
        return this.props.find(prop => prop.name === propName) || null
    }

    getPropById(propId: Prop["id"]): Prop | null {
        return this.props.find(prop => prop.id === propId) || null
    }

    deleteProp(propName: Prop["name"]): void {
        this.props = this.props.filter(prop => prop.name !== propName)

        const getPropSprite = app.stage.children.filter(c => c instanceof PropSprite).find(prop => prop.propName === propName)
        if (!getPropSprite) {
            console.log("Failed to delete prop due to not finding prop sprite")
            return
        }

        app.stage.removeChild(getPropSprite)

        uiManager.updateUi()
    }
}

export class PropSprite extends Sprite {
    propName: Prop["name"]
    propId: string = uuidv4()

    constructor(texture: Texture, propName: Prop["name"]) {
        super(texture)
        this.propName = propName
    }
}