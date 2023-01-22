import { useState } from "react";
import { getAuth, updateProfile } from "firebase/auth";
import { doc, updateDoc } from "firebase/firestore";
import { useNavigate } from "react-router";
import { toast } from "react-toastify";
import { db } from "../firebase";

export default function Profile() {
  const auth = getAuth();
  const navigate = useNavigate();
  const [formData, setFormData] = useState({
    name: auth.currentUser.displayName,
    email: auth.currentUser.email,
  });
  const [changeDetail, setChangeDetail] = useState(false);
  const { name, email } = formData;
  function onLogout(e) {
    auth.signOut();
    navigate("/");
  }
  function onChange(e) {
    setFormData((prevState) => {
      return { ...prevState, [e.target.id]: e.target.value };
    });
  }
  async function onSubmit(e) {
    try {
      if (auth.currentUser.displayName !== name) {
        await updateProfile(auth.currentUser, { displayName: name });
        const docRef = doc(db, "users", auth.currentUser.uid);
        await updateDoc(docRef, { name });
        toast.success("user edited");
      }
    } catch (error) {
      toast(error.toString());
    }
  }
  return (
    <section className="max-w-6xl mx-auto flex justify-center items-center flex-col">
      <h1 className="mt-6 text-center font-bold text-3xl">My Profile</h1>
      <div className="w-full md:w-[50%} mt-6 px-3">
        <form>
          <input
            type="text"
            id="name"
            value={name}
            disabled={!changeDetail}
            className={`mb-6 w-full px-4 py-2 text-xl text-gray-700 bg-white border border-gray-300 rounded transition ease-in-out ${
              changeDetail && "bg-red-200"
            }`}
            onChange={onChange}
          />
          <input
            type="email"
            id="email"
            value={email}
            disabled={!changeDetail}
            className="mb-6 w-full px-4 py-2 text-xl text-gray-700 bg-white border border-gray-300 rounded transition ease-in-out"
          />
          <div className="flex justify-between whitespace-nowrap text-sm sm:text-lg">
            <p className="flex items-center">
              Do you want to change your name?
              <span
                onClick={() => {
                  changeDetail && onSubmit();
                  setChangeDetail(!changeDetail);
                }}
                className="text-red-600 hover:text-red-700 transition ease-in-out duration-200 ml-1 cursor-pointer"
              >
                {changeDetail ? "Apply Changes" : "Edit"}
              </span>
            </p>
            <p
              className="text-blue-600 hover:text-blue-700 transition ease-in-out duration-200 cursor-pointer"
              onClick={onLogout}
            >
              Sign out
            </p>
          </div>
        </form>
      </div>
    </section>
  );
}
