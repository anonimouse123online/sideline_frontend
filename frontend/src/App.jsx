import React from 'react';
import { Routes, Route } from 'react-router-dom';
import Navbar from './components/Navbar'; // Make sure Navbar is imported
import Explore from './pages/Explore';
import FindWork from './pages/FindWork';
import About from './pages/About';
import Login from './pages/Login';
import Signup from './pages/Signup';
import ProfilePage from './pages/Profile';
import PostJob from './pages/PostJob';
import JobDetails from "./pages/JobDetails";
import YouApplied from "./pages/YouApplied";
import Loading from './function/loading';
import useLoading from './hooks/useLoading';

const App = () => {
  const { isLoading } = useLoading(1500);

  if (isLoading) {
    return <Loading />;
  }

  return (
    <>
      <Navbar /> {/* Navbar is now inside Router */}
      <Routes>
        <Route path="/" element={<Explore />} />
        <Route path="/explore" element={<Explore />} />
        <Route path="/find-work" element={<FindWork />} />
        <Route path="/about" element={<About />} />
        <Route path="/login" element={<Login />} />
        <Route path="/signup" element={<Signup />} />
        <Route path="/profile" element={<ProfilePage />} />
        <Route path="/post-job" element={<PostJob />} />
        <Route path="/job/:id" element={<JobDetails />} />
        <Route path="/you-applied" element={<YouApplied />} />
      </Routes>
    </>
  );
};

export default App;