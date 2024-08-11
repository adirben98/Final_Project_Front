import { Outlet } from 'react-router-dom';
import Header from './Header';

const HeaderLayout = () => {
  return (
    <div>
      <Header />
      <div style={{ paddingTop: "200px" }}> {/* Matches header height */}
        <Outlet />
      </div>
    </div>
  );
};

export default HeaderLayout;
