import { useCallback, useState } from "react";
import Topbar from "./Topbar";
import {
  DndContext,
  closestCenter,
  KeyboardSensor,
  useSensor,
  useSensors,
  TouchSensor,
  MouseSensor,
  DragOverlay,
} from '@dnd-kit/core';
import {
  arrayMove,
  SortableContext,
  sortableKeyboardCoordinates,
  verticalListSortingStrategy,
} from '@dnd-kit/sortable';
import {SortableItem} from './SortableItem';
// import { restrictToVerticalAxis } from "@dnd-kit/modifiers";
import { Item } from "./Item";

const Workspace = () => {

    const [isTop, setIsTop] = useState(true)
    const [items, setItems] = useState([1, 2, 3, 4, 5, 6, 7, 8, 9, 10, 11, 12, 13, 14, 15, 16, 17, 18, 19, 20]);
    const [activeId, setActiveId] = useState(null);
    const sensors = useSensors(
      useSensor(MouseSensor, {
        // Require the mouse to move by 10 pixels before activating
        activationConstraint: {
          distance: 10,
        },
      }),
      useSensor(TouchSensor, {
        // Press delay of 250ms, with tolerance of 5px of movement
        activationConstraint: {
          delay: 250,
          tolerance: 5,
        },
      }),
      useSensor(KeyboardSensor, {
        coordinateGetter: sortableKeyboardCoordinates,
      })
    );

    const handleDragStart = useCallback((event) => {
      setActiveId(event.active.id)
    }, [setActiveId])

    const handleDragOver = useCallback(
      (event) => {
        const {active, over} = event;

      if (active.id !== over.id) {
        setItems((items) => {
          const oldIndex = items.indexOf(active.id);
          const newIndex = items.indexOf(over.id);

          return arrayMove(items, oldIndex, newIndex);
        });
      }

      },
      [setItems],
    )

    const handleDragEnd = useCallback(() => {
      setActiveId(null);  // Reset the active item
    }, [setActiveId])

    const handleDragCancel = useCallback(() => {
      setActiveId(null);  // Reset the active item
    }, [setActiveId])

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
                    <DndContext
                      sensors={sensors}
                      collisionDetection={closestCenter}
                      onDragStart={handleDragStart}
                      onDragOver={handleDragOver}
                      onDragEnd={handleDragEnd}
                      onDragCancel={handleDragCancel}
                      // modifiers={[restrictToVerticalAxis]}
                    >
                      <SortableContext
                        items={items}
                        strategy={verticalListSortingStrategy}
                      >
                        {items.map(id => <SortableItem key={id} id={id} />)}
                      </SortableContext>

                      <DragOverlay>
                        {activeId ? <Item id={activeId} /> : null}
                      </DragOverlay>

                    </DndContext>

                </div>
                {/* <div className="relative"> */}
                {/* </div> */}
            </div>

        </div>
    )
}

export default Workspace;