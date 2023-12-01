import React, { useState } from "react";
import styles from "./SignUp.module.scss";
import Hero from "./Hero";
import ToggleRole from "./ToggleRole";
const SignUp = () => {
  type role = "player" | "manager";

  interface formData {
    role: role;
    teamId: string;
    email: string;
  }
  // const [role, setRole] = useState<role>("manager");
  const [formData, setFormData] = useState<formData>({
    role: "manager",
    teamId: "",
    email: "",
  });

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { id, value } = e.target;
    setFormData((prevData) => ({
      ...prevData,
      [id]: value,
    }));
  };

  const handleSubmit = (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    console.log(formData); // Log the form data object
  };

  //TODO: Disable Next button if the two inputs are empty
  const toggleRole = () => {
    // setRole((prevRole) => (prevRole === "player" ? "manager" : "player"));
    setFormData((prevData) => ({
      ...prevData,
      role: prevData.role === "player" ? "manager" : "player",
    }));
  };
  return (
    <main className={styles.main}>
      <div className={styles.content}>
        <h2 className={styles.heading}>
          Welcome to
          <img src="../../src/assets/logos/Logo-Impax.svg" alt="IMPAX" />
        </h2>
        <div className={styles.selectorContainer}>
          <h4>Select Your Role</h4>

          <ToggleRole role={formData.role} toggleRole={toggleRole} />
        </div>
        <form onSubmit={handleSubmit}>
          <div className={styles.inputContainer}>
            <label htmlFor="teamId">Team ID</label>
            <input
              type="text"
              id="teamId"
              required
              placeholder="peradeniya-baseball"
              value={formData.teamId}
              onChange={handleInputChange}
            />
          </div>
          <div className={styles.inputContainer}>
            <label htmlFor="email">Email</label>
            <input
              type="email"
              id="email"
              required
              placeholder="johndoe@email.com"
              value={formData.email}
              onChange={handleInputChange}
            />
          </div>

          <button type="submit" className={styles.nextBtn}>
            Next
          </button>
        </form>
        <p className={styles.loginText}>
          Already have an account? <span>Log In</span>
        </p>
      </div>
      <Hero />
    </main>
  );
};

export default SignUp;
