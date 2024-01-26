import { IoMdExit } from "react-icons/io";
import Btn from "../../Buttons/Btn";
import Title from "../../Title/Title";
import styles from "./ManagerProfile.module.scss";
import { FaRegUserCircle } from "react-icons/fa";
import { useLoginState } from "../../../states/profileState";
import { useSignupState } from "../../../states/formState";
import ManagersTable from "./../ManagerProfile/ManagersTable";
import DialogModal from "../../Modal/DialogModal";
import { FaPlus } from "react-icons/fa6";
import { useState } from "react";
import { useNavigate } from "react-router-dom";

const ManagerProfile = () => {
  // Get team-id
  // Get team-name
  // Get manager email
  const setIsLoggedInManager = useSignupState(
    (state) => state.setIsLoggedInManager
  );
  const loginInfo = useLoginState((state) => state.loginInfo);
  const setLoginInfo = useLoginState((state) => state.setLoginInfo);

  const navigate = useNavigate();
  const [addManagerOpen, setAddManagerOpen] = useState<boolean>(false);
  // TODO: Stay logged in for 90 days and so much more
  return (
    <main>
      <Title Icon={FaRegUserCircle} title="Manager's Profile" />
      <div className={styles.loggedInStatus}>
        <div className={styles.info}>
          <h2>
            {loginInfo.teamName} <span>({loginInfo.teamId})</span>
          </h2>
          <span>manager email: {loginInfo.email}</span>
        </div>
        <div className={styles.controls}>
          <Btn
            buttonStyle="secondary"
            Icon={IoMdExit}
            onClick={() => {
              setIsLoggedInManager(false);
              setLoginInfo({
                teamId: "",
                teamName: "",
                email: "",
              });
              navigate("/SignUp");
            }}
          >
            Log Out
          </Btn>
        </div>
      </div>
      <div className={styles.gridLayout}>
        <div className={styles.managersContainer}>
          <div className={styles.info}>
            <h2>Add/Remove Managers</h2>
            <DialogModal
              open={addManagerOpen}
              setOpen={setAddManagerOpen}
              trigger={
                <Btn buttonStyle="primary" Icon={FaPlus} iconSizeEm={0.8}>
                  Add New Manager
                </Btn>
              }
              title="Add New Manager"
              description="Add a new manager to your team, once added manager can create their account under your team id"
            >
              <form
                className={styles.addManagerForm}
                onSubmit={(e) => {
                  e.preventDefault();
                  setAddManagerOpen(false);
                }}
              >
                {/* <label htmlFor="manager_name">Manager Name</label>
                <input
                  type="text"
                  name="manager_name"
                  id="manager_name"
                  placeholder="Johnathan Doe"
                /> */}

                <label htmlFor="email">
                  Manager's Email
                  {/* <span className={styles.additionalInfo}>
                    Link Impax Account
                  </span> */}
                </label>
                <input
                  type="email"
                  name="email"
                  id="email"
                  placeholder="johndoe@gmail.com"
                />
                <Btn type="submit" Icon={FaPlus}>
                  Invite Manager
                </Btn>
              </form>
            </DialogModal>
          </div>
          <div className={styles.managersTableContainer}>
            <ManagersTable />
          </div>
        </div>
      </div>
    </main>
  );
};

export default ManagerProfile;
