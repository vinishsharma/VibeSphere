// import React, { useState, useEffect } from 'react'
// import SearchBar from '../components/SearchBar'
// import axios from 'axios';
// import { FaSearch, FaUser } from 'react-icons/fa';
// import UserBar from '../components/UserBar.jsx';

// const SearchUser = () => {
//   const [searchQuery, setSearchQuery] = useState("");
//   const [users, setUsers] = useState([]);
//   const [filteredUsers, setFilteredUsers] = useState([]);

//   useEffect(() => {
//     const fetchUsers = async () => {
//       try {
//         const response = await axios.get("/api/user/get-all-except-me"); // Fetch all users
//         setUsers(response.data.users);
//       } catch (error) {
//         console.error("Error fetching users:", error);
//       }
//     };

//     fetchUsers();
//   }, []);

//   const handleSearch = () => {
//     const filtered = users.filter(user =>
//       user.username.toLowerCase().includes(searchQuery.toLowerCase()) || user.name.toLowerCase().includes(searchQuery.toLowerCase())
//       //filter through username or name
//     );
//     setFilteredUsers(filtered);
//   };

//   const clearSearch = () => {
//     setFilteredUsers([]);
//     setSearchQuery("");
//   }

//   return (
//     <>
//       <div className='py-10 mx-auto w-full sm:w-[90%] md:w-[80%] lg:w-[70%]'>
//         <div className='flex justify-center'>
//           <SearchBar
//             placeholder={"Search Users..."}
//             value={searchQuery}
//             onChange={({ target }) => {
//               setSearchQuery(target.value);
//             }}
//             onClear={clearSearch}
//             handleSearch={handleSearch}
//           />
//         </div>
//         <div className="mt-8">
//           {filteredUsers.length > 0 ? (
//             filteredUsers.map(curUser => (
//               <UserBar key={curUser._id} targetUser={curUser} />
//             ))
//           ) : (
//             <div className="flex flex-col items-center justify-center min-h-[50vh] text-gray-400">
//               <FaUser size={100} className="mb-6 text-gray-200" />
//               <p className="text-center text-lg font-semibold flex items-center gap-2">
//                 <FaSearch />
//                 Search users by <span className="text-blue-600">Username</span> or <span className="text-blue-600">Name</span>...
//               </p>
//             </div>
//           )}
//         </div>
//       </div>
//     </>
//   )
// }

// export default SearchUser



import React, { useState, useEffect } from 'react'
import SearchBar from '../components/SearchBar'
import axios from 'axios';
import { FaSearch, FaUser, FaUserAltSlash } from 'react-icons/fa';
import UserBar from '../components/UserBar.jsx';

const SearchUser = () => {
  const [searchQuery, setSearchQuery] = useState("");
  const [users, setUsers] = useState([]);
  const [filteredUsers, setFilteredUsers] = useState([]);
  const [isSearchExecuted, setIsSearchExecuted] = useState(false);

  useEffect(() => {
    const fetchUsers = async () => {
      try {
        const response = await axios.get("/api/user/get-all-except-me");
        setUsers(response.data.users);
      } catch (error) {
        console.error("Error fetching users:", error);
      }
    };

    fetchUsers();
  }, []);

  const handleSearch = () => {
    // If empty string, reset to "typing phase"
    if (searchQuery.trim() === "") {
      setIsSearchExecuted(false);
      setFilteredUsers([]);
      return;
    }

    setIsSearchExecuted(true);

    const filtered = users.filter(user =>
      user.username.toLowerCase().includes(searchQuery.toLowerCase()) ||
      user.name.toLowerCase().includes(searchQuery.toLowerCase())
    );
    setFilteredUsers(filtered);
  };

  const clearSearch = () => {
    setFilteredUsers([]);
    setSearchQuery("");
    setIsSearchExecuted(false);
  };

  return (
    <div className='py-10 mx-auto w-full sm:w-[90%] md:w-[80%] lg:w-[70%]'>
      <div className='flex justify-center'>
        <SearchBar
          placeholder={"Search Users..."}
          value={searchQuery}
          onChange={({ target }) => setSearchQuery(target.value)}
          onClear={clearSearch}
          handleSearch={handleSearch}
        />
      </div>

      <div className="mt-8">
        {isSearchExecuted ? (
          filteredUsers.length > 0 ? (
            filteredUsers.map(curUser => (
              <UserBar key={curUser._id} targetUser={curUser} />
            ))
          ) : (
            <div className="flex flex-col items-center justify-center min-h-[50vh] text-gray-400">
              <FaUserAltSlash size={100} className="mb-6 text-gray-200" />
              <p className="text-center text-lg font-semibold">No User Exist</p>
            </div>
          )
        ) : (
          <div className="flex flex-col items-center justify-center min-h-[50vh] text-gray-400">
            <FaUser size={100} className="mb-6 text-gray-200" />
            <p className="text-center text-lg font-semibold flex items-center gap-2">
              <FaSearch />
              Search users by <span className="text-blue-600">Username</span> or{" "}
              <span className="text-blue-600">Name</span>...
            </p>
          </div>
        )}
      </div>
    </div>
  )
}

export default SearchUser;