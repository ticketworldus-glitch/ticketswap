// // src/components/AdminEventForm.jsx
// import { useState } from "react";
// import { EVENT_CATEGORIES } from "../constants/eventCategories";

// function emptyLocation() {
//   return {
//     id: Math.random().toString(36).slice(2),
//     name: "",
//     type: "", // "event" | "parking" | ""
//     datesText: "",
//   };
// }

// export default function AdminEventForm({ initial = {}, onSubmit, submitting }) {
//   const [form, setForm] = useState({
//     artistName: initial.artistName || "",
//     eventName: initial.eventName || "",
//     description: initial.description || "",
//     baseViewCount:
//       typeof initial.baseViewCount === "number"
//         ? initial.baseViewCount
//         : 0,
//     youtubeUrl: initial.youtubeUrl || "",
//     tourStartDate: initial.tourStartDate || "",
//     tourEndDate: initial.tourEndDate || "",
//     category: initial.category || "concerts",
//     locations:
//       (initial.locations &&
//         initial.locations.map((loc) => ({
//           id: loc.id || Math.random().toString(36).slice(2),
//           name: loc.name || "",
//           type: loc.type || "",
//           datesText: Array.isArray(loc.dates) ? loc.dates.join(",") : "",
//         }))) ||
//       [emptyLocation()],
//   });

//   const handleFieldChange = (e) => {
//     const { name, value } = e.target;
//     setForm((f) => ({ ...f, [name]: value }));
//   };

//   const handleLocationChange = (id, field, value) => {
//     setForm((f) => ({
//       ...f,
//       locations: f.locations.map((loc) =>
//         loc.id === id ? { ...loc, [field]: value } : loc
//       ),
//     }));
//   };

//   const handleAddLocation = () => {
//     setForm((f) => ({
//       ...f,
//       locations: [...f.locations, emptyLocation()],
//     }));
//   };

//   const handleRemoveLocation = (id) => {
//     setForm((f) => ({
//       ...f,
//       locations:
//         f.locations.length === 1
//           ? f.locations
//           : f.locations.filter((loc) => loc.id !== id),
//     }));
//   };

//   const handleSubmit = (e) => {
//     e.preventDefault();

//     const cleanedLocations = form.locations
//       .filter((loc) => loc.name.trim().length > 0)
//       .map((loc) => {
//         const dates =
//           loc.datesText
//             ?.split(",")
//             .map((d) => d.trim())
//             .filter(Boolean) || [];

//         return {
//           id: loc.id,
//           name: loc.name.trim(),
//           type: loc.type || "",
//           dates,
//         };
//       });

//     const payload = {
//       artistName: form.artistName.trim(),
//       eventName: form.eventName.trim(),
//       description: form.description.trim(),
//       baseViewCount: Number(form.baseViewCount) || 0,
//       youtubeUrl: form.youtubeUrl.trim(),
//       tourStartDate: form.tourStartDate || "",
//       tourEndDate: form.tourEndDate || "",
//       category: form.category || "other",
//       locations: cleanedLocations,
//     };

//     onSubmit(payload);
//   };

//   return (
//     <form onSubmit={handleSubmit} className="space-y-6">
//       {/* Core info */}
//       <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
//         <div className="space-y-1 text-xs md:col-span-1">
//           <label className="text-slate-300">Artist name</label>
//           <input
//             name="artistName"
//             value={form.artistName}
//             onChange={handleFieldChange}
//             required
//             className="bg-slate-900 border border-slate-700 rounded px-3 py-2 text-xs w-full"
//             placeholder="Taylor Swift"
//           />
//         </div>

//         <div className="space-y-1 text-xs md:col-span-1">
//           <label className="text-slate-300">Event / tour name</label>
//           <input
//             name="eventName"
//             value={form.eventName}
//             onChange={handleFieldChange}
//             required
//             className="bg-slate-900 border border-slate-700 rounded px-3 py-2 text-xs w-full"
//             placeholder="The Eras Tour"
//           />
//         </div>

//         <div className="space-y-1 text-xs md:col-span-1">
//           <label className="text-slate-300">Category</label>
//           <select
//             name="category"
//             value={form.category}
//             onChange={handleFieldChange}
//             className="bg-slate-900 border border-slate-700 rounded px-3 py-2 text-xs w-full"
//           >
//             {EVENT_CATEGORIES.map((cat) => (
//               <option key={cat.value} value={cat.value}>
//                 {cat.label}
//               </option>
//             ))}
//           </select>
//         </div>

//         <div className="space-y-1 text-xs">
//           <label className="text-slate-300">
//             Base view count (e.g. 4900)
//           </label>
//           <input
//             type="number"
//             name="baseViewCount"
//             value={form.baseViewCount}
//             onChange={handleFieldChange}
//             className="bg-slate-900 border border-slate-700 rounded px-3 py-2 text-xs w-full"
//             min={0}
//           />
//         </div>

//         <div className="space-y-1 text-xs">
//           <label className="text-slate-300">Artist YouTube link</label>
//           <input
//             name="youtubeUrl"
//             value={form.youtubeUrl}
//             onChange={handleFieldChange}
//             className="bg-slate-900 border border-slate-700 rounded px-3 py-2 text-xs w-full"
//             placeholder="https://www.youtube.com/..."
//           />
//         </div>

//         <div className="space-y-1 text-xs">
//           <label className="text-slate-300">Tour start date</label>
//           <input
//             type="date"
//             name="tourStartDate"
//             value={form.tourStartDate}
//             onChange={handleFieldChange}
//             className="bg-slate-900 border border-slate-700 rounded px-3 py-2 text-xs w-full"
//           />
//         </div>

//         <div className="space-y-1 text-xs">
//           <label className="text-slate-300">Tour end date</label>
//           <input
//             type="date"
//             name="tourEndDate"
//             value={form.tourEndDate}
//             onChange={handleFieldChange}
//             className="bg-slate-900 border border-slate-700 rounded px-3 py-2 text-xs w-full"
//           />
//         </div>
//       </div>

//       {/* Description */}
//       <div className="space-y-1 text-xs">
//         <label className="text-slate-300">Description</label>
//         <textarea
//           name="description"
//           value={form.description}
//           onChange={handleFieldChange}
//           rows={4}
//           className="bg-slate-900 border border-slate-700 rounded px-3 py-2 text-xs w-full"
//           placeholder="Add a short description of the tour, support acts, vibe, etc."
//         />
//       </div>

//       {/* Locations */}
//       <div className="space-y-3">
//         <div className="flex items-center justify-between">
//           <h3 className="text-sm font-semibold text-slate-100">
//             Tour locations & dates
//           </h3>
//           <button
//             type="button"
//             onClick={handleAddLocation}
//             className="text-[11px] px-3 py-1 rounded-full bg-slate-800 text-slate-100"
//           >
//             + Add location
//           </button>
//         </div>

//         <div className="space-y-3">
//           {form.locations.map((loc, idx) => (
//             <div
//               key={loc.id}
//               className="border border-slate-800 rounded-xl bg-slate-900 p-3 space-y-3 text-xs"
//             >
//               <div className="flex items-center justify-between">
//                 <p className="font-medium text-slate-100">
//                   Location {idx + 1}
//                 </p>
//                 {form.locations.length > 1 && (
//                   <button
//                     type="button"
//                     onClick={() => handleRemoveLocation(loc.id)}
//                     className="text-[11px] text-red-400"
//                   >
//                     Remove
//                   </button>
//                 )}
//               </div>

//               <div className="grid grid-cols-1 md:grid-cols-3 gap-3">
//                 <div className="space-y-1">
//                   <label className="text-slate-300">Location name</label>
//                   <input
//                     value={loc.name}
//                     onChange={(e) =>
//                       handleLocationChange(loc.id, "name", e.target.value)
//                     }
//                     placeholder="New York, Madison Square Garden"
//                     className="bg-slate-950 border border-slate-700 rounded px-3 py-2 text-xs w-full"
//                   />
//                 </div>

//                 <div className="space-y-1">
//                   <label className="text-slate-300">
//                     Type (optional)
//                   </label>
//                   <select
//                     value={loc.type}
//                     onChange={(e) =>
//                       handleLocationChange(loc.id, "type", e.target.value)
//                     }
//                     className="bg-slate-950 border border-slate-700 rounded px-3 py-2 text-xs w-full"
//                   >
//                     <option value="">Not specified</option>
//                     <option value="event">Event</option>
//                     <option value="parking">Parking</option>
//                   </select>
//                 </div>

//                 <div className="space-y-1">
//                   <label className="text-slate-300">
//                     Dates for this location
//                   </label>
//                   <input
//                     value={loc.datesText}
//                     onChange={(e) =>
//                       handleLocationChange(
//                         loc.id,
//                         "datesText",
//                         e.target.value
//                       )
//                     }
//                     placeholder="2026-05-10, 2026-05-11"
//                     className="bg-slate-950 border border-slate-700 rounded px-3 py-2 text-xs w-full"
//                   />
//                   <p className="text-[10px] text-slate-500 mt-1">
//                     Enter one or more dates separated by commas.
//                   </p>
//                 </div>
//               </div>
//             </div>
//           ))}
//         </div>
//       </div>

//       <button
//         type="submit"
//         disabled={submitting}
//         className="px-4 py-2 rounded-full bg-emerald-600 text-xs font-medium disabled:opacity-50"
//       >
//         {submitting ? "Saving event..." : "Save event"}
//       </button>
//     </form>
//   );
// }










































// src/components/AdminEventForm.jsx
import { useState } from "react";
import { EVENT_CATEGORIES } from "../constants/eventCategories";

function emptyLocation() {
  return {
    id: Math.random().toString(36).slice(2),
    name: "",
    type: "", // "event" | "parking" | ""
    datesText: "",
  };
}

