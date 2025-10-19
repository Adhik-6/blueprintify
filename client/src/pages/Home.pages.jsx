import { useState } from "react";
import { useNavigate } from "react-router-dom";
import axiosInstance from "./../utils/axios.utils.js";

export default function Home() {
  const navigate = useNavigate();
  const [land, setLand] = useState({ length: "", width: "" });
  const [bedrooms, setBedrooms] = useState([{ length: "", width: "", balcony: false, bathroom: { included: false, length: "", width: "" } }]);
  const [livingRoom, setLivingRoom] = useState({ length: "", width: "", dining: false, balcony: false, bathroom: { included: false, length: "", width: "" } });
  const [kitchen, setKitchen] = useState({ length: "", width: "" });
  const [parking, setParking] = useState({ mode: "dimensions", length: "", width: "", cars: "", bikes: "" });
  const [storerooms, setStorerooms] = useState([]);
  const [laundry, setLaundry] = useState(null);
  const [customRooms, setCustomRooms] = useState([]);
  const [style, setStyle] = useState("modern");
  const [modelUrl, setModelUrl] = useState(null);
  const [isLoading, setIsLoading] = useState(false);
  const [n, setN] = useState([0, 0]); // To store n and z values from server

  // Bedroom handlers
  const addBedroom = () => setBedrooms([...bedrooms, { length: "", width: "", balcony: false, bathroom: { included: false, length: "", width: "" } }]);
  const removeBedroom = (i) => setBedrooms(bedrooms.filter((_, idx) => idx !== i));

  // Storeroom handlers
  const addStoreroom = () => setStorerooms([...storerooms, { length: "", width: "" }]);
  const removeStoreroom = (i) => setStorerooms(storerooms.filter((_, idx) => idx !== i));

  // Laundry toggle
  const toggleLaundry = () => laundry ? setLaundry(null) : setLaundry({ length: "", width: "" });

  // Custom room handlers
  const addCustomRoom = () => setCustomRooms([...customRooms, { name: "", length: "", width: "" }]);
  const removeCustomRoom = (i) => setCustomRooms(customRooms.filter((_, idx) => idx !== i));

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (!land.length || !land.width) return alert("Land dimensions are required");
    if (bedrooms.length < 1) return alert("At least 1 Bedroom is required");
    if (!livingRoom.length || !livingRoom.width) return alert("Living Room dimensions are required");
    if (!kitchen.length || !kitchen.width) return alert("Kitchen dimensions are required");

    const hasBathroom = bedrooms.some(b => b.bathroom.included) || livingRoom.bathroom.included;
    if (!hasBathroom) return alert("At least 1 Bathroom is required");

    setIsLoading(true);

    const formData = { land, bedrooms, livingRoom, kitchen, parking, storerooms, laundry, customRooms, style };

    try {
      const res = await axiosInstance.post("/get-sample-model", formData);
      setN(res.data.n);
      setModelUrl(`/house_${res.data.n[0]}_${res.data.n[1]}.glb`);
      // const url = URL.createObjectURL(res.data);
      // setModelUrl(url);

    } catch (err) {
      console.error("Error submitting form:", err);
      alert("Error submitting form. Please try again.");
      return;
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-gray-950 text-gray-100">
      <div className="p-6 max-w-3xl mx-auto">
        <h1 className="text-3xl font-extrabold mb-6 text-center text-indigo-400">🏡 House Plan Input Form</h1>
        <form onSubmit={handleSubmit} className="flex flex-col gap-6 bg-gray-900 p-6 rounded-2xl shadow-lg">

          {/* Land Dimensions */}
          <div>
            <h2 className="text-xl font-semibold mb-3 text-indigo-300">Land Dimensions</h2>
            <div className="flex gap-3">
              <input
                type="number"
                placeholder="Total Length (ft)"
                className="bg-gray-900 border border-gray-700 p-2 rounded w-1/2 focus:ring-2 focus:ring-indigo-500"
                value={land.length}
                onChange={(e) => setLand({ ...land, length: e.target.value })}
                required
              />
              <input
                type="number"
                placeholder="Total Width (ft)"
                className="bg-gray-900 border border-gray-700 p-2 rounded w-1/2 focus:ring-2 focus:ring-indigo-500"
                value={land.width}
                onChange={(e) => setLand({ ...land, width: e.target.value })}
                required
              />
            </div>
          </div>
          
          {/* Bedrooms */}
          <div>
            <h2 className="text-xl font-semibold mb-3 text-indigo-300">Bedrooms</h2>
            {bedrooms.map((bed, i) => (
              <div key={i} className="border border-gray-700 bg-gray-800 p-4 rounded-xl mb-3">
                <div className="flex gap-3">
                  <input
                    type="number"
                    placeholder="Length (ft)"
                    className="bg-gray-900 border border-gray-700 p-2 rounded w-1/2 focus:ring-2 focus:ring-indigo-500"
                    value={bed.length}
                    onChange={(e) => {
                      const newBeds = [...bedrooms];
                      newBeds[i].length = e.target.value;
                      setBedrooms(newBeds);
                    }}
                    required
                  />
                  <input
                    type="number"
                    placeholder="Width (ft)"
                    className="bg-gray-900 border border-gray-700 p-2 rounded w-1/2 focus:ring-2 focus:ring-indigo-500"
                    value={bed.width}
                    onChange={(e) => {
                      const newBeds = [...bedrooms];
                      newBeds[i].width = e.target.value;
                      setBedrooms(newBeds);
                    }}
                    required
                  />
                </div>

                <label className="flex items-center gap-2 mt-3 text-sm">
                  <input
                    type="checkbox"
                    checked={bed.balcony}
                    onChange={(e) => {
                      const newBeds = [...bedrooms];
                      newBeds[i].balcony = e.target.checked;
                      setBedrooms(newBeds);
                    }}
                  />
                  Include Balcony
                </label>

                <label className="flex items-center gap-2 mt-2 text-sm">
                  <input
                    type="checkbox"
                    checked={bed.bathroom.included}
                    onChange={(e) => {
                      const newBeds = [...bedrooms];
                      newBeds[i].bathroom.included = e.target.checked;
                      setBedrooms(newBeds);
                    }}
                  />
                  Include Bathroom
                </label>

                {bed.bathroom.included && (
                  <div className="flex gap-3 mt-2">
                    <input
                      type="number"
                      placeholder="Bathroom Length (ft)"
                      className="bg-gray-900 border border-gray-700 p-2 rounded w-1/2 focus:ring-2 focus:ring-indigo-500"
                      value={bed.bathroom.length}
                      onChange={(e) => {
                        const newBeds = [...bedrooms];
                        newBeds[i].bathroom.length = e.target.value;
                        setBedrooms(newBeds);
                      }}
                      required
                    />
                    <input
                      type="number"
                      placeholder="Bathroom Width (ft)"
                      className="bg-gray-900 border border-gray-700 p-2 rounded w-1/2 focus:ring-2 focus:ring-indigo-500"
                      value={bed.bathroom.width}
                      onChange={(e) => {
                        const newBeds = [...bedrooms];
                        newBeds[i].bathroom.width = e.target.value;
                        setBedrooms(newBeds);
                      }}
                      required
                    />
                  </div>
                )}

                {bedrooms.length > 1 && (
                  <button type="button" className="text-red-400 mt-3 hover:underline" onClick={() => removeBedroom(i)}>
                    Remove Bedroom
                  </button>
                )}
              </div>
            ))}
            <button type="button" onClick={addBedroom} className="bg-indigo-600 hover:bg-indigo-700 transition text-white px-3 py-2 rounded-md mt-2">
              + Add Bedroom
            </button>
          </div>

          {/* Living Room */}
          <div>
            <h2 className="text-xl font-semibold mb-3 text-indigo-300">Living Room</h2>
            <div className="border border-gray-700 bg-gray-800 p-4 rounded-xl">
              <div className="flex gap-3">
                <input
                  type="number"
                  placeholder="Length (ft)"
                  className="bg-gray-900 border border-gray-700 p-2 rounded w-1/2 focus:ring-2 focus:ring-indigo-500"
                  value={livingRoom.length}
                  onChange={(e) => setLivingRoom({ ...livingRoom, length: e.target.value })}
                  required
                />
                <input
                  type="number"
                  placeholder="Width (ft)"
                  className="bg-gray-900 border border-gray-700 p-2 rounded w-1/2 focus:ring-2 focus:ring-indigo-500"
                  value={livingRoom.width}
                  onChange={(e) => setLivingRoom({ ...livingRoom, width: e.target.value })}
                  required
                />
              </div>

              <label className="flex items-center gap-2 mt-3 text-sm">
                <input
                  type="checkbox"
                  checked={livingRoom.dining}
                  onChange={(e) => setLivingRoom({ ...livingRoom, dining: e.target.checked })}
                />
                Include Dining Area
              </label>

              <label className="flex items-center gap-2 mt-2 text-sm">
                <input
                  type="checkbox"
                  checked={livingRoom.balcony}
                  onChange={(e) => setLivingRoom({ ...livingRoom, balcony: e.target.checked })}
                />
                Include Balcony
              </label>

              <label className="flex items-center gap-2 mt-2 text-sm">
                <input
                  type="checkbox"
                  checked={livingRoom.bathroom.included}
                  onChange={(e) => setLivingRoom({ ...livingRoom, bathroom: { ...livingRoom.bathroom, included: e.target.checked } })}
                />
                Include Bathroom
              </label>

              {livingRoom.bathroom.included && (
                <div className="flex gap-3 mt-2">
                  <input
                    type="number"
                    placeholder="Bathroom Length (ft)"
                    className="bg-gray-900 border border-gray-700 p-2 rounded w-1/2 focus:ring-2 focus:ring-indigo-500"
                    value={livingRoom.bathroom.length}
                    onChange={(e) => setLivingRoom({ ...livingRoom, bathroom: { ...livingRoom.bathroom, length: e.target.value } })}
                    required
                  />
                  <input
                    type="number"
                    placeholder="Bathroom Width (ft)"
                    className="bg-gray-900 border border-gray-700 p-2 rounded w-1/2 focus:ring-2 focus:ring-indigo-500"
                    value={livingRoom.bathroom.width}
                    onChange={(e) => setLivingRoom({ ...livingRoom, bathroom: { ...livingRoom.bathroom, width: e.target.value } })}
                    required
                  />
                </div>
              )}
            </div>
          </div>

          {/* Kitchen */}
          <div>
            <h2 className="text-xl font-semibold mb-3 text-indigo-300">Kitchen</h2>
            <div className="flex gap-3">
              <input
                type="number"
                placeholder="Length (ft)"
                className="bg-gray-900 border border-gray-700 p-2 rounded w-1/2 focus:ring-2 focus:ring-indigo-500"
                value={kitchen.length}
                onChange={(e) => setKitchen({ ...kitchen, length: e.target.value })}
                required
              />
              <input
                type="number"
                placeholder="Width (ft)"
                className="bg-gray-900 border border-gray-700 p-2 rounded w-1/2 focus:ring-2 focus:ring-indigo-500"
                value={kitchen.width}
                onChange={(e) => setKitchen({ ...kitchen, width: e.target.value })}
                required
              />
            </div>
          </div>

          {/* Parking */}
          <div>
            <h2 className="text-xl font-semibold mb-3 text-indigo-300">Parking (Optional)</h2>
            <select
              value={parking.mode}
              onChange={(e) => setParking({ ...parking, mode: e.target.value })}
              className="bg-gray-900 border border-gray-700 p-2 rounded mb-3 w-full focus:ring-2 focus:ring-indigo-500"
            >
              <option value="dimensions">Enter Dimensions</option>
              <option value="vehicles">Specify Vehicles</option>
            </select>
            {parking.mode === "dimensions" ? (
              <div className="flex gap-3">
                <input
                  type="number"
                  placeholder="Length (ft)"
                  className="bg-gray-900 border border-gray-700 p-2 rounded w-1/2 focus:ring-2 focus:ring-indigo-500"
                  value={parking.length}
                  onChange={(e) => setParking({ ...parking, length: e.target.value })}
                />
                <input
                  type="number"
                  placeholder="Width (ft)"
                  className="bg-gray-900 border border-gray-700 p-2 rounded w-1/2 focus:ring-2 focus:ring-indigo-500"
                  value={parking.width}
                  onChange={(e) => setParking({ ...parking, width: e.target.value })}
                />
              </div>
            ) : (
              <div className="flex gap-3">
                <input
                  type="number"
                  placeholder="Cars"
                  className="bg-gray-900 border border-gray-700 p-2 rounded w-1/2 focus:ring-2 focus:ring-indigo-500"
                  value={parking.cars}
                  onChange={(e) => setParking({ ...parking, cars: e.target.value })}
                />
                <input
                  type="number"
                  placeholder="Bikes"
                  className="bg-gray-900 border border-gray-700 p-2 rounded w-1/2 focus:ring-2 focus:ring-indigo-500"
                  value={parking.bikes}
                  onChange={(e) => setParking({ ...parking, bikes: e.target.value })}
                />
              </div>
            )}
          </div>

          {/* Design Style */}
          <div>
            <h2 className="text-xl font-semibold mb-3 text-indigo-300">Design Style</h2>
            <select value={style} onChange={(e) => setStyle(e.target.value)} className="bg-gray-900 border border-gray-700 p-2 rounded w-full focus:ring-2 focus:ring-indigo-500">
              <option value="modern">Modern</option>
              <option value="minimalistic">Minimalistic</option>
              <option value="luxury">Luxury</option>
              <option value="traditional">Traditional</option>
            </select>
          </div>

          {/* Submit */}
          <button type="submit" className="bg-green-600 hover:bg-green-700 transition text-white py-3 rounded-lg font-semibold">
            Submit Plan
          </button>
        </form>
      </div>

      <div className="p-6 max-w-3xl mx-auto">
        <h2 className="text-3xl font-bold text-center mt-6 mb-6 text-indigo-400">3D Model Preview</h2>
        {modelUrl ? (
          <>
            <model-viewer
              src={modelUrl}
              alt="3D model"
              camera-controls
              auto-rotate
              style={{ width: "100%", height: "350px", backgroundColor: "white" }}
              className="border border-gray-700 rounded-2xl shadow-lg"
            ></model-viewer>

            {/* Download button */}
            <div className="mt-6 flex justify-around gap-6">
              <a href={`/house_${n[0]}_${n[1]}.glb`} download="floorplan.glb">
                <button className="py-2 px-6 bg-indigo-600 hover:bg-indigo-700 transition text-white rounded-lg font-medium shadow-md">
                  Download GLB file
                </button>
              </a>
              
              <div className="">
                <button onClick={() => navigate(`/walkthrough${modelUrl.split(".")[0]}`)}>
                  Try Walkthrough
                </button>
              </div>
            </div>
          </>
        ) : (
          <>
            {isLoading ? (
              <div className="flex justify-center items-center h-40">
                <div className="animate-spin rounded-full h-16 w-16 border-t-4 border-b-4 border-indigo-500"></div>
              </div>
            ) : (
              <p className="text-center text-gray-500">Submit the form to generate and view the 3D model.</p>
            )}
          </>
        )}
      </div>

      {/* {modelUrl && <Walkthrough modelUrl={modelUrl} />} */}

    </div>
  );
}
