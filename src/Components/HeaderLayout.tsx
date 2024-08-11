import { Outlet } from 'react-router-dom';
import Header from './Header';

const HeaderLayout = () => {
  return (
    <div>
      <Header />
      <div style={{ marginTop: "100px" }}>
          <Outlet />
      </div>
    </div>
  );
};

export default HeaderLayout;
