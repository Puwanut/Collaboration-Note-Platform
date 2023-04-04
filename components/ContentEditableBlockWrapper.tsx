import ContentEditable from "react-contenteditable"
import { useEffect, useState } from "react"


const ContentEditableWrapper = (props) => {
    const { tag, ...rest } = props
    const [innerTag, setInnerTag] = useState(tag.length > 1 ? tag[1] : tag[0])
    const [outerTag, setOuterTag] = useState(tag.length > 1 ? tag[0] : null)

    useEffect(() => {
        setInnerTag(tag.length > 1 ? tag[1] : tag[0])
        setOuterTag(tag.length > 1 ? tag[0] : null)
    }, [tag])

    return (
        <>
            {outerTag === null &&
                <ContentEditable
                    tagName={innerTag}
                    {...rest}
                />
            }
            {outerTag === "ul" &&
                <ul className="w-full pl-7 bg-neutral-100">
                    <ContentEditable
                        tagName={innerTag}
                        {...rest}
                    />
                </ul>
            }
            {outerTag === "ol" &&
                <ol className="w-full pl-7 bg-neutral-100">
                    <ContentEditable
                        tagName={innerTag}
                        {...rest}
                    />
                </ol>
            }
        </>
    )
}

export default ContentEditableWrapper
