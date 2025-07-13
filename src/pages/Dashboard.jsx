// src/pages/Dashboard.jsx

import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { signOut } from 'firebase/auth';
import { db, auth } from '../firebase'; 
import { useAuth } from '../context/AuthContext'; 
// Import updateDoc and increment for points system
import { doc, onSnapshot, collection, query, addDoc, deleteDoc, setDoc, updateDoc, increment } from 'firebase/firestore'; 
import { 
  FiUser, 
  FiBox, 
  FiShoppingCart, 
  FiLogOut, 
  FiSettings, 
  FiKey, 
  FiBell, 
  FiTrash2, 
  FiPlus, 
  FiX, 
  FiLoader 
} from "react-icons/fi";
import { toast } from 'react-toastify';

// Modal Component (corrected class names for background opacity and blur)
const Modal = ({ title, children, onClose }) => (
  // Corrected: Ensure valid Tailwind CSS classes for the overlay background.
  <div className="fixed inset-0 bg-black/50 backdrop-blur-sm flex justify-center items-center z-[9999] p-4">
    <div className="bg-[#2E4A4E] text-white rounded-xl shadow-2xl p-6 w-full max-w-md relative">
      <h3 className="text-xl font-bold mb-4">{title}</h3>
      <button onClick={onClose} className="absolute top-3 right-3 text-gray-400 hover:text-white">
        <FiX size={24} />
      </button>
      {children}
    </div>
  </div>
);

