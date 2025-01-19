import React from 'react';
import { useNavigate } from 'react-router-dom';
import HomeStyle from './Home.module.css'
import Navbar from './Navbar/Navbar';
import GetFolder from './Get Folders/GetFolder';

const Home = ({user}) => {
  const {email, name} = user

  const navigate = useNavigate();
  console.log(navigate)

  const handleNavigate = () => {
      navigate("/cf");  // Navigate to home if not already there
  };


  return (
    <>
      <Navbar />
      <div className={ HomeStyle.main }>
        <p>Here, you can save and share the links and images to friends</p>
        <div onClick={ handleNavigate }>
          Create Folder +
        </div>
      </div>
      <GetFolder />
    </>
  );
};

export default Home;