// @flow

import React from 'react';

// Test the basic usage of flowtype at stateless component
const Avatar = ({ src = null } : { src: ?string }) => {
  if (src) {
    return (
      <img className="avatar"
        src={`${src}?sz=48`}
        alt="avatar"
        style={{
          borderRadius: '50%',
        }} />
    );
  }

  return (
    <div style={{
      backgroundColor: 'aliceblue',
      height: '48px',
      width: '48px',
      borderRadius: '50%',
      textAlign: 'center',
    }}>
      <i className="fa fa-user-secret"
        aria-hidden="true"
        style={{
          lineHeight: '48px',
          fontSize: '24px',
        }} />
    </div>
  );
};

export default Avatar;
