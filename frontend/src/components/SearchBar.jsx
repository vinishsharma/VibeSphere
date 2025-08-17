import React from 'react'
import { FaSearch, FaTimes } from 'react-icons/fa'

const SearchBar = ({ value, onChange, handleSearch, onClear, placeholder }) => {

  // Function to handle Enter key press
  const handleKeyPress = (event) => {
    if (event.key === "Enter") {
      handleSearch(); // Call search function
    }
  };

  return (
    <>
      <div className='w-100 flex items-center px-4 bg-white rounded-full shadow-sm'>
        <input
          type='text'
          value={value}
          onChange={onChange}
          onKeyDown={handleKeyPress}
          placeholder={placeholder}
          className='w-full text-lg py-2 outline-none bg-transparent'
        />
        {value && <FaTimes className='mr-2 cursor-pointer' onClick={onClear} />}
        <FaSearch className='cursor-pointer' onClick={handleSearch} />
      </div>
    </>
  )
}

export default SearchBar