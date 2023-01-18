import { useState } from "react";
import { getAuth } from "firebase/auth";
import {
  getDownloadURL,
  getStorage,
  ref,
  uploadBytesResumable,
} from "firebase/storage";
import { toast } from "react-toastify";
import Spinner from "../components/Spinner";
import { v4 as uuidv4 } from "uuid";
import { addDoc, collection, serverTimestamp } from "firebase/firestore";
import { db } from "../firebase";

export default function CreateListing() {
  const auth = getAuth();
  const [loading, setLoading] = useState(false);
  const [formData, setFormData] = useState({
    type: "sell",
    name: "",
    bedrooms: 1,
    bathrooms: 1,
    parking: false,
    furnished: false,
    address: "",
    description: "",
    offer: true,
    regularPrice: 0,
    discountedPrice: 0,
    latitude: 0,
    longitude: 0,
    images: {},
  });
  const {
    type,
    name,
    bedrooms,
    bathrooms,
    parking,
    furnished,
    address,
    description,
    offer,
    regularPrice,
    discountedPrice,
    latitude,
    longitude,
    images,
  } = formData;
  function onChange(e) {
    let trueOrFalse = null;
    if (e.target.value === "true") {
      trueOrFalse = true;
    }
    if (e.target.value === "false") {
      trueOrFalse = false;
    }
    if (e.target.files) {
      setFormData((prevState) => ({ ...prevState, images: e.target.files }));
    }
    if (!e.target.files) {
      setFormData((prevState) => ({
        ...prevState,
        [e.target.id]: trueOrFalse ?? e.target.value,
      }));
    }
  }
  async function storeImage(image) {
    return new Promise((resolve, reject) => {
      const storage = getStorage();
      const fileName = `${auth.currentUser.uid}-${image.name}-${uuidv4()}`;
      const storageRef = ref(storage, fileName);
      const uploadTask = uploadBytesResumable(storageRef, image);
      uploadTask.on(
        "state_changed",
        (snapshot) => {
          // Observe state change events such as progress, pause, and resume
          // Get task progress, including the number of bytes uploaded and the total number of bytes to be uploaded
          const progress =
            (snapshot.bytesTransferred / snapshot.totalBytes) * 100;
          console.log("Upload is " + progress + "% done");
          switch (snapshot.state) {
            case "paused":
              console.log("Upload is paused");
              break;
            case "running":
              console.log("Upload is running");
              break;
          }
        },
        (error) => {
          reject(error);
        },
        () => {
          // Handle successful uploads on complete
          // For instance, get the download URL: https://firebasestorage.googleapis.com/...
          getDownloadURL(uploadTask.snapshot.ref).then((downloadURL) => {
            resolve(downloadURL);
          });
        }
      );
    });
  }
  async function onSubmit(e) {
    e.preventDefault();
    setLoading(true);

    if (images.length > 6) {
      setLoading(false);
      toast.error("Max images count is 6!");
      return;
    }

    if (+discountedPrice >= +regularPrice) {
      setLoading(false);
      toast.error(
        `discounted ${discountedPrice} cant be greater than regular ${regularPrice} !`
      );
      return;
    }

    const imgUrls = await Promise.all(
      [...images].map((image) => storeImage(image))
    ).catch((error) => {
      setLoading(false);
      toast.error("image not uploaded!");
      return;
    });
    const formDataCopy = {
      ...formData,
      imgUrls,
      timestamp: serverTimestamp(),
    };
    delete formDataCopy.images;
    !formDataCopy.offer && delete formDataCopy.discountedPrice;

    const docRef = await addDoc(collection(db, "listings"), formDataCopy);
    setLoading(false);
    toast.success("Listing added!");
  }
  if (loading) {
    return <Spinner />;
  }
  return (
    <main className="max-w-md mx-auto px-2">
      <h1 className="text-3xl text-center mt-6 font-bold">Create a listing</h1>
      <form onSubmit={onSubmit}>
        <p className="text-lg mt-6 font-semibold">Sell / Rent</p>
        <div className="flex space-x-6">
          <button
            type="button"
            id="type"
            value="sell"
            onClick={onChange}
            className={`w-full px-7 py-3 rounded shadow-md text-sm font-medium uppercase hover:shadow-lg focus:shadow-lg active:shadow-lg transition duration-150 ease-in-out ${
              type === "sell"
                ? "bg-slate-600 text-white"
                : "bg-white text-black"
            }`}
          >
            sell
          </button>
          <button
            type="button"
            id="type"
            value="rent"
            onClick={onChange}
            className={`w-full px-7 py-3 rounded shadow-md text-sm font-medium uppercase hover:shadow-lg focus:shadow-lg active:shadow-lg transition duration-150 ease-in-out ${
              type === "rent"
                ? "bg-slate-600 text-white"
                : "bg-white text-black"
            }`}
          >
            rent
          </button>
        </div>
        <p className="mt-6 text-lg font-semibold">Name</p>
        <input
          type="text"
          id="name"
          value={name}
          onChange={onChange}
          placeholder="Name"
          maxLength="32"
          minLength="10"
          required
          className="w-full px-4 py-2 text-xl text-gray-700 bg-white border border-gray-300 rounded transition duration-200 ease-in-out focus:text-gray-700 focus:bg-white focus:border-slate-600 mb-6"
        />
        <div className="flex space-x-6 mb-6">
          <div>
            <p className="text-lg font-semibold">Beds</p>
            <input
              type="number"
              id="bedrooms"
              value={bedrooms}
              onChange={onChange}
              max="50"
              min="1"
              required
              className="w-full px-4 py-2 text-center text-xl text-gray-700 bg-white border border-gray-300 rounded transition duration-200 ease-in-out focus:text-gray-700 focus:bg-white focus:border-slate-600"
            />
          </div>
          <div>
            <p className="text-lg font-semibold">Baths</p>
            <input
              type="number"
              id="bathrooms"
              value={bathrooms}
              onChange={onChange}
              max="20"
              min="1"
              required
              className="w-full px-4 py-2 text-center text-xl text-gray-700 bg-white border border-gray-300 rounded transition duration-200 ease-in-out focus:text-gray-700 focus:bg-white focus:border-slate-600"
            />
          </div>
        </div>
        <p className="text-lg mt-6 font-semibold">Parking spot</p>
        <div className="flex space-x-6">
          <button
            type="button"
            id="parking"
            value={true}
            onClick={onChange}
            className={`w-full px-7 py-3 rounded shadow-md text-sm font-medium uppercase hover:shadow-lg focus:shadow-lg active:shadow-lg transition duration-150 ease-in-out ${
              !parking ? "bg-white text-black" : "bg-slate-600 text-white"
            }`}
          >
            yes
          </button>
          <button
            type="button"
            id="parking"
            value={false}
            onClick={onChange}
            className={`w-full px-7 py-3 rounded shadow-md text-sm font-medium uppercase hover:shadow-lg focus:shadow-lg active:shadow-lg transition duration-150 ease-in-out ${
              parking ? "bg-white text-black" : "bg-slate-600 text-white"
            }`}
          >
            no
          </button>
        </div>
        <p className="text-lg mt-6 font-semibold">Furnished</p>
        <div className="flex space-x-6">
          <button
            type="button"
            id="furnished"
            value={true}
            onClick={onChange}
            className={`w-full px-7 py-3 rounded shadow-md text-sm font-medium uppercase hover:shadow-lg focus:shadow-lg active:shadow-lg transition duration-150 ease-in-out ${
              !furnished ? "bg-white text-black" : "bg-slate-600 text-white"
            }`}
          >
            yes
          </button>
          <button
            type="button"
            id="furnished"
            value={false}
            onClick={onChange}
            className={`w-full px-7 py-3 rounded shadow-md text-sm font-medium uppercase hover:shadow-lg focus:shadow-lg active:shadow-lg transition duration-150 ease-in-out ${
              furnished ? "bg-white text-black" : "bg-slate-600 text-white"
            }`}
          >
            no
          </button>
        </div>
        <p className="mt-6 text-lg font-semibold">Address</p>
        <textarea
          type="text"
          id="address"
          value={address}
          onChange={onChange}
          placeholder="Address"
          required
          className="w-full px-4 py-2 text-xl text-gray-700 bg-white border border-gray-300 rounded transition duration-200 ease-in-out focus:text-gray-700 focus:bg-white focus:border-slate-600 mb-6"
        />

        <div className="mb-6 flex space-x-3 justify-start">
          <div>
            <p className="font-semibold">Latitude</p>
            <input
              type="number"
              id="latitude"
              value={latitude}
              onChange={onChange}
              required
              min="-90"
              max="90"
              className="w-full px-4 py-2 text-center text-xl text-gray-700 bg-white border border-gray-300 rounded transition duration-200 ease-in-out focus:text-gray-700 focus:bg-white focus:border-slate-600"
            />
          </div>
          <div>
            <p className="font-semibold">Longitude</p>
            <input
              type="number"
              id="longitude"
              value={longitude}
              onChange={onChange}
              required
              min="-180"
              max="180"
              className="w-full px-4 py-2 text-center text-xl text-gray-700 bg-white border border-gray-300 rounded transition duration-200 ease-in-out focus:text-gray-700 focus:bg-white focus:border-slate-600"
            />
          </div>
        </div>
        <p className="text-lg font-semibold">Description</p>
        <textarea
          type="text"
          id="description"
          value={description}
          onChange={onChange}
          placeholder="Description"
          required
          className="w-full px-4 py-2 text-xl text-gray-700 bg-white border border-gray-300 rounded transition duration-200 ease-in-out focus:text-gray-700 focus:bg-white focus:border-slate-600 mb-6"
        />
        <p className="text-lg font-semibold">Offer</p>
        <div className="mb-6 flex space-x-6">
          <button
            type="button"
            id="offer"
            value={true}
            onClick={onChange}
            className={`w-full px-7 py-3 rounded shadow-md text-sm font-medium uppercase hover:shadow-lg focus:shadow-lg active:shadow-lg transition duration-150 ease-in-out ${
              !offer ? "bg-white text-black" : "bg-slate-600 text-white"
            }`}
          >
            yes
          </button>
          <button
            type="button"
            id="offer"
            value={false}
            onClick={onChange}
            className={`w-full px-7 py-3 rounded shadow-md text-sm font-medium uppercase hover:shadow-lg focus:shadow-lg active:shadow-lg transition duration-150 ease-in-out ${
              offer ? "bg-white text-black" : "bg-slate-600 text-white"
            }`}
          >
            no
          </button>
        </div>
        <div className="mb-6">
          <p className="text-lg font-semibold">Regular price</p>
          <div className="flex w-full justify-center items-center space-x-4">
            <input
              type="number"
              id="regularPrice"
              value={regularPrice}
              onChange={onChange}
              min="50"
              max="400000000"
              required
              className="w-full px-4 py-2 text-xl text-gray-700 bg-white border border-gray-300 rounded transition duration-200 ease-in-out focus:border-slate-600 text-center"
            />
            {type === "rent" && (
              <p className="whitespace-nowrap w-full text-lg">$ / Month</p>
            )}
          </div>
        </div>
        {offer && (
          <div className="mb-6">
            <p className="text-lg font-semibold">Discounted price</p>
            <div className="flex w-full justify-center items-center space-x-4">
              <input
                type="number"
                id="discountedPrice"
                value={discountedPrice}
                onChange={onChange}
                min="50"
                max="400000000"
                required={offer}
                className="w-full px-4 py-2 text-xl text-gray-700 bg-white border border-gray-300 rounded transition duration-200 ease-in-out focus:border-slate-600 text-center"
              />
              {type === "rent" && (
                <p className="whitespace-nowrap w-full text-lg">$ / Month</p>
              )}
            </div>
          </div>
        )}
        <div className="mb-6">
          <p className="text-lg font-semibold">Images</p>
          <p className="text-gray-600">
            The first image will be the cover (max 6)
          </p>
          <input
            type="file"
            id="images"
            onChange={onChange}
            accept=".jpg,.jpeg,.png"
            multiple
            required
            className="w-full px-3 py-1.5 text-gray-700 bg-white border border-gray-300 rounded transition duration-200 ease-in-out focus:border-gray-500 focus:bg-white"
          />
        </div>
        <button className="mb-6 w-full px-7 py-3 bg-blue-600 text-white text-sm font-semibold shadow-md rounded hover:bg-blue-700 active:bg-blue-800 transition duration-200 hover:shadow-lg active:shadow-xl ease-in-out">
          Create Listing
        </button>
      </form>
    </main>
  );
}
