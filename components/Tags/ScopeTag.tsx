import Tag from 'antd/es/tag';
import type { CustomTagProps } from 'rc-select/es/BaseSelect';
import type { MouseEvent } from 'react';

export default function ScopeTag({
  label,
  closable = false,
  onClose,
}: Partial<Pick<CustomTagProps, 'label' | 'closable' | 'onClose'>>) {
  const onPreventMouseDown = (event: MouseEvent<HTMLSpanElement>) => {
    event.preventDefault();
    event.stopPropagation();
  };

  return (
    <Tag color="orange" onMouseDown={onPreventMouseDown} closable={closable} onClose={onClose}>
      {label}
    </Tag>
  );
}
