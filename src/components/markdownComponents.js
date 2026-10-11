import React from 'react';

export const externalLinkComponents = {
  a: ({ node, children, ...props }) => (
    <a {...props} target="_blank" rel="noopener noreferrer">{children}</a>
  ),
};
