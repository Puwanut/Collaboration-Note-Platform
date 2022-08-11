import React from 'react';
import {useSortable} from '@dnd-kit/sortable';
import {CSS} from '@dnd-kit/utilities';
import { Item } from './Item';

export function SortableItem(props) {
  const {
    attributes,
    listeners,
    setNodeRef,
    transform,
    transition,
    isDragging
  } = useSortable({id: props.id});

  const style = {
    transform: CSS.Transform.toString(transform),
    transition,
  };

  return (
        <Item
        ref={setNodeRef}
        style={style}
        faded={isDragging}
        attributes={attributes}
        listeners={listeners}
        {...props}
        />

  );
}

// <div className='border-cyan-200 flex items-center group'
//     ref={setNodeRef}
//     style={style}
// >
//     <FontAwesomeIcon icon={faGripVertical}
//         className='text-neutral-400 p-1 mr-2 duration-150
//         hover:bg-slate-200
//         focus:outline-none
//         opacity-0 group-hover:opacity-100
//         '
//     {...attributes} {...listeners}

//     />
//     <span className='border-2 p-2 flex-1'>List Item {props.id}</span>
// </div>