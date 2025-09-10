import React from 'react';
import styled from 'styled-components';

const Loader = () => {
  return (
    <StyledWrapper>
      {/* Your SVG loader */}
      <svg aria-label="loader" role="img" height="56px" width="56px" viewBox="0 0 56 56" className="loader">
        {/* ... keep your full SVG code from above ... */}
      </svg>
    </StyledWrapper>
  );
};

const StyledWrapper = styled.div`
  display: flex;
  align-items: center;
  justify-content: center;
  height: 100vh; /* Full screen */
  background: #fff; /* White background (change if needed) */

  .loader {
    --dur: 2s;
    width: 80px;
    height: 80px;
  }

  /* Keep all your animation CSS from your code here */
`;

export default Loader;
