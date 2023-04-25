import { gallery } from "../shared/gallery"

export function randomPageCover() {
    const category = gallery[Math.floor(Math.random() * gallery.length)]
    const image = category.images[Math.floor(Math.random() * category.images.length)]
    return `gallery/${image}`
}

// export async function randomPageCover() {
//     const res = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/gallery/random`, {
//         method: 'GET',
//     })
//     const data = await res.json()
//     return `gallery/${data.name}`
// }
//
// export async function fetchGallery() {
//     const res = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/gallery`, {
//         method: 'GET',
//     })
//     const data = await res.json()
//     return data
// }
