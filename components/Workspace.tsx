import { useState } from "react";
import { ReactSortable } from "react-sortablejs";
import Topbar from "./Topbar";
import ReactMarkdown from "react-markdown";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faGripVertical } from "@fortawesome/free-solid-svg-icons";

interface ItemType {
  id: number;
  name: string;
}

const Workspace = () => {

    const [state, setState] = useState<ItemType[]>([
      { id: 1, name: "shrek" },
      { id: 2, name: "fiona" },
      { id: 3, name: "shiba" },
      { id: 4, name: "arpo" },
      { id: 5, name: "nutto" },
    ]);

    const [markdown, setMarkdown] = useState('')
    const [isTop, setIsTop] = useState(true)

    const handleMarkdown = (e) => {
      if (e.key === 'Enter') {
        setMarkdown(markdown + '\n')
      }
    }

    const handleDragEnd = (e) => {
      // get current order
      console.log('e', e)
      // const order = get(state)
      // console.log(order)
    }

    return (
        <div className={`flex-1`}>
            <Topbar />

            <div className={`mt-12 h-[calc(100vh-3rem)] overflow-y-auto scroll-smooth
                ${isTop ? 'overscroll-auto' : 'overscroll-none'}`}
                onScroll={(e) => e.currentTarget.scrollTop == 0 ? setIsTop(true) : setIsTop(false)}
            >

                <div className="pt-8 pb-4 mb-16 px-4 container
                lg:max-w-screen-md
                ">
                    <h1 className="text-5xl font-bold mb-5">Home Page</h1>
                    <p>
                        Lorem ipsum dolor, sit amet consectetur adipisicing elit.
                        Ipsam quisquam aliquam cupiditate ab saepe dolorum doloremque doloribus
                        eligendi repellendus deserunt voluptas laboriosam unde ut quae dicta,
                        minima placeat quo commodi!
                        Lorem ipsum dolor, sit amet consectetur adipisicing elit.
                        Ipsam quisquam aliquam cupiditate ab saepe dolorum doloremque doloribus
                        eligendi repellendus deserunt voluptas laboriosam unde ut quae dicta,
                        minima placeat quo commodi!
                    </p>
                    <br />

                    <div className="disable-global">
                      <textarea
                        onChange={(e) => setMarkdown(e.target.value)}
                        className='outline-none w-full h-auto resize-none'
                        onKeyDown={(e) => handleMarkdown(e)}
                        placeholder='Write your markdown here'
                      />
                      <ReactMarkdown>
                        {markdown}
                      </ReactMarkdown>
                    </div>

                    <br />

                    <ReactSortable
                      list={state}
                      setList={setState}
                      group="groupName"
                      animation={200}
                      delayOnTouchOnly={true}
                      delay={100}
                      swapThreshold={0.65}
                      fallbackOnBody={true}
                      handle=".handle"
                      ghostClass="drop-indicator"
                      fallbackTolerance={5}
                      onEnd={(e) => handleDragEnd(e.from)}
                    >
                      {state.map((item) => (
                        <div
                          key={item.id}
                          className='bg-white border-cyan-200 flex items-center group handle'>
                        <FontAwesomeIcon icon={faGripVertical}
                            className='text-neutral-400 p-1 mr-2 duration-150
                            hover:bg-slate-200
                            focus:outline-none
                            opacity-0 group-hover:opacity-100
                            '
                        />
                        <span className={`p-2 flex-1`}>
                          {item.id + ': ' + item.name}
                        </span>
                      </div>
                      ))}
                    </ReactSortable>



                </div>
            </div>

        </div>
    )
}

export default Workspace;