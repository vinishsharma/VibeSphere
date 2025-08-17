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

const SkeletonCard = () => (
  <div className="flex-none w-[90vw] sm:w-[50vw] md:w-[40vw] lg:w-[30vw] p-4">
    {/* The card itself has the shimmering aurora gradient */}
    <div className="relative overflow-hidden rounded-2xl w-full h-[700px] p-5 bg-gradient-to-r from-pink-200 via-purple-200 to-blue-200 animate-gradient-x">
      {/* Inner elements are semi-transparent white to show the gradient through */}
      <div className="flex items-center mb-4">
        <div className="w-12 h-12 bg-white/70 rounded-full mr-3"></div>
        <div className="w-1/3 h-5 bg-white/70 rounded-lg"></div>
      </div>
      <div className="w-full h-96 bg-white/70 rounded-xl mb-4"></div>
      <div className="w-3/4 h-5 bg-white/70 rounded-lg mb-2"></div>
      <div className="w-1/2 h-5 bg-white/70 rounded-lg"></div>
    </div>
  </div>
);

export { Spinner, Loader, SkeletonCard };