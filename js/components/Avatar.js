import React, { PropTypes } from 'react';

const Avatar = ({ src }) => {
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

Avatar.defaultProps = {
  src: null,
};

Avatar.propTypes = {
  src: PropTypes.string,
};

export default Avatar;
