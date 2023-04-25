import { Request, Response, Router } from "express"
import { bucket } from "../libs/supabase"

const router = Router()

router.get("/", async (_req: Request, res: Response) => {
    const allGalleryImages = await bucket.list("gallery")
    if (allGalleryImages.data) {
        res.json(allGalleryImages.data.map(image => image.name))
    } else {
        res.status(404).json({ message: "No images found in gallery." })
    }
})

router.get("/random", async (_req: Request, res: Response) => {
    const allGalleryImages = await bucket.list("gallery")
    if (allGalleryImages.data) {
        const randomImage = allGalleryImages.data[Math.floor(Math.random() * allGalleryImages.data.length)]
        res.json(randomImage)
    } else {
        res.status(404).json({ message: "No images found in gallery." })
    }
})

export default router
