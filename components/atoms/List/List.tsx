import React from 'react';
import { ListProps } from './List.types';
import { twMerge } from 'tailwind-merge';
import { list } from './List.styles';

/** Simple list component */
const List = ({ items, ordered = false, size = 'md', className, listItemClassName }: ListProps) => {
  const Component = ordered ? 'ol' : 'ul';

  return (
    <Component className={twMerge(list({ ordered, size }), className)}>
      {items.map(({ id, content }) => (
        <li key={id} className={listItemClassName}>
          {content}
        </li>
      ))}
    </Component>
  );
};

export default List;