export default function AdminEventForm({ initial = {}, onSubmit, submitting }) {
  const [form, setForm] = useState({
    artistName: initial.artistName || "",
    eventName: initial.eventName || "",
    description: initial.description || "",
    baseViewCount:
      typeof initial.baseViewCount === "number"
        ? initial.baseViewCount
        : 0,
    youtubeUrl: initial.youtubeUrl || "",
    tourStartDate: initial.tourStartDate || "",
    tourEndDate: initial.tourEndDate || "",
    category: initial.category || "concerts",
    eventImageUrl: initial.eventImageUrl || "", // 🔹 new field for event image
    locations:
      (initial.locations &&
        initial.locations.map((loc) => ({
          id: loc.id || Math.random().toString(36).slice(2),
          name: loc.name || "",
          type: loc.type || "",
          datesText: Array.isArray(loc.dates) ? loc.dates.join(",") : "",
        }))) ||
      [emptyLocation()],
  });

  const [imageUploading, setImageUploading] = useState(false);
  const [imageError, setImageError] = useState("");

  const handleFieldChange = (e) => {
    const { name, value } = e.target;
    setForm((f) => ({ ...f, [name]: value }));
  };

  const handleLocationChange = (id, field, value) => {
    setForm((f) => ({
      ...f,
      locations: f.locations.map((loc) =>
        loc.id === id ? { ...loc, [field]: value } : loc
      ),
    }));
  };

  const handleAddLocation = () => {
    setForm((f) => ({
      ...f,
      locations: [...f.locations, emptyLocation()],
    }));
  };

  const handleRemoveLocation = (id) => {
    setForm((f) => ({
      ...f,
      locations:
        f.locations.length === 1
          ? f.locations
          : f.locations.filter((loc) => loc.id !== id),
    }));
  };

  // 🔹 Cloudinary image upload handler
  const handleImageSelect = async (e) => {
    const file = e.target.files?.[0];
    if (!file) return;

    setImageError("");
    setImageUploading(true);

    const CLOUD_NAME = import.meta.env.VITE_CLOUDINARY_CLOUD_NAME;
    const UPLOAD_PRESET =
      import.meta.env.VITE_CLOUDINARY_UPLOAD_PRESET || "TicketGen"; // from your preset

    if (!CLOUD_NAME || !UPLOAD_PRESET) {
      setImageError("Cloudinary configuration missing. Check env variables.");
      setImageUploading(false);
      return;
    }

    try {
      const formData = new FormData();
      formData.append("file", file);
      formData.append("upload_preset", UPLOAD_PRESET);
      // optional: tag/folder to organize
      formData.append("folder", "events");

      const res = await fetch(
        `https://api.cloudinary.com/v1_1/${CLOUD_NAME}/image/upload`,
        {
          method: "POST",
          body: formData,
        }
      );

      const data = await res.json();
      if (data.error) {
        console.error("Cloudinary error:", data.error);
        setImageError(data.error.message || "Upload failed");
      } else {
        setForm((f) => ({
          ...f,
          eventImageUrl: data.secure_url || "",
        }));
      }
    } catch (err) {
      console.error("Cloudinary upload failed:", err);
      setImageError("Upload failed. Please try again.");
    } finally {
      setImageUploading(false);
    }
  };

  const handleSubmit = (e) => {
    e.preventDefault();

    const cleanedLocations = form.locations
      .filter((loc) => loc.name.trim().length > 0)
      .map((loc) => {
        const dates =
          loc.datesText
            ?.split(",")
            .map((d) => d.trim())
            .filter(Boolean) || [];

        return {
          id: loc.id,
          name: loc.name.trim(),
          type: loc.type || "",
          dates,
        };
      });

    const payload = {
      artistName: form.artistName.trim(),
      eventName: form.eventName.trim(),
      description: form.description.trim(),
      baseViewCount: Number(form.baseViewCount) || 0,
      youtubeUrl: form.youtubeUrl.trim(),
      tourStartDate: form.tourStartDate || "",
      tourEndDate: form.tourEndDate || "",
      category: form.category || "other",
      eventImageUrl: form.eventImageUrl || "", // 🔹 include image URL in payload
      locations: cleanedLocations,
    };

    onSubmit(payload);
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-6">
      {/* Core info */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        <div className="space-y-1 text-xs md:col-span-1">
          <label className="text-slate-700 dark:text-slate-300">
            Artist name
          </label>
          <input
            name="artistName"
            value={form.artistName}
            onChange={handleFieldChange}
            required
            className="w-full rounded-md border border-slate-300 bg-white px-3 py-2 text-xs text-slate-900 shadow-sm focus:border-emerald-500 focus:ring-1 focus:ring-emerald-500 dark:bg-slate-950 dark:border-slate-700 dark:text-slate-100"
            placeholder="Taylor Swift"
          />
        </div>

        <div className="space-y-1 text-xs md:col-span-1">
          <label className="text-slate-700 dark:text-slate-300">
            Event / tour name
          </label>
          <input
            name="eventName"
            value={form.eventName}
            onChange={handleFieldChange}
            required
            className="w-full rounded-md border border-slate-300 bg-white px-3 py-2 text-xs text-slate-900 shadow-sm focus:border-emerald-500 focus:ring-1 focus:ring-emerald-500 dark:bg-slate-950 dark:border-slate-700 dark:text-slate-100"
            placeholder="The Eras Tour"
          />
        </div>

        <div className="space-y-1 text-xs md:col-span-1">
          <label className="text-slate-700 dark:text-slate-300">
            Category
          </label>
          <select
            name="category"
            value={form.category}
            onChange={handleFieldChange}
            className="w-full rounded-md border border-slate-300 bg-white px-3 py-2 text-xs text-slate-900 shadow-sm focus:border-emerald-500 focus:ring-1 focus:ring-emerald-500 dark:bg-slate-950 dark:border-slate-700 dark:text-slate-100"
          >
            {EVENT_CATEGORIES.map((cat) => (
              <option key={cat.value} value={cat.value}>
                {cat.label}
              </option>
            ))}
          </select>
        </div>

        <div className="space-y-1 text-xs">
          <label className="text-slate-700 dark:text-slate-300">
            Base view count (e.g. 4900)
          </label>
          <input
            type="number"
            name="baseViewCount"
            value={form.baseViewCount}
            onChange={handleFieldChange}
            className="w-full rounded-md border border-slate-300 bg-white px-3 py-2 text-xs text-slate-900 shadow-sm focus:border-emerald-500 focus:ring-1 focus:ring-emerald-500 dark:bg-slate-950 dark:border-slate-700 dark:text-slate-100"
            min={0}
          />
        </div>

        <div className="space-y-1 text-xs">
          <label className="text-slate-700 dark:text-slate-300">
            Artist YouTube link
          </label>
          <input
            name="youtubeUrl"
            value={form.youtubeUrl}
            onChange={handleFieldChange}
            className="w-full rounded-md border border-slate-300 bg-white px-3 py-2 text-xs text-slate-900 shadow-sm focus:border-emerald-500 focus:ring-1 focus:ring-emerald-500 dark:bg-slate-950 dark:border-slate-700 dark:text-slate-100"
            placeholder="https://www.youtube.com/..."
          />
        </div>

        <div className="space-y-1 text-xs">
          <label className="text-slate-700 dark:text-slate-300">
            Tour start date
          </label>
          <input
            type="date"
            name="tourStartDate"
            value={form.tourStartDate}
            onChange={handleFieldChange}
            className="w-full rounded-md border border-slate-300 bg-white px-3 py-2 text-xs text-slate-900 shadow-sm focus:border-emerald-500 focus:ring-1 focus:ring-emerald-500 dark:bg-slate-950 dark:border-slate-700 dark:text-slate-100"
          />
        </div>

        <div className="space-y-1 text-xs">
          <label className="text-slate-700 dark:text-slate-300">
            Tour end date
          </label>
          <input
            type="date"
            name="tourEndDate"
            value={form.tourEndDate}
            onChange={handleFieldChange}
            className="w-full rounded-md border border-slate-300 bg-white px-3 py-2 text-xs text-slate-900 shadow-sm focus:border-emerald-500 focus:ring-1 focus:ring-emerald-500 dark:bg-slate-950 dark:border-slate-700 dark:text-slate-100"
          />
        </div>
      </div>

      {/* Event image (Cloudinary) */}
      <div className="space-y-2 text-xs">
        <label className="text-slate-700 dark:text-slate-300">
          Event image (optional)
        </label>
        <div className="flex flex-col md:flex-row md:items-center gap-3">
          <input
            type="file"
            accept="image/*"
            onChange={handleImageSelect}
            className="block w-full text-xs text-slate-700 file:mr-3 file:rounded-md file:border-0 file:bg-slate-900 file:px-3 file:py-1.5 file:text-xs file:font-medium file:text-slate-100 hover:file:bg-slate-800 dark:text-slate-300 dark:file:bg-slate-100 dark:file:text-slate-900 dark:hover:file:bg-slate-200"
          />
          {imageUploading && (
            <span className="text-[11px] text-slate-500 dark:text-slate-400">
              Uploading image to Cloudinary...
            </span>
          )}
        </div>
        {imageError && (
          <p className="text-[11px] text-red-500">{imageError}</p>
        )}

        {form.eventImageUrl && (
          <div className="mt-2 inline-flex items-center gap-3 rounded-xl border border-slate-200 bg-slate-50 p-2 dark:border-slate-700 dark:bg-slate-950">
            <img
              src={form.eventImageUrl}
              alt="Event preview"
              className="h-20 w-20 rounded-lg object-cover"
            />
            <div className="text-[11px] text-slate-600 dark:text-slate-300 max-w-xs break-all">
              <p className="font-medium mb-0.5">Current event image</p>
              <p className="truncate">{form.eventImageUrl}</p>
            </div>
          </div>
        )}
      </div>

      {/* Description */}
      <div className="space-y-1 text-xs">
        <label className="text-slate-700 dark:text-slate-300">
          Description
        </label>
        <textarea
          name="description"
          value={form.description}
          onChange={handleFieldChange}
          rows={4}
          className="w-full rounded-md border border-slate-300 bg-white px-3 py-2 text-xs text-slate-900 shadow-sm focus:border-emerald-500 focus:ring-1 focus:ring-emerald-500 dark:bg-slate-950 dark:border-slate-700 dark:text-slate-100"
          placeholder="Add a short description of the tour, support acts, vibe, etc."
        />
      </div>

      {/* Locations */}
      <div className="space-y-3">
        <div className="flex items-center justify-between">
          <h3 className="text-sm font-semibold text-slate-900 dark:text-slate-100">
            Tour locations & dates
          </h3>
          <button
            type="button"
            onClick={handleAddLocation}
            className="rounded-full bg-slate-900 px-3 py-1 text-[11px] font-medium text-slate-100 hover:bg-slate-800 dark:bg-slate-100 dark:text-slate-900 dark:hover:bg-slate-200"
          >
            + Add location
          </button>
        </div>

        <div className="space-y-3">
          {form.locations.map((loc, idx) => (
            <div
              key={loc.id}
              className="space-y-3 rounded-xl border border-slate-200 bg-slate-50 p-3 text-xs shadow-sm dark:bg-slate-950 dark:border-slate-800"
            >
              <div className="flex items-center justify-between">
                <p className="font-medium text-slate-900 dark:text-slate-100">
                  Location {idx + 1}
                </p>
                {form.locations.length > 1 && (
                  <button
                    type="button"
                    onClick={() => handleRemoveLocation(loc.id)}
                    className="text-[11px] font-medium text-red-500 hover:text-red-600 dark:text-red-400 dark:hover:text-red-300"
                  >
                    Remove
                  </button>
                )}
              </div>

              <div className="grid grid-cols-1 md:grid-cols-3 gap-3">
                <div className="space-y-1">
                  <label className="text-slate-700 dark:text-slate-300">
                    Location name
                  </label>
                  <input
                    value={loc.name}
                    onChange={(e) =>
                      handleLocationChange(loc.id, "name", e.target.value)
                    }
                    placeholder="New York, Madison Square Garden"
                    className="w-full rounded-md border border-slate-300 bg-white px-3 py-2 text-xs text-slate-900 shadow-sm focus:border-emerald-500 focus:ring-1 focus:ring-emerald-500 dark:bg-slate-950 dark:border-slate-700 dark:text-slate-100"
                  />
                </div>

                <div className="space-y-1">
                  <label className="text-slate-700 dark:text-slate-300">
                    Type (optional)
                  </label>
                  <select
                    value={loc.type}
                    onChange={(e) =>
                      handleLocationChange(loc.id, "type", e.target.value)
                    }
                    className="w-full rounded-md border border-slate-300 bg-white px-3 py-2 text-xs text-slate-900 shadow-sm focus:border-emerald-500 focus:ring-1 focus:ring-emerald-500 dark:bg-slate-950 dark:border-slate-700 dark:text-slate-100"
                  >
                    <option value="">Not specified</option>
                    <option value="event">Event</option>
                    <option value="parking">Parking</option>
                  </select>
                </div>

                <div className="space-y-1">
                  <label className="text-slate-700 dark:text-slate-300">
                    Dates for this location
                  </label>
                  <input
                    value={loc.datesText}
                    onChange={(e) =>
                      handleLocationChange(
                        loc.id,
                        "datesText",
                        e.target.value
                      )
                    }
                    placeholder="2026-05-10, 2026-05-11"
                    className="w-full rounded-md border border-slate-300 bg-white px-3 py-2 text-xs text-slate-900 shadow-sm focus:border-emerald-500 focus:ring-1 focus:ring-emerald-500 dark:bg-slate-950 dark:border-slate-700 dark:text-slate-100"
                  />
                  <p className="mt-1 text-[10px] text-slate-500 dark:text-slate-400">
                    Enter one or more dates separated by commas.
                  </p>
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>

      <button
        type="submit"
        disabled={submitting || imageUploading}
        className="rounded-full bg-emerald-600 px-4 py-2 text-xs font-medium text-white shadow-sm hover:bg-emerald-700 disabled:opacity-50 disabled:cursor-not-allowed"
      >
        {submitting || imageUploading
          ? "Saving event..."
          : "Save event"}
      </button>
    </form>
  );
}
