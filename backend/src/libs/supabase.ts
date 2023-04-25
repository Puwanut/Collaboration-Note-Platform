import { createClient } from '@supabase/supabase-js'
import { ImageMemo } from '../types/imageMemo.type'

const bucketName = process.env.NODE_ENV === 'production' ? 'prod' : 'dev' as string
const supabaseUrl = process.env.SUPABASE_URL as string
const supabaseKey = process.env.SUPABASE_API_KEY as string

const supabase = createClient(supabaseUrl, supabaseKey)

export const bucket = supabase.storage.from(bucketName)
export const IMAGE_EXPIRED_TIME = 7*24*60*60 // 7 days

export const cachedImageUrls = new Map<string, ImageMemo>()
