
import { Request, Response, Router } from "express";
import { IMAGE_EXPIRED_TIME, bucket, cachedImageUrls } from "../libs/supabase";

const router = Router()

router.get("/:workspaceId/:imageFile", async (req: Request, res: Response) => {
    /* to be implemented user permission checking
    */
    const imagePath = req.params.workspaceId + "/" + req.params.imageFile
    const cachedUrl = cachedImageUrls.get(imagePath)
    if (cachedUrl && cachedUrl.expiredAt > new Date()) {
        res.json({
            data: {
                signedUrl: cachedUrl.signedUrl
            }
        })
    } else {
        const signedURL = await bucket.createSignedUrl(imagePath, IMAGE_EXPIRED_TIME)
        if (!signedURL.error) {
            cachedImageUrls.set(imagePath, { signedUrl: signedURL.data.signedUrl, expiredAt: new Date(Date.now() + IMAGE_EXPIRED_TIME * 1000) })
        }
        res.json(signedURL)
    }
})

router.post("/:workspaceId/upload",async (req: Request, res: Response) => {
    /* to be implemented user permission checking
    */
    const imagePath = req.params.workspaceId + "/" + req.body
    const data = await bucket.upload(imagePath, req.body, {
        cacheControl: "public, max-age=31536000, immutable",
        upsert: false
    })
    res.json(data)

})

export default router
