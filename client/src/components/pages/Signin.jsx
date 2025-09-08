import { SignIn } from '@clerk/clerk-react';

const Signin = () => {
  return (
    <div style={{ display: 'flex', justifyContent: 'center', marginTop: '50px' }}>
      <SignIn />
    </div>
  );
};

export default Signin;