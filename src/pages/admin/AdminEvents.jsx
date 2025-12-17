// // src/pages/admin/AdminEvents.jsx
// import { useEffect, useState } from "react";
// import { db } from "../../lib/firebase";
// import {
//   collection,
//   addDoc,
//   getDocs,
//   updateDoc,
//   deleteDoc,
//   doc,
//   serverTimestamp,
// } from "firebase/firestore";
// import AdminEventForm from "../../components/AdminEventForm";
// import { getCategoryLabel } from "../../constants/eventCategories";

// export default function AdminEvents() {
//   const [events, setEvents] = useState([]);
//   const [editing, setEditing] = useState(null);
//   const [loading, setLoading] = useState(true);
//   const [saving, setSaving] = useState(false);
//   // used only to force-reset AdminEventForm after create / edit
//   const [formKey, setFormKey] = useState(0);

//   useEffect(() => {
//     const fetchEvents = async () => {
//       const snap = await getDocs(collection(db, "events"));
//       const list = snap.docs.map((d) => ({ id: d.id, ...d.data() }));
//       setEvents(list);
//       setLoading(false);
//     };
//     fetchEvents();
//   }, []);

//   const handleCreate = async (data) => {
//     setSaving(true);
//     try {
//       const docRef = await addDoc(collection(db, "events"), {
//         ...data,
//         createdAt: serverTimestamp(),
//         updatedAt: serverTimestamp(),
//       });

//       setEvents((prev) => [...prev, { id: docRef.id, ...data }]);
//       // ensure we're in "create" mode and clear form
//       setEditing(null);
//       setFormKey((k) => k + 1); // 🔁 remounts AdminEventForm → clears fields
//     } finally {
//       setSaving(false);
//     }
//   };

//   const handleUpdate = async (data) => {
//     if (!editing) return;
//     setSaving(true);
//     const ref = doc(db, "events", editing.id);

//     try {
//       await updateDoc(ref, {
//         ...data,
//         updatedAt: serverTimestamp(),
//       });

//       setEvents((prev) =>
//         prev.map((e) => (e.id === editing.id ? { ...e, ...data } : e))
//       );
//       // go back to "add new" mode and clear fields
//       setEditing(null);
//       setFormKey((k) => k + 1); // 🔁 reset form
//     } finally {
//       setSaving(false);
//     }
//   };

//   const handleDelete = async (id) => {
//     if (!window.confirm("Delete this event and all its listings?")) return;
//     await deleteDoc(doc(db, "events", id));
//     setEvents((prev) => prev.filter((e) => e.id !== id));
//     // if we were editing this event, also reset the form
//     setEditing((prev) => {
//       if (prev && prev.id === id) {
//         setFormKey((k) => k + 1);
//         return null;
//       }
//       return prev;
//     });
//   };

//   const startEditing = (event) => {
//     setEditing(event);
//     setFormKey((k) => k + 1); // ensures form re-mounts with this event's data
//   };

//   return (
//     <div className="max-w-6xl mx-auto px-4 py-8 space-y-8">
//       <h1 className="text-2xl font-semibold mb-4 text-slate-900 dark:text-slate-50">
//         Admin – Events
//       </h1>

//       {/* Form */}
//       <section className="bg-white border border-slate-200 rounded-2xl p-4 shadow-sm dark:bg-slate-900 dark:border-slate-800">
//         <h2 className="text-sm font-semibold mb-4 text-slate-900 dark:text-slate-100">
//           {editing ? "Edit event" : "Add new event / tour"}
//         </h2>

//         <AdminEventForm
//           key={formKey}                 // 🔁 forces reset when key changes
//           initial={editing || {}}
//           onSubmit={editing ? handleUpdate : handleCreate}
//           submitting={saving}
//         />
//       </section>

//       {/* List */}
//       <section>
//         <h2 className="text-sm font-semibold mb-3 text-slate-900 dark:text-slate-100">
//           All events
//         </h2>
//         {loading ? (
//           <p className="text-xs text-slate-500 dark:text-slate-400">
//             Loading events...
//           </p>
//         ) : events.length === 0 ? (
//           <p className="text-xs text-slate-500 dark:text-slate-400">
//             No events added yet.
//           </p>
//         ) : (
//           <div className="space-y-2">
//             {events.map((event) => (
//               <div
//                 key={event.id}
//                 className="bg-white border border-slate-200 rounded-xl px-4 py-3 flex items-center justify-between text-xs shadow-sm dark:bg-slate-900 dark:border-slate-800"
//               >
//                 <div className="space-y-1">
//                   <p className="font-medium text-slate-900 dark:text-slate-100">
//                     {event.artistName} — {event.eventName}
//                   </p>
//                   <p className="text-slate-500 dark:text-slate-400">
//                     {getCategoryLabel(event.category)} · Locations:{" "}
//                     {Array.isArray(event.locations)
//                       ? event.locations.length
//                       : 0}{" "}
//                     · Views base: {event.baseViewCount || 0}
//                   </p>
//                   {event.tourStartDate && event.tourEndDate && (
//                     <p className="text-[11px] text-slate-500 dark:text-slate-400">
//                       Tour: {event.tourStartDate} → {event.tourEndDate}
//                     </p>
//                   )}
//                 </div>

//                 <div className="flex gap-2">
//                   <button
//                     type="button"
//                     onClick={() => startEditing(event)}
//                     className="px-3 py-1 rounded-full bg-slate-100 text-slate-800 hover:bg-slate-200 dark:bg-slate-800 dark:text-slate-100 dark:hover:bg-slate-700"
//                   >
//                     Edit
//                   </button>
//                   <button
//                     type="button"
//                     onClick={() => handleDelete(event.id)}
//                     className="px-3 py-1 rounded-full bg-red-600 text-white hover:bg-red-700"
//                   >
//                     Delete
//                   </button>
//                 </div>
//               </div>
//             ))}
//           </div>
//         )}
//       </section>
//     </div>
//   );
// }























































// src/pages/admin/AdminEvents.jsx
import { useEffect, useState } from "react";
import { db } from "../../lib/firebase";
import {
  collection,
  addDoc,
  getDocs,
  updateDoc,
  deleteDoc,
  doc,
  serverTimestamp,
} from "firebase/firestore";
import AdminEventForm from "../../components/AdminEventForm";
import { getCategoryLabel } from "../../constants/eventCategories";

