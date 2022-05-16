import React from 'react';
import { Checkbox } from '@mui/material';

const IndeterminateCheckbox = React.forwardRef<HTMLInputElement, any>((props, ref) => {
  // eslint-disable-next-line react/prop-types
  const { indeterminate, ...rest } = props;
  const defaultRef = React.useRef();
  const resolvedRef = ref || defaultRef;

  React.useEffect(() => {
    if (typeof resolvedRef === 'object' && resolvedRef.current) {
      resolvedRef.current.indeterminate = indeterminate;
    }
  }, [resolvedRef, indeterminate]);

  return (
    <>
      <Checkbox ref={resolvedRef} {...rest} />
    </>
  );
});
IndeterminateCheckbox.displayName = 'IndeterminateCheckboxDisplayName';

export { IndeterminateCheckbox };
