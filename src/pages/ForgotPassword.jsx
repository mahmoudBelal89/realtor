import { getAuth, sendPasswordResetEmail } from "firebase/auth";
import { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { toast } from "react-toastify";
import OAuth from "../components/OAuth";

export default function ForgotPassword() {
  const navigate = useNavigate();
  const [email, setEmail] = useState("");
  function onChange(e) {
    setEmail(e.target.value);
  }
  async function onSubmit(e) {
    e.preventDefault();
    try {
      const auth = getAuth();
      await sendPasswordResetEmail(auth, email);
      navigate("/sign-in");
      toast.success("Email was sent!");
    } catch (error) {
      toast.error(error.toString());
    }
  }
  return (
    <section>
      <h1 className="text-3xl text-center mt-6 font-bold">Forgot Password</h1>
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
              type="email"
              id="email"
              value={email}
              onChange={onChange}
              placeholder="Email Address"
            />
            <div className="flex mb-6 justify-between whitespace-nowrap text-sm sm:text-lg">
              <p>
                Don't have an account?
                <Link
                  to={"/sign-up"}
                  className="text-rose-600 hover:text-rose-800 transition duration-200 ease-in-out ml-1"
                >
                  Register
                </Link>
              </p>
              <p>
                <Link
                  to={"/sign-in"}
                  className="text-blue-600 hover:text-blue-800 transition duration-200 ease-in-out"
                >
                  Sign in instead
                </Link>
              </p>
            </div>
            <button
              className="w-full px-7 py-3 text-sm font-semibold text-white uppercase bg-blue-600 rounded shadow-md hover:shadow-lg active:shadow-lg hover:bg-blue-700 active:bg-blue-800 transition duration-150 ease-in-out"
              type="submit"
            >
              Send reset password
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
