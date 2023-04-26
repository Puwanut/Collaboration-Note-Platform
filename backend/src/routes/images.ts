
import { Request, Response, Router } from "express";
import { IMAGE_EXPIRED_TIME, bucket, cachedImageUrls } from "../libs/supabase";
import multer from "multer"
import { v4 as uuidv4 } from 'uuid';

const router = Router()
const upload = multer({
    storage: multer.memoryStorage(),
    limits: {
        fileSize: 4 * 1024 * 1024 // no larger than 5mb
    }
})

router.get("/:workspaceId/:imageFile", async (req: Request, res: Response) => {
    /* to be implemented user permission checking
    workspaceId will be used to check if the user has access to the workspace
    */
    const imagePath = req.params.workspaceId + "/" + req.params.imageFile
    console.log("imagePath", imagePath)
    const cachedUrl = cachedImageUrls.get(imagePath)
    if (cachedUrl && cachedUrl.expiredAt > new Date()) {
        res.json({ signedUrl: cachedUrl.signedUrl })
    } else {
        const signedURL = await bucket.createSignedUrl(imagePath, IMAGE_EXPIRED_TIME)
        if (!signedURL.error) {
            cachedImageUrls.set(imagePath, { signedUrl: signedURL.data.signedUrl, expiredAt: new Date(Date.now() + IMAGE_EXPIRED_TIME * 1000) })
            res.json({ signedUrl: signedURL.data.signedUrl })
        }
    }
})

router.post("/:workspaceId/upload", upload.single("file") ,async (req: Request, res: Response) => {
    /* to be implemented user permission checking
    */
    console.log(req.file)
    const imagePath = req.params.workspaceId + "/" + uuidv4() + "_" + req.file?.originalname
    const fileBuffer = req.file?.buffer as Buffer
    const data = await bucket.upload(imagePath, fileBuffer, {
        cacheControl: '3600',
        // cacheControl: "public, max-age=31536000, immutable",
        upsert: false,
        contentType: req.file?.mimetype
    })
    if (data.error) res.status(400).json(data.error)
    else res.json(data.data)

})

export default router
