import { useState } from "react";
import { Link } from "react-router-dom";
import axios from "axios";

const Login = () => {
  const [formData, setFormData] = useState({
    email: "",
    password: "",
  });

  const { email, password } = formData;

  const onChange = (e) =>
    setFormData({ ...formData, [e.target.name]: e.target.value });

  const handleSubmit = async (e) => {
    e.preventDefault();
    const userData = {
      email,
      password,
    };

    try {
      const config = {
        headers: {
          "Content-Type": "application/json",
        },
      };

      const body = JSON.stringify(userData);

      const res = await axios.post("/api/users/signin", body, config);
      console.log(res.data);
      setFormData({ email: "", password: "" });
    } catch (error) {
      console.log(error.response.data);
    }
  };

  return (
    <div className="container">
      <h1 className="large text-primary">Sign In</h1>
      <p className="lead">
        <i className="fas fa-user" /> Create Your Account
      </p>
      <form className="form" onSubmit={handleSubmit}>
        <div className="form-group">
          <input
            type="email"
            placeholder="Email Address"
            required
            onChange={(e) => onChange(e)}
            name="email"
            value={email}
          />
        </div>
        <div className="form-group">
          <input
            type="password"
            placeholder="Password"
            name="password"
            required
            onChange={(e) => onChange(e)}
            value={password}
            minLength={6}
          />
        </div>
        <input
          type="submit"
          className="btn btn-primary"
          defaultValue="Register"
        />
      </form>
      <p className="my-1">
        Don't have an account? <Link to="/register">Sign UP</Link>
      </p>
    </div>
  );
};

export default Login;
