interface DataBlock {
  name: string
  description: string
  keywords: string[]
  thumbnail: string
}

export const typeMapTag = {
  "Text": ["div"],
  "Heading 1": ["h1"],
  "Heading 2": ["h2"],
  "Heading 3": ["h3"],
  "Bulleted List": ["ul", "li"],
  "Numbered List": ["ol", "li"]
}

export const basicBlocks: DataBlock[] = [
  {
    name: "Text",
    description: "Just start writing with plain text.",
    keywords: ["text", "paragraph", "p"],
    thumbnail: "/images/thumbnails/thumb_text.png"
  },
  {
    name: "Heading 1",
    description: "Big section heading.",
    keywords: ["h1", "#"],
    thumbnail: "/images/thumbnails/thumb_h1.png",
  },
  {
    name: "Heading 2",
    description: "Medium section heading.",
    keywords: ["h2", "##"],
    thumbnail: "/images/thumbnails/thumb_h2.png",
  },
  {
    name: "Heading 3",
    description: "Small section heading.",
    keywords: ["h3", "###"],
    thumbnail: "/images/thumbnails/thumb_h3.png",
  },
  {
    name: "Bulleted List",
    description: "Create a simple bulleted list.",
    keywords: ["ul", "unorder", "list"],
    thumbnail: "/images/thumbnails/thumb_bulleted-list.png",
  },
  {
    name: "Numbered List",
    description: "Create a list with numbering.",
    keywords: ["ol", "order", "list"],
    thumbnail: "/images/thumbnails/thumb_numbered-list.png",
  },
  // {
  //   name: "Quote",
  //   description: "Capture a quote.",
  //   keywords: ["quote", "blockquote"],
  // },
  {
    name: "Code",
    description: "Capture a code snippet.",
    keywords: ["code", "pre", "snippet"],
    thumbnail: "/images/thumbnails/thumb_code.png",
  },
  // {
  //   name: "Divider",
  //   description: "Add a horizontal line to your page.",
  //   keywords: ["hr", "horizontal", "line", "---"],
  //   thumbnail: "/images/thumbnails/thumb_divider.png",
  // },
]