const Dashboard = () => {
  const { currentUser } = useAuth();
  const navigate = useNavigate();
  const [userProfile, setUserProfile] = useState(null);
  const [purchases, setPurchases] = useState([]);
  const [listings, setListings] = useState([]);
  const [modal, setModal] = useState(null); // 'addListing' or 'addPurchase'
  const [newListingForm, setNewListingForm] = useState({ title: '', description: '', price: '', condition: 'good' });
  const [newPurchaseForm, setNewPurchaseForm] = useState({ title: '', price: '' });
  const [loadingListings, setLoadingListings] = useState(true);
  const [loadingPurchases, setLoadingPurchases] = useState(true);

  // 1. Fetch User Profile and Points
  useEffect(() => {
    if (currentUser) {
      const userDocRef = doc(db, 'users', currentUser.uid);
      
      const unsubscribe = onSnapshot(userDocRef, (docSnap) => {
        if (docSnap.exists()) {
          const data = docSnap.data();
          setUserProfile({
            ...data,
            points: data.points || 0
          });
        } else {
          // If the user document doesn't exist, create it with a default profile
          setDoc(userDocRef, { 
            email: currentUser.email, 
            displayName: currentUser.displayName || 'User',
            points: 0,
            createdAt: new Date(),
            role: 'user'
          });
          setUserProfile({ email: currentUser.email, displayName: currentUser.displayName || 'User', points: 0 });
        }
      });

      return () => unsubscribe();
    }
  }, [currentUser]);

  // 2. Fetch Listings (Recycled Items for Sale)
  useEffect(() => {
    const fetchListings = async () => {
      setLoadingListings(true);
      try {
        if (currentUser) {
          const listingsCollectionRef = collection(db, `users/${currentUser.uid}/listings`);
          const q = query(listingsCollectionRef);
          
          const unsubscribe = onSnapshot(q, (querySnapshot) => {
            const items = querySnapshot.docs.map(doc => ({
              id: doc.id,
              ...doc.data()
            }));
            setListings(items);
            setLoadingListings(false);
          });
          
          return () => unsubscribe();
        }
      } catch (error) {
        console.error("Error fetching listings:", error);
        toast.error("Failed to fetch listings.");
        setLoadingListings(false);
      }
    };

    fetchListings();
  }, [currentUser]);

  // 3. Fetch Purchases (Recycled Items Purchased)
  useEffect(() => {
    const fetchPurchases = async () => {
      setLoadingPurchases(true);
      try {
        if (currentUser) {
          const purchasesCollectionRef = collection(db, `users/${currentUser.uid}/purchases`);
          const q = query(purchasesCollectionRef);
          
          const unsubscribe = onSnapshot(q, (querySnapshot) => {
            const items = querySnapshot.docs.map(doc => ({
              id: doc.id,
              ...doc.data()
            }));
            setPurchases(items);
            setLoadingPurchases(false);
          });
          
          return () => unsubscribe();
        }
      } catch (error) {
        console.error("Error fetching purchases:", error);
        toast.error("Failed to fetch purchases.");
        setLoadingPurchases(false);
      }
    };

    fetchPurchases();
  }, [currentUser]);

  const handleLogout = async () => {
    try {
      await signOut(auth);
      toast.success("Logged out successfully!");
      navigate('/login');
    } catch (error) {
      toast.error("Failed to log out.");
      console.error("Logout error:", error);
    }
  };

  const openModal = (type) => {
    setModal(type);
  };

  const closeModal = () => {
    setModal(null);
    setNewListingForm({ title: '', description: '', price: '', condition: 'good' });
    setNewPurchaseForm({ title: '', price: '' });
  };

  const handleAddListing = async (e) => {
    e.preventDefault();
    try {
      const listingData = {
        ...newListingForm,
        createdAt: new Date(),
        // Add points based on condition (example logic)
        pointsEarned: newListingForm.condition === 'good' ? 100 : 50,
      };

      // Add listing to the user's specific listings subcollection
      const listingsCollectionRef = collection(db, `users/${currentUser.uid}/listings`);
      await addDoc(listingsCollectionRef, listingData);
      
      // Update user's points
      const userDocRef = doc(db, 'users', currentUser.uid);
      await updateDoc(userDocRef, {
        points: increment(listingData.pointsEarned)
      });

      toast.success('Listing added and points awarded!');
      closeModal();
    } catch (error) {
      console.error("Error adding listing:", error);
      toast.error(`Failed to add listing: ${error.message}`);
    }
  };

  const handleAddPurchase = async (e) => {
    e.preventDefault();
    try {
      const purchaseData = {
        ...newPurchaseForm,
        createdAt: new Date(),
      };
      
      // Add purchase to the user's specific purchases subcollection
      const purchasesCollectionRef = collection(db, `users/${currentUser.uid}/purchases`);
      await addDoc(purchasesCollectionRef, purchaseData);
      
      toast.success('Purchase recorded!');
      closeModal();
    } catch (error) {
      console.error("Error adding purchase:", error);
      toast.error(`Failed to record purchase: ${error.message}`);
    }
  };

  const handleDeleteListing = async (listingId) => {
    try {
      const listingDocRef = doc(db, `users/${currentUser.uid}/listings`, listingId);
      await deleteDoc(listingDocRef);
      toast.success('Listing deleted!');
    } catch (error) {
      console.error("Error deleting listing:", error);
      toast.error("Failed to delete listing.");
    }
  };

  const handleDeletePurchase = async (purchaseId) => {
    try {
      const purchaseDocRef = doc(db, `users/${currentUser.uid}/purchases`, purchaseId);
      await deleteDoc(purchaseDocRef);
      toast.success('Purchase deleted!');
    } catch (error) {
      console.error("Error deleting purchase:", error);
      toast.error("Failed to delete purchase.");
    }
  };

  if (!currentUser) {
    // If not authenticated, we should rely on AuthContext or PrivateRoute to redirect.
    // If this component renders without a user, it indicates a routing issue or AuthContext loading.
    return (
      <div className="flex items-center justify-center min-h-screen">
        <FiLoader className="animate-spin text-4xl text-white" />
        <p className="text-white ml-4">Loading user data...</p>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-[#22333B] text-white p-6">
      <ToastContainer position="bottom-right" autoClose={5000} />
      
      <header className="flex justify-between items-center mb-10">
        <h1 className="text-4xl font-extrabold text-[#95C29C]">REWARE Dashboard</h1>
        <div className="flex items-center space-x-6">
          <div className="flex items-center bg-[#2E4A4E] rounded-full p-2 pr-4 shadow-lg">
            <FiUser className="text-[#95C29C] text-2xl mr-3" />
            <span className="text-sm font-medium">{userProfile?.displayName || 'User'}</span>
          </div>
          <button 
            onClick={handleLogout} 
            className="text-red-400 hover:text-red-600 transition-colors flex items-center"
          >
            <FiLogOut className="mr-2" />
            Logout
          </button>
        </div>
      </header>

      <section className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-10">
        <div className="bg-[#2E4A4E] rounded-xl shadow-2xl p-6 flex items-center justify-between transition-transform transform hover:scale-105">
          <div>
            <h2 className="text-xl font-semibold text-[#95C29C]">Total Points</h2>
            <p className="text-4xl font-bold mt-2">{userProfile?.points}</p>
          </div>
          <FiKey className="text-5xl text-gray-600 opacity-30" />
        </div>
        
        <div className="bg-[#2E4A4E] rounded-xl shadow-2xl p-6 flex items-center justify-between transition-transform transform hover:scale-105">
          <div>
            <h2 className="text-xl font-semibold text-[#95C29C]">Items Listed</h2>
            <p className="text-4xl font-bold mt-2">{listings.length}</p>
          </div>
          <FiBox className="text-5xl text-gray-600 opacity-30" />
        </div>

        <div className="bg-[#2E4A4E] rounded-xl shadow-2xl p-6 flex items-center justify-between transition-transform transform hover:scale-105">
          <div>
            <h2 className="text-xl font-semibold text-[#95C29C]">Purchases</h2>
            <p className="text-4xl font-bold mt-2">{purchases.length}</p>
          </div>
          <FiShoppingCart className="text-5xl text-gray-600 opacity-30" />
        </div>
      </section>

      {/* Action Buttons */}
      <section className="mb-10 flex space-x-4">
        <button 
          onClick={() => openModal('addListing')} 
          className="bg-[#95C29C] text-gray-900 font-bold py-3 px-6 rounded-lg hover:bg-[#72A676] transition-colors shadow-lg flex items-center"
        >
          <FiPlus className="mr-2" /> Add Listing
        </button>
        <button 
          onClick={() => openModal('addPurchase')} 
          className="bg-[#6B8E23] text-white font-bold py-3 px-6 rounded-lg hover:bg-[#5A741E] transition-colors shadow-lg flex items-center"
        >
          <FiShoppingCart className="mr-2" /> Add Purchase
        </button>
      </section>

      {/* Listings and Purchases Tables */}
      <section className="grid grid-cols-1 lg:grid-cols-2 gap-8">
        
        {/* Listings Table */}
        <div className="bg-[#1E2B2F] rounded-xl shadow-2xl p-6">
          <h3 className="text-2xl font-bold mb-6 text-[#95C29C]">Your Listings (Recycled Items)</h3>
          {loadingListings ? (
            <div className="flex justify-center py-10"><FiLoader className="animate-spin text-4xl text-[#95C29C]" /></div>
          ) : listings.length === 0 ? (
            <p className="text-gray-400">You have no listings yet.</p>
          ) : (
            <div className="overflow-x-auto">
              <table className="min-w-full divide-y divide-gray-700">
                <thead>
                  <tr>
                    <th className="py-3 px-4 text-left text-xs font-semibold uppercase text-gray-400">Title</th>
                    <th className="py-3 px-4 text-left text-xs font-semibold uppercase text-gray-400">Points</th>
                    <th className="py-3 px-4 text-left text-xs font-semibold uppercase text-gray-400">Actions</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-gray-800">
                  {listings.map((listing) => (
                    <tr key={listing.id} className="hover:bg-[#2E4A4E]">
                      <td className="py-4 px-4 font-medium">{listing.title}</td>
                      <td className="py-4 px-4 text-[#95C29C]">{listing.pointsEarned}</td>
                      <td className="py-4 px-4">
                        <button onClick={() => handleDeleteListing(listing.id)} className="text-red-400 hover:text-red-600">
                          <FiTrash2 />
                        </button>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          )}
        </div>

        {/* Purchases Table */}
        <div className="bg-[#1E2B2F] rounded-xl shadow-2xl p-6">
          <h3 className="text-2xl font-bold mb-6 text-[#95C29C]">Your Purchases</h3>
          {loadingPurchases ? (
            <div className="flex justify-center py-10"><FiLoader className="animate-spin text-4xl text-[#95C29C]" /></div>
          ) : purchases.length === 0 ? (
            <p className="text-gray-400">You have not recorded any purchases yet.</p>
          ) : (
            <div className="overflow-x-auto">
              <table className="min-w-full divide-y divide-gray-700">
                <thead>
                  <tr>
                    <th className="py-3 px-4 text-left text-xs font-semibold uppercase text-gray-400">Title</th>
                    <th className="py-3 px-4 text-left text-xs font-semibold uppercase text-gray-400">Price</th>
                    <th className="py-3 px-4 text-left text-xs font-semibold uppercase text-gray-400">Actions</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-gray-800">
                  {purchases.map((purchase) => (
                    <tr key={purchase.id} className="hover:bg-[#2E4A4E]">
                      <td className="py-4 px-4 font-medium">{purchase.title}</td>
                      <td className="py-4 px-4 text-[#95C29C]">${purchase.price}</td>
                      <td className="py-4 px-4">
                        <button onClick={() => handleDeletePurchase(purchase.id)} className="text-red-400 hover:text-red-600">
                          <FiTrash2 />
                        </button>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          )}
        </div>

      </section>

      {/* Modals */}
      {modal === 'addListing' && (
        <Modal title="Add New Listing" onClose={closeModal}>
          <form onSubmit={handleAddListing} className="space-y-4">
            <div>
              <label className="block text-sm font-medium text-white/70">Title</label>
              <input 
                type="text" 
                name="title" 
                value={newListingForm.title} 
                onChange={(e) => setNewListingForm({ ...newListingForm, title: e.target.value })} 
                className="mt-1 block w-full rounded-md border-gray-300 shadow-sm p-2 bg-gray-700 text-white" 
                required 
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-white/70">Description</label>
              <textarea 
                name="description" 
                value={newListingForm.description} 
                onChange={(e) => setNewListingForm({ ...newListingForm, description: e.target.value })} 
                className="mt-1 block w-full rounded-md border-gray-300 shadow-sm p-2 bg-gray-700 text-white" 
                required 
              ></textarea>
            </div>
            <div>
              <label className="block text-sm font-medium text-white/70">Price</label>
              <input 
                type="text" 
                name="price" 
                value={newListingForm.price} 
                onChange={(e) => setNewListingForm({ ...newListingForm, price: e.target.value })} 
                className="mt-1 block w-full rounded-md border-gray-300 shadow-sm p-2 bg-gray-700 text-white" 
                required 
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-white/70">Condition</label>
              <select 
                name="condition" 
                value={newListingForm.condition} 
                onChange={(e) => setNewListingForm({ ...newListingForm, condition: e.target.value })}
                className="mt-1 block w-full rounded-md border-gray-300 shadow-sm p-2 bg-gray-700 text-white"
              >
                <option value="good">Good</option>
                <option value="fair">Fair</option>
                <option value="poor">Poor</option>
              </select>
            </div>
            <button type="submit" className="w-full bg-green-600 hover:bg-green-700 text-white py-2 rounded-md transition-all">Add Listing</button>
          </form>
        </Modal>
      )}

      {modal === 'addPurchase' && (
        <Modal title="Add New Purchase" onClose={closeModal}>
          <form onSubmit={handleAddPurchase} className="space-y-4">
            <div>
              <label className="block text-sm font-medium text-white/70">Title</label>
              <input 
                type="text" 
                name="title" 
                value={newPurchaseForm.title} 
                onChange={(e) => setNewPurchaseForm({ ...newPurchaseForm, title: e.target.value })} 
                className="mt-1 block w-full rounded-md border-gray-300 shadow-sm p-2 bg-gray-700 text-white" 
                required 
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-white/70">Price</label>
              <input 
                type="text" 
                name="price" 
                value={newPurchaseForm.price} 
                onChange={(e) => setNewPurchaseForm({ ...newPurchaseForm, price: e.target.value })} 
                className="mt-1 block w-full rounded-md border-gray-300 shadow-sm p-2 bg-gray-700 text-white" 
                required 
              />
            </div>
            <button type="submit" className="w-full bg-blue-600 hover:bg-blue-700 text-white py-2 rounded-md transition-all">Add Purchase</button>
          </form>
        </Modal>
      )}
    </div>
  );
};

export default Dashboard;