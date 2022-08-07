import React, {forwardRef} from 'react';

// eslint-disable-next-line react/display-name
export const Item = forwardRef(({id, ...props}, ref) => {
  return (
    <div {...props} ref={ref} className='bg-slate-300 pl-8'>
      List item {id}
    </div>
  )
});