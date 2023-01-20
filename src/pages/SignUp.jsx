import { useState } from "react";
import { AiFillEye, AiFillEyeInvisible } from "react-icons/ai";
import { Link, useNavigate } from "react-router-dom";
import OAuth from "../components/OAuth";
import {
  getAuth,
  createUserWithEmailAndPassword,
  updateProfile,
} from "firebase/auth";
import { db } from "../firebase";
import { doc, serverTimestamp, setDoc } from "firebase/firestore";
import { toast } from "react-toastify";

export default function SignUp() {
  const [formData, setFormData] = useState({
    name: "",
    email: "",
    password: "",
  });
  const [showPassword, setShowPassword] = useState(false);
  const { name, email, password } = formData;
  const navigate = useNavigate();
  function onChange(e) {
    setFormData((previousState) => ({
      ...previousState,
      [e.target.id]: e.target.value,
    }));
  }
  async function onSubmit(e) {
    e.preventDefault();
    try {
      const auth = getAuth();

      const userCredential = await createUserWithEmailAndPassword(
        auth,
        email,
        password
      );
      const user = userCredential.user;
      updateProfile(user, { displayName: name });

      const formDataDatabase = { ...formData };
      delete formDataDatabase.password;
      formDataDatabase.timestamp = serverTimestamp();
      await setDoc(doc(db, "users", user.uid), formDataDatabase);
      navigate("/");
      toast.success("Sign up complete!");
    } catch (error) {
      toast.error(error.toString());
    }
  }
  return (
    <section>
      <h1 className="text-3xl text-center mt-6 font-bold">Sign Up</h1>
      <div className="flex justify-center flex-wrap px-6 py-12 max-w-6xl mx-auto items-center">
        <div className="md:w-[67%] lg:w-[50%] mb-12 md:mb-6">
          <img
            className="w-full rounded-2xl"
            src="https://images.unsplash.com/flagged/photo-1564767609342-620cb19b2357?ixlib=rb-4.0.3&ixid=MnwxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8&auto=format&fit=crop&w=773&q=80"
            alt="key"
          />
        </div>
        <div className="w-full md:w-[67%] lg:w-[40%] lg:ml-20">
          <form onSubmit={onSubmit}>
            <input
              className="w-full mb-6 px-4 py-2 text-xl text-gray-700 bg-white border-gray-300 rounded transition ease-in-out"
              type="text"
              id="name"
              value={name}
              onChange={onChange}
              placeholder="Full Name"
            />
            <input
              className="w-full mb-6 px-4 py-2 text-xl text-gray-700 bg-white border-gray-300 rounded transition ease-in-out"
              type="email"
              id="email"
              value={email}
              onChange={onChange}
              placeholder="Email Address"
            />
            <div className="relative mb-6">
              <input
                className="w-full px-4 py-2 text-xl text-gray-700 bg-white border-gray-300 rounded transition ease-in-out"
                type={showPassword ? "text" : "password"}
                id="password"
                value={password}
                onChange={onChange}
                placeholder="Password"
              />
              {showPassword ? (
                <AiFillEyeInvisible
                  className="absolute right-3 top-3 text-xl cursor-pointer"
                  onClick={() => setShowPassword(false)}
                />
              ) : (
                <AiFillEye
                  className="absolute right-3 top-3 text-xl cursor-pointer"
                  onClick={() => setShowPassword(true)}
                />
              )}
            </div>
            <div className="flex mb-6 justify-between whitespace-nowrap text-sm sm:text-lg">
              <p>
                Have an account?
                <Link
                  to={"/sign-in"}
                  className="text-rose-600 hover:text-rose-800 transition duration-200 ease-in-out ml-1"
                >
                  Sign in
                </Link>
              </p>
              <p>
                <Link
                  to={"/forgot-password"}
                  className="text-blue-600 hover:text-blue-800 transition duration-200 ease-in-out"
                >
                  Forgot password?
                </Link>
              </p>
            </div>
            <button
              className="w-full px-7 py-3 text-sm font-semibold text-white uppercase bg-blue-600 rounded shadow-md hover:shadow-lg active:shadow-lg hover:bg-blue-700 active:bg-blue-800 transition duration-150 ease-in-out"
              type="submit"
            >
              Sign up
            </button>
            <div className="flex my-4 items-center">
              <div className="flex-1 border-t border-gray-300" />
              <p className="mx-4 font-semibold">OR</p>
              <div className="flex-1 border-t border-gray-300" />
            </div>
            <OAuth />
          </form>
        </div>
      </div>
    </section>
  );
}
