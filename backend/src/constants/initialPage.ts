import { randomUUID } from "crypto";

export const initialPage = {
    title: "Getting Started",
    blocks: [
        {
            id: randomUUID(),
            type: "Text",
            properties: {
                title: [["👋 Welcome to Notion Clone!"]],
            }
        },
        {
            id: randomUUID(),
            type: "Text",
            properties: {
                title: [[""]],
            }
        },
        {
            id: randomUUID(),
            type: "Heading 1",
            properties: {
                title: [["Write down some text"]],
            }
        },
        {
            id: randomUUID(),
            type: "Text",
            properties: {
                title: [["They found Mary, as usual, deep in the study of thorough-bass and human nature; and had some extracts to admire, and some new observations of threadbare morality to listen to. Catherine and Lydia had information for them of a different sort."]],
            }
        },
        {
            id: randomUUID(),
            type: "Heading 1",
            properties: {
                title: [["Make a to-do list"]],
            }
        },
        {
            id: randomUUID(),
            type: "To-do List",
            properties: {
                title: [["Wake up"]],
                checked: true
            }
        },
        {
            id: randomUUID(),
            type: "To-do List",
            properties: {
                title: [["Brush teeth"]],
                checked: true
            }
        },
        {
            id: randomUUID(),
            type: "To-do List",
            properties: {
                title: [["Eat breakfast"]],
                checked: false
            }
        },
        {
            id: randomUUID(),
            type: "Heading 1",
            properties: {
                title: [["Make a cooking recipes"]],
            }
        },
        {
            id: randomUUID(),
            type: "Heading 2",
            properties: {
                title: [["Thai Tea"]],
            }
        },
        {
            id: randomUUID(),
            type: "Heading 3",
            properties: {
                title: [["Ingredients"]],
            }
        },
        {
            id: randomUUID(),
            type: "Bulleted List",
            properties: {
                title: [["1 cup (80g) Thai Tea Mix"]],
            }
        },
        {
            id: randomUUID(),
            type: "Bulleted List",
            properties: {
                title: [["4 cups (960 ml) water"]],
            }
        },
        {
            id: randomUUID(),
            type: "Bulleted List",
            properties: {
                title: [["3/4 cup (150 g) granulated sugar"]],
            }
        },
        {
            id: randomUUID(),
            type: "Bulleted List",
            properties: {
                title: [["3/4 cup (240 ml) half and half"], ["(approximately), (some folks also use coconut milk, whole milk, sweetened condensed milk)", "i"]],
            }
        },
        {
            id: randomUUID(),
            type: "Bulleted List",
            properties: {
                title: [["ice"]],
            }
        },
        {
            id: randomUUID(),
            type: "Heading 3",
            properties: {
                title: [["Equipment"]],
            }
        },
        {
            id: randomUUID(),
            type: "Bulleted List",
            properties: {
                title: [["Optional - Reuseable Cloth filter"]],
            }
        },
        {
            id: randomUUID(),
            type: "Heading 3",
            properties: {
                title: [["Instructions"]],
            }
        },
        {
            id: randomUUID(),
            type: "Numbered List",
            properties: {
                title: [["Bring water to boil and add the thai tea mix. Add sugar and gently stir to completely dissolve sugar. Gently boil tea for about 3 minutes. Remove from heat."]],
            }
        },
        {
            id: randomUUID(),
            type: "Numbered List",
            properties: {
                title: [["Allow tea to steep for at least 30 minutes and allow it to cool. The more concentrated the tea flavor, the better the Thai tea tastes."]],
            }
        },
        {
            id: randomUUID(),
            type: "Numbered List",
            properties: {
                title: [
                    ["If you are using the Thai tea mix, strain the tea leaves (we love using these reusable cloth filters). Set finished Thai tea aside to cool."],
                    ["You can make this ahead of time and have the Thai tea chilling in the fridge. We usually like to make this tea mix one day ahead.", "i"]
                ]
            }
        },
        {
            id: randomUUID(),
            type: "Numbered List",
            properties: {
                title: [["Fill glasses with ice and pour in Thai tea leaving enough room to fill in your half and half (or other creamer). For an 8 oz. glass we like to add about 2-3 tablespoons of half and half for a creamier flavor."]]
            }
        },
        {
            id: randomUUID(),
            type: "Heading 1",
            properties: {
                title: [["Make a code snippet"]],
            }
        },
        {
            id: randomUUID(),
            type: "Heading 2",
            properties: {
                title: [["Format Dates"]],
            }
        },
        {
            id: randomUUID(),
            type: "Text",
            properties: {
                title: [
                    ["The following snippet will format a date in"],
                    ["DD-MM-YYYY HH:MM format:", "b"]
                ],
            }
        },
        {
            id: randomUUID(),
            type: "Code",
            properties: {
                title: [[`const date = new Date();
                const dateString = date.getDate()  + '-' + (date.getMonth()+1) + '-' + date.getFullYear() + ' ' + date.getHours() + ':' + date.getMinutes();
                console.log(dateString); // Output: 26-1-2022 16:50`
                ]],
                language: "javascript"
            }
        }
    ]
}
