import cors from "cors"
import express, { Request } from "express"
import { writeFileSync } from "fs"
import path from "path"
const app = express()
app.use(cors())
app.use(express.json())

interface UpdateRequestBody {
    mapJsonFile: string
    mapData: any
}

app.post("/update", async (req: Request<{}, {}, UpdateRequestBody>, res) => {
    const jsonPath = path.join(process.cwd(), `/public/${req.body.mapJsonFile}`)


    try {
        writeFileSync(jsonPath, req.body.mapData)
        console.log(`Sucessfully updated map: ${req.body.mapJsonFile}`)
        res.sendStatus(200)
    } catch (e) {
        console.log(`Failed to update map: ${req.body.mapJsonFile}`)
        res.sendStatus(400)

    }

})

app.listen(3000, () => {
    console.log("The server is running on port 3000!")
})