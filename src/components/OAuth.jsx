import { doc, getDoc, serverTimestamp, setDoc } from "@firebase/firestore";
import { getAuth, GoogleAuthProvider, signInWithPopup } from "firebase/auth";
import { FcGoogle } from "react-icons/fc";
import { useNavigate } from "react-router";
import { toast } from "react-toastify";
import { db } from "../firebase";

export default function OAuth() {
  const navigate = useNavigate();
  async function onGoogleClick() {
    try {
      const auth = getAuth();
      const provider = new GoogleAuthProvider();
      const result = await signInWithPopup(auth, provider);
      const user = result.user;

      //add user to database
      const docRef = doc(db, "users", user.uid);
      const docSnap = await getDoc(docRef);
      if (!docSnap.exists()) {
        await setDoc(docRef, {
          name: user.displayName,
          email: user.email,
          timestamp: serverTimestamp(),
        });
      }

      navigate("/");
      toast.success("Log in with google complete!");
    } catch (error) {
      toast.error(error.toString());
    }
  }
  return (
    <button
      type="button"
      onClick={onGoogleClick}
      className="w-full px-7 py-3 text-sm font-semibold text-white uppercase flex justify-center items-center shadow-md hover:shadow-lg active:shadow-lg bg-red-600 hover:bg-red-700 active:bg-red-800 rounded transition duration-150 ease-in-out"
    >
      <FcGoogle className="text-xl bg-white rounded-full mr-2" />
      Continue with Google
    </button>
  );
}
