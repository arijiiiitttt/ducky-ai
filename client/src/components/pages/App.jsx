import React from 'react';
import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import Homepage from '../code/Homepage';
import Signin from './Signin';
import Signup from './Signup';
import ProtectedRoute from './ProtecterRoute';
import { SignedIn, SignedOut } from '@clerk/clerk-react';
import CandidateForm from '../code/CandidateForm';
import NotFound from '../code/NotFound';


const App = () => {
  return (
    <Router>
      <Routes>
        {/* Redirect root route based on Clerk auth */}
        <Route path="/" element={<Homepage/>} />
        <Route path="/about" element={<NotFound/>} />

        <Route
          path="/"
          element={
            <>
              <SignedIn>
                <Navigate to="/content" />
              </SignedIn>
              <SignedOut>
                <Navigate to="/signup" />
              </SignedOut>
            </>
          }
        />
        <Route path="/signup" element={<Signup />} />
        <Route path="/login" element={<Signin />} />
        <Route
          path="/content"
          element={
            <ProtectedRoute>
          <CandidateForm/>
            </ProtectedRoute>
          }
        />
      </Routes>
    </Router>
  );
};

export default App;