import { viewport } from "../main";


/**
 * @description initializes the viewport by setting all the attributes
 * @export
 */
export function initializeViewport(): void { 
    viewport.sortableChildren = true
    viewport.drag().pinch().wheel().decelerate();
    viewport.fit()
    viewport.moveCenter(viewport.worldWidth / 2, viewport.worldHeight / 2)
    viewport.clampZoom({ minWidth: 500, minHeight: 500, maxWidth: viewport.worldWidth * 2, maxHeight: viewport.worldHeight * 2 })
    const padding = 500
    viewport.clamp({
        left: -padding,
        right: viewport.worldWidth + padding,
        top: -padding,
        bottom: viewport.worldHeight + padding
    })
}