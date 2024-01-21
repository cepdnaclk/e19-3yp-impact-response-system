import { IoMdExit } from "react-icons/io";
import Btn from "../../Buttons/Btn";
import Title from "../../Title/Title";
import styles from "./PlayerProfile.module.scss";
import { FaRegUserCircle } from "react-icons/fa";
import { useLoginState } from "../../../states/profileState";
import { useSignupState } from "../../../states/formState";
import { useState } from "react";

const PlayerProfile = () => {
  // Get team-id
  // Get team-name
  // Get manager email
  const setIsLoggedIn = useSignupState((state) => state.setIsLoggedIn);
  const loginInfo = useLoginState((state) => state.loginInfo);
  const setLoginInfo = useLoginState((state) => state.setLoginInfo);

  const [addManagerOpen, setAddManagerOpen] = useState<boolean>(false);
  // TODO: Stay logged in for 90 days and so much more
  return (
    <main>
      <Title Icon={FaRegUserCircle} title="Player's Profile" />
      <div className={styles.loggedInStatus}>
        <div className={styles.info}>
          <h2>
            {loginInfo.teamName} <span>({loginInfo.teamId})</span>
          </h2>
          <span>manager email: {loginInfo.email}</span>
        </div>
        <div className={styles.controls}>
          <Btn
            buttonStyle="primary"
            Icon={IoMdExit}
            onClick={() => {
              setIsLoggedIn(false);
              setLoginInfo({
                teamId: "",
                teamName: "",
                email: "",
              });
            }}
          >
            Log Out
          </Btn>
        </div>
      </div>
      <div className={styles.gridLayout}></div>
    </main>
  );
};

export default PlayerProfile;
