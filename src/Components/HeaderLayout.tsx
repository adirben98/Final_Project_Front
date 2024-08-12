import { Outlet } from 'react-router-dom';
import Header from './Header';

const HeaderLayout = () => {
  return (
    <div>
      <div style={{
        width: '100%',
        height: '150px',
      }}>
        <Header />
      </div>
      <div style={{ marginTop: "0px", padding: "20px" }}>
        <Outlet />
      </div>
    </div>
  );
};

export default HeaderLayout;
