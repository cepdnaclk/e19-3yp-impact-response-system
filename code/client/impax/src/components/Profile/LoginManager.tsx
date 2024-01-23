import styles from "./SignUp.module.scss";
import { useSignupState } from "../../states/formState";
import { FieldValues, useForm } from "react-hook-form";
import { useNavigate } from "react-router-dom";
import { useLoginState } from "../../states/profileState";

const LoginManager = () => {
  const setIsSignup = useSignupState((state) => state.setIsSignup);
  const setIsLoggedInManager = useSignupState(
    (state) => state.setIsLoggedInManager
  );
  const setLoginInfo = useLoginState((state) => state.setLoginInfo);
  const setTokens = useLoginState((state) => state.setTokens);
  const navigate = useNavigate();
  const {
    register,
    handleSubmit,
    formState: { errors, isSubmitting },
    reset,
  } = useForm();
  const getTeamInfo = async (teamId: string, token: string) => {
    try {
      const response = await fetch(`http://13.235.86.11:5000/team/${teamId}`, {
        // Use the constructed URL with query params
        method: "GET", // Change the method to GET
        headers: {
          Authorization: `Bearer ${token}`, // Keep the Content-Type header for consistency
          "Content-type": "application/json",
        },
      });
      const responseData = await response.json();
      return responseData.teamName;
    } catch (error) {
      console.log(error);
    }
  };

  const onSubmit = async (data: FieldValues) => {
    const { teamId, email, password } = data;
    const response = await fetch("http://13.235.86.11:5000/login/manager", {
      method: "POST",
      body: JSON.stringify({
        teamId: teamId,
        password: password,
        userName: email,
      }),
      headers: {
        "Content-Type": "application/json",
      },
    });
    const responseData = await response.json();
    if (response.ok) {
      setIsLoggedInManager(true);
      localStorage.setItem("refreshToken", responseData.refreshToken);
      localStorage.setItem("accessToken", responseData.accessToken);
      setTokens({
        accessToken: responseData.accessToken,
        refreshToken: responseData.refreshToken,
      });
      const teamName = await getTeamInfo(teamId, responseData.accessToken);

      setLoginInfo({ teamId, teamName: teamName, email });

      // FETCH PLAYERS array and store it in local storage
      // try {
      //   const playersResponse = await fetch(
      //     "'https://api.example.com/players'"
      //   );
      //   const playersData = await playersResponse.json();
      //   const timestamp = new Date().getTime();
      //   const playersWithTimestamp = {
      //     timestamp,
      //     playersData,
      //   };
      //   localStorage.setItem("players", JSON.stringify(playersWithTimestamp));
      // } catch (error) {
      //   console.log(error);
      // }

      navigate("/login/manager");
    }

    reset();
  };

  return (
    <>
      <form onSubmit={handleSubmit(onSubmit)}>
        <div className={styles.inputContainer}>
          <label htmlFor="teamId">Team ID</label>
          {errors.teamId && <p>{`${errors.teamId.message}`}</p>}
          <input
            {...register("teamId", { required: "Team ID is required" })}
            type="text"
            id="teamId"
            placeholder="peradeniya-baseball"
          />
        </div>
        <div className={styles.inputContainer}>
          <label htmlFor="email">Email</label>
          {errors.email && <p>{`${errors.email.message}`}</p>}
          <input
            {...register("email", { required: "Email is required" })}
            type="email"
            id="email"
            placeholder="johndoe@email.com"
          />
        </div>
        <div className={styles.inputContainer}>
          <label htmlFor="password">Password</label>
          {errors.password && <p>{`${errors.password.message}`}</p>}
          <input
            {...register("password", { required: "Password is required" })}
            type="password"
            id="password"
            placeholder="Enter password"
          />
        </div>

        <button
          disabled={isSubmitting}
          type="submit"
          className={styles.nextBtn}
        >
          Login
        </button>
      </form>
      <p className={styles.loginText}>
        Don't have an account?{" "}
        <span
          tabIndex={0}
          onClick={() => {
            setIsSignup(true);
          }}
        >
          Signup
        </span>
      </p>
    </>
  );
};

export default LoginManager;
