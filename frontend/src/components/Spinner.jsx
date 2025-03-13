import React from 'react';
import ClipLoader from 'react-spinners/ClipLoader';

const override1 = {
  display: 'block',
  margin: '30vh auto',
};

const override2 = {
  display: 'block',
  margin: '20px auto',
}

const Spinner = ({ loading }) => {
  return (
    <ClipLoader
      color='#16293d'
      loading={loading}
      size={150}
      cssOverride={override1}
    />
  )
}

const Loader = ({ loading }) => {
  return (
    <ClipLoader
      color='#16293d'
      loading={loading}
      size={80}
      cssOverride={override2}
    />
  )
}

export { Spinner, Loader };