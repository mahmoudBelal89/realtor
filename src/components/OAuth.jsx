import { FcGoogle } from "react-icons/fc";

export default function OAuth() {
  return (
    <button className="w-full px-7 py-3 text-sm font-semibold text-white uppercase flex justify-center items-center shadow-md hover:shadow-lg active:shadow-lg bg-red-600 hover:bg-red-700 active:bg-red-800 rounded transition duration-150 ease-in-out">
      <FcGoogle className="text-xl bg-white rounded-full mr-2" />
      Continue with Google
    </button>
  );
}
