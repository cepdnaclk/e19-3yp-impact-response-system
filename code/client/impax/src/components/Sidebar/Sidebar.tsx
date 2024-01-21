import styles from "./Sidebar.module.scss";
import { BsBroadcast } from "react-icons/bs";
import { FaRegUserCircle, FaUsers } from "react-icons/fa";
import { MdDeviceHub, MdBarChart } from "react-icons/md";
import MenuItem from "./MenuItem";
import { useAppState } from "../../states/appState";
import { useSignupState } from "../../states/formState";

import { useNavigate } from "react-router-dom";

const Sidebar: React.FC = () => {
  const activePage = useAppState((state) => state.activePage);
  const setActivePage = useAppState((state) => state.setActivePage);
  const navigate = useNavigate();
  let isLoggedIn = useSignupState((state) => state.isLoggedIn);
  isLoggedIn = true;

  return (
    <aside className={styles.sideBar}>
      {isLoggedIn ? (
        <nav className={styles.menu}>
          <MenuItem
            icon={BsBroadcast}
            name="Live"
            active={activePage === "live"}
            onClick={() => {
              setActivePage("live");
              navigate("/live");
            }}
          />
          <MenuItem
            icon={MdDeviceHub}
            name="Buddy Connectivity"
            active={activePage === "devices"}
            onClick={() => {
              setActivePage("devices");
              navigate("/devices");
            }}
          />
          <MenuItem
            icon={MdBarChart}
            name="Team Analytics"
            active={activePage === "team-analytics"}
            onClick={() => {
              setActivePage("team-analytics");
              navigate("/team-analytics");
            }}
          />
          <MenuItem
            icon={MdBarChart}
            name="Player Analytics"
            active={activePage === "player-analytics"}
            onClick={() => {
              setActivePage("player-analytics");
              navigate("/player-analytics");
            }}
          />
          <MenuItem
            icon={FaUsers}
            name="Player Management"
            active={activePage === "player-management"}
            onClick={() => {
              setActivePage("player-management");
              navigate("/player-management");
            }}
          />
        </nav>
      ) : (
        <div></div>
      )}

      <MenuItem
        icon={FaRegUserCircle}
        name="Profile"
        active={activePage === "profile"}
        onClick={() => {
          setActivePage("profile");
          navigate("/manager-profile");
        }}
      />
    </aside>
  );
};

export default Sidebar;
