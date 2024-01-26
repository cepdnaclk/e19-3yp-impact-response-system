import styles from "./SignUp.module.scss";
import { useSignupState } from "../../states/formState";
import { useForm, type FieldValues } from "react-hook-form";
import { useNavigate } from "react-router-dom";
import { BASE_URL } from "../../config/config";

const SignupManager = () => {
  const setIsSignup = useSignupState((state) => state.setIsSignup);
  const setSignupInfo = useSignupState((state) => state.setSignupInfo);
  const navigate = useNavigate();
  const {
    register,
    handleSubmit,
    formState: { errors, isSubmitting },
    reset,
    setError,
  } = useForm();
  const onSubmit = async (data: FieldValues) => {
    const { teamId, email } = data;
    setSignupInfo({ teamId, email });

    const url = new URL(`${BASE_URL}/team/exists`); // Create a URL object for flexible query param handling
    url.searchParams.set("teamId", teamId); // Add teamId as a query parameter
    url.searchParams.set("email", email);
    const response = await fetch(url.toString(), {
      // Use the constructed URL with query params
      method: "GET", // Change the method to GET
      headers: {
        "Content-Type": "application/json", // Keep the Content-Type header for consistency
      },
    });
    const responseData = await response.json();
    console.log(responseData);
    if (!responseData.teamExists) {
      // setIsTeamExists(false);
      navigate("/signup/manager");
      reset();
    } else if (responseData.teamExists && responseData.managerExists) {
      navigate("/signup/manager/teamexists");
      reset();

      // setIsTeamExists(true);
      // setIsManagerExists(true);
    } else if (
      responseData.teamExists &&
      !responseData.managerExists &&
      !responseData.managerVerified
    ) {
      setError("teamId", {
        type: "manual",
        message: "You are not approved to join this team!",
      });
      console.log(errors.teamId);
    } else if (
      responseData.teamExists &&
      !responseData.managerExists &&
      responseData.managerVerified
    ) {
      navigate("/signup/manager/jointeam");
      reset();
    }

    // console.log(signupInfo);
    // const responseData = await response.json();
    // await new Promise((resolve) => setTimeout(resolve, 5000));
    // console.log(data);

    // reset();
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

        <button
          disabled={isSubmitting}
          type="submit"
          className={styles.nextBtn}
        >
          Next
        </button>
      </form>
      <p className={styles.loginText}>
        Already have an account?{" "}
        <span
          tabIndex={0}
          onClick={() => {
            setIsSignup(false);
          }}
        >
          Login
        </span>
      </p>
    </>
  );
};

export default SignupManager;
