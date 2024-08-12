import { Outlet } from 'react-router-dom';
import Header from './Header';

const HeaderLayout = () => {
  return (
    <div>
     <Header/>
      <div style={{  marginTop:'110px'}}>
          <Outlet />
      </div>
    </div>
  );
};

export default HeaderLayout;