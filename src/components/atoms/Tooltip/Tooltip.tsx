import 'react-tooltip/dist/react-tooltip.css';

import React from 'react';
import { Tooltip as ReactTooltip } from 'react-tooltip';

type Props = {
  tooltipId: string;
  content: string;
  offset?: number;
};

const Tooltip = ({ tooltipId, ...props }: Props) => {
  return (
    <ReactTooltip
      id={tooltipId}
      style={{
        backgroundColor: 'var(--tooltip)',
        height: 'auto',
        color: '#fff',
        padding: '4px 8px',
        borderRadius: '4px',
        fontSize: '12px',
        lineHeight: '12px',
      }}
      place='bottom'
      noArrow
      offset={3}
      {...props}
    />
  );
};

export default Tooltip;
