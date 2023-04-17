export const initialPage = {
    title: "Getting Started",
    blocks: [
        {
            type: "Text",
            properties: {
                title: [["👋 Welcome to Notion Clone!"]],
            }
        },
        {
            type: "Text",
            properties: {
                title: [[""]],
            }
        },
        {
            type: "Heading 1",
            properties: {
                title: [["Write down some text"]],
            }
        },
        {
            type: "Text",
            properties: {
                title: [["They found Mary, as usual, deep in the study of thorough-bass and human nature; and had some extracts to admire, and some new observations of threadbare morality to listen to. Catherine and Lydia had information for them of a different sort."]],
            }
        },
        {
            type: "Heading 1",
            properties: {
                title: [["Make a to-do list"]],
            }
        },
        {
            type: "To-do List",
            properties: {
                title: [["Wake up"]],
                checked: true
            }
        },
        {
            type: "To-do List",
            properties: {
                title: [["Brush teeth"]],
                checked: true
            }
        },
        {
            type: "To-do List",
            properties: {
                title: [["Eat breakfast"]],
                checked: false
            }
        },
        {
            type: "Heading 1",
            properties: {
                title: [["Make a cooking recipes"]],
            }
        },
        {
            type: "Heading 2",
            properties: {
                title: [["Thai Tea"]],
            }
        },
        {
            type: "Heading 3",
            properties: {
                title: [["Ingredients"]],
            }
        },
        {
            type: "Bulleted List",
            properties: {
                title: [["1 cup (80g) Thai Tea Mix"]],
            }
        },
        {
            type: "Bulleted List",
            properties: {
                title: [["4 cups (960 ml) water"]],
            }
        },
        {
            type: "Bulleted List",
            properties: {
                title: [["3/4 cup (150 g) granulated sugar"]],
            }
        },
        {
            type: "Bulleted List",
            properties: {
                title: [["3/4 cup (240 ml) half and half"], ["(approximately), (some folks also use coconut milk, whole milk, sweetened condensed milk)", "i"]],
            }
        },
        {
            type: "Bulleted List",
            properties: {
                title: [["ice"]],
            }
        },
        {
            type: "Heading 3",
            properties: {
                title: [["Equipment"]],
            }
        },
        {
            type: "Bulleted List",
            properties: {
                title: [["Optional - Reuseable Cloth filter"]],
            }
        },
        {
            type: "Heading 3",
            properties: {
                title: [["Instructions"]],
            }
        },
        {
            type: "Numbered List",
            properties: {
                title: [["Bring water to boil and add the thai tea mix. Add sugar and gently stir to completely dissolve sugar. Gently boil tea for about 3 minutes. Remove from heat."]],
            }
        },
        {
            type: "Numbered List",
            properties: {
                title: [["Allow tea to steep for at least 30 minutes and allow it to cool. The more concentrated the tea flavor, the better the Thai tea tastes."]],
            }
        },
        {
            type: "Numbered List",
            properties: {
                title: [
                    ["If you are using the Thai tea mix, strain the tea leaves (we love using these reusable cloth filters). Set finished Thai tea aside to cool."],
                    ["You can make this ahead of time and have the Thai tea chilling in the fridge. We usually like to make this tea mix one day ahead.", "i"]
                ]
            }
        },
        {
            type: "Numbered List",
            properties: {
                title: [["Fill glasses with ice and pour in Thai tea leaving enough room to fill in your half and half (or other creamer). For an 8 oz. glass we like to add about 2-3 tablespoons of half and half for a creamier flavor."]]
            }
        },
        {
            type: "Heading 1",
            properties: {
                title: [["Make a code snippet"]],
            }
        },
        {
            type: "Heading 2",
            properties: {
                title: [["Format Dates"]],
            }
        },
        {
            type: "Text",
            properties: {
                title: [
                    ["The following snippet will format a date in"],
                    ["DD-MM-YYYY HH:MM format:", "b"]
                ],
            }
        },
        {
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
