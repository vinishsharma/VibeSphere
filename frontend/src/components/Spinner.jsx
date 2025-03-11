import React from 'react';
import ClipLoader from 'react-spinners/ClipLoader';

const override = {
  display: 'block',
  margin: '30vh auto',
};

const Spinner = ({ loading }) => {
  return (
    <ClipLoader
      color='#16293d'
      loading={loading}
      size={150}
      cssOverride={override}
    />
  )
}

export default Spinner;