import React from 'react';
import {useSortable} from '@dnd-kit/sortable';
import {CSS} from '@dnd-kit/utilities';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faGripVertical } from '@fortawesome/free-solid-svg-icons';

export function SortableItem(props) {
  const {
    attributes,
    listeners,
    setNodeRef,
    transform,
    transition,
  } = useSortable({id: props.id});

  const style = {
    transform: CSS.Transform.toString(transform),
    transition,
  };

  return (
    <div ref={setNodeRef} style={style}>
        <div className='border-cyan-200 flex items-center'>
            <FontAwesomeIcon icon={faGripVertical}
                className='text-neutral-400 p-1 mr-2
                hover:bg-slate-200 duration-300
                focus:outline-none'
            {...attributes} {...listeners}

            />
            <span className='border-2 p-2 flex-1'>List Item {props.id}</span>
        </div>
    </div>
  );
}