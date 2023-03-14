interface Command {
  name: string
  description: string
  keywords: string[]
}

export const commands: Command[] = [
  {
    name: "Heading 1",
    description: "Big section heading.",
    keywords: ["h1", "#"],
  },
  {
    name: "Heading 2",
    description: "Medium section heading.",
    keywords: ["h2", "##"],
  },
  {
    name: "Heading 3",
    description: "Small section heading.",
    keywords: ["h3", "###"],
  },
  {
    name: "Table",
    description: "Add simple tabular content to your page.",
    keywords: ["table"],
  },
  {
    name: "Image",
    description: "Add an image to your page.",
    keywords: ["img", "picture", "photo"],
  },
  {
    name: "Bulleted List",
    description: "Create a simple bulleted list.",
    keywords: ["ul", "unorder", "list"],
  },
  {
    name: "Numbered List",
    description: "Create a list with numbering.",
    keywords: ["ol", "order", "list"],
  },
  {
    name: "Quote",
    description: "Capture a quote.",
    keywords: ["quote", "blockquote"],
  },
  {
    name: "Code",
    description: "Capture a code snippet.",
    keywords: ["code", "pre", "snippet"],
  },
  {
    name: "Divider",
    description: "Add a horizontal line to your page.",
    keywords: ["hr", "horizontal", "line", "---"],
  },
]
