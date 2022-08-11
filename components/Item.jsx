import { faGripVertical } from '@fortawesome/free-solid-svg-icons';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import React, {forwardRef} from 'react';

// eslint-disable-next-line react/display-name
export const Item = forwardRef(
  ({id, faded, style, attributes, listeners, ...props}, ref) => {
  return (
    <div {...props}
      ref={ref}
      style={style}
      className='bg-white border-cyan-200 flex items-center group'
    >
      <FontAwesomeIcon icon={faGripVertical}
          className='text-neutral-400 p-1 mr-2 duration-150
          hover:bg-slate-200
          focus:outline-none
          opacity-0 group-hover:opacity-100
          '
          {...attributes} {...listeners}
      />
      <span className={`border-2 p-2 flex-1 ${faded ? 'opacity-40' : 'opacity-100'}` }>
        List Item {id}
      </span>
    </div>
  )
});