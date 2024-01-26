import styles from "./SignUp.module.scss";
import { FieldValues, useForm } from "react-hook-form";
import { useLoginState } from "../../states/profileState";
import { useSignupState } from "../../states/formState";
import { useNavigate } from "react-router-dom";
import { BASE_URL } from "../../config/config";
import { showPopup } from "../../utils/errorPopup.ts";

const LoginPlayer = () => {
  const setIsSignup = useSignupState((state) => state.setIsSignup);
  const setIsLoggedInPlayer = useSignupState(
    (state) => state.setIsLoggedInPlayer
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

  const onSubmit = async (data: FieldValues) => {
    const { email, password } = data;
    const response = await fetch(`${BASE_URL}/login/player`, {
      method: "POST",
      body: JSON.stringify({
        userName: email,
        password: password,
      }),
      headers: {
        "Content-Type": "application/json",
      },
    });
    const responseData = await response.json();
    if (response.ok) {
      setIsLoggedInPlayer(true);
      localStorage.setItem("refreshToken", responseData.refreshToken);
      localStorage.setItem("accessToken", responseData.accessToken);

      setTokens({
        accessToken: responseData.accessToken,
        refreshToken: responseData.refreshToken,
      });
      setLoginInfo({ teamId: "", teamName: "", email });

      navigate("/login/player");
    } else {
      await showPopup("Invalid Credentials", "Please Try Again");
    }

    reset();
  };

  return (
    <>
      <form onSubmit={handleSubmit(onSubmit)}>
        <div className={styles.inputContainer}>
          <label htmlFor="email">Email</label>
          {errors.email && <p>{`${errors.email?.message}`}</p>}
          <input
            {...register("email", { required: true })}
            type="email"
            id="email"
            required
            placeholder="johndoe@email.com"
          />
        </div>
        <div className={styles.inputContainer}>
          <label htmlFor="password">Password</label>
          {errors.password && <p>{`${errors.password?.message}`}</p>}
          <input
            {...register("password", { required: true })}
            type="password"
            id="password"
            required
            placeholder="Enter password"
          />
        </div>

        <button
          type="submit"
          className={styles.nextBtn}
          disabled={isSubmitting}
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

export default LoginPlayer;