export default function AdminEvents() {
  const [events, setEvents] = useState([]);
  const [editing, setEditing] = useState(null);
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  // used only to force-reset AdminEventForm after create / edit
  const [formKey, setFormKey] = useState(0);

  useEffect(() => {
    const fetchEvents = async () => {
      const snap = await getDocs(collection(db, "events"));
      const list = snap.docs.map((d) => ({ id: d.id, ...d.data() }));
      setEvents(list);
      setLoading(false);
    };
    fetchEvents();
  }, []);

  const handleCreate = async (data) => {
    setSaving(true);
    try {
      const docRef = await addDoc(collection(db, "events"), {
        ...data,
        createdAt: serverTimestamp(),
        updatedAt: serverTimestamp(),
      });

      setEvents((prev) => [...prev, { id: docRef.id, ...data }]);
      // ensure we're in "create" mode and clear form
      setEditing(null);
      setFormKey((k) => k + 1); // 🔁 remounts AdminEventForm → clears fields
    } finally {
      setSaving(false);
    }
  };

  const handleUpdate = async (data) => {
    if (!editing) return;
    setSaving(true);
    const ref = doc(db, "events", editing.id);

    try {
      await updateDoc(ref, {
        ...data,
        updatedAt: serverTimestamp(),
      });

      setEvents((prev) =>
        prev.map((e) => (e.id === editing.id ? { ...e, ...data } : e))
      );
      // go back to "add new" mode and clear fields
      setEditing(null);
      setFormKey((k) => k + 1); // 🔁 reset form
    } finally {
      setSaving(false);
    }
  };

  const handleDelete = async (id) => {
    if (!window.confirm("Delete this event and all its listings?")) return;
    await deleteDoc(doc(db, "events", id));
    setEvents((prev) => prev.filter((e) => e.id !== id));
    // if we were editing this event, also reset the form
    setEditing((prev) => {
      if (prev && prev.id === id) {
        setFormKey((k) => k + 1);
        return null;
      }
      return prev;
    });
  };

  const startEditing = (event) => {
    setEditing(event);
    setFormKey((k) => k + 1); // ensures form re-mounts with this event's data
  };

  return (
    <div className="max-w-6xl mx-auto px-4 py-8 space-y-8">
      {/* Header */}
      <header className="flex flex-col md:flex-row md:items-center md:justify-between gap-2">
        <div>
          <h1 className="text-2xl font-semibold text-slate-900 dark:text-slate-50">
            Admin – Events
          </h1>
          <p className="text-xs text-slate-500 dark:text-slate-400 mt-1">
            Create, edit, and manage all events and tours shown to fans.
          </p>
        </div>
        {events.length > 0 && (
          <p className="text-[11px] text-slate-500 dark:text-slate-400">
            Total events:{" "}
            <span className="font-semibold text-slate-800 dark:text-slate-100">
              {events.length}
            </span>
          </p>
        )}
      </header>

      {/* Form */}
      <section className="bg-white border border-slate-200 rounded-2xl p-4 shadow-sm dark:bg-slate-900 dark:border-slate-800">
        <div className="flex items-center justify-between mb-4">
          <h2 className="text-sm font-semibold text-slate-900 dark:text-slate-100">
            {editing ? "Edit event" : "Add new event / tour"}
          </h2>
          {editing && (
            <span className="inline-flex items-center rounded-full bg-amber-50 px-2 py-0.5 text-[11px] font-medium text-amber-700 border border-amber-200 dark:bg-amber-900/20 dark:text-amber-200 dark:border-amber-800">
              Editing: {editing.artistName} — {editing.eventName}
            </span>
          )}
        </div>

        <AdminEventForm
          key={formKey} // 🔁 forces reset when key changes
          initial={editing || {}}
          onSubmit={editing ? handleUpdate : handleCreate}
          submitting={saving}
        />
      </section>

      {/* List */}
      <section>
        <h2 className="text-sm font-semibold mb-3 text-slate-900 dark:text-slate-100">
          All events
        </h2>
        {loading ? (
          <p className="text-xs text-slate-500 dark:text-slate-400">
            Loading events...
          </p>
        ) : events.length === 0 ? (
          <p className="text-xs text-slate-500 dark:text-slate-400">
            No events added yet. Use the form above to create your first
            event.
          </p>
        ) : (
          <div className="space-y-2">
            {events.map((event) => (
              <div
                key={event.id}
                className="bg-white border border-slate-200 rounded-xl px-4 py-3 flex items-center justify-between text-xs shadow-sm dark:bg-slate-900 dark:border-slate-800"
              >
                <div className="space-y-1">
                  <p className="font-medium text-slate-900 dark:text-slate-100">
                    {event.artistName} — {event.eventName}
                  </p>
                  <p className="text-slate-500 dark:text-slate-400">
                    {getCategoryLabel(event.category)} · Locations:{" "}
                    {Array.isArray(event.locations)
                      ? event.locations.length
                      : 0}{" "}
                    · Views base: {event.baseViewCount || 0}
                  </p>
                  {event.tourStartDate && event.tourEndDate && (
                    <p className="text-[11px] text-slate-500 dark:text-slate-400">
                      Tour: {event.tourStartDate} → {event.tourEndDate}
                    </p>
                  )}
                </div>

                <div className="flex gap-2">
                  <button
                    type="button"
                    onClick={() => startEditing(event)}
                    className="px-3 py-1 rounded-full bg-slate-100 text-slate-800 hover:bg-slate-200 text-[11px] font-medium dark:bg-slate-800 dark:text-slate-100 dark:hover:bg-slate-700"
                  >
                    Edit
                  </button>
                  <button
                    type="button"
                    onClick={() => handleDelete(event.id)}
                    className="px-3 py-1 rounded-full bg-red-600 text-white hover:bg-red-700 text-[11px] font-medium"
                  >
                    Delete
                  </button>
                </div>
              </div>
            ))}
          </div>
        )}
      </section>
    </div>
  );
}
