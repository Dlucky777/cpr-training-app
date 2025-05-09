import React, { useState, useEffect } from 'react';
import { Phone, Plus, X } from 'lucide-react';
import { EmergencyContact } from '../types';

const EmergencyContacts: React.FC = () => {
  const [contacts, setContacts] = useState<EmergencyContact[]>([]);
  const [showAddForm, setShowAddForm] = useState(false);
  const [newName, setNewName] = useState('');
  const [newPhone, setNewPhone] = useState('');
  
  // Load contacts from localStorage
  useEffect(() => {
    const savedContacts = localStorage.getItem('emergencyContacts');
    if (savedContacts) {
      try {
        setContacts(JSON.parse(savedContacts));
      } catch (e) {
        console.error('Failed to load contacts:', e);
      }
    }
  }, []);
  
  // Save contacts to localStorage
  useEffect(() => {
    localStorage.setItem('emergencyContacts', JSON.stringify(contacts));
  }, [contacts]);
  
  const addContact = () => {
    if (newName.trim() && newPhone.trim()) {
      const newContact: EmergencyContact = {
        id: Date.now().toString(),
        name: newName.trim(),
        phoneNumber: newPhone.trim()
      };
      
      setContacts([...contacts, newContact]);
      setNewName('');
      setNewPhone('');
      setShowAddForm(false);
    }
  };
  
  const removeContact = (id: string) => {
    setContacts(contacts.filter(contact => contact.id !== id));
  };
  
  const callContact = (phoneNumber: string) => {
    window.open(`tel:${phoneNumber}`);
  };
  
  return (
    <div className="bg-white rounded-lg shadow-md p-6 mb-6">
      <div className="flex justify-between items-center mb-4">
        <h2 className="text-xl font-semibold">Emergency Contacts</h2>
        {!showAddForm && (
          <button 
            onClick={() => setShowAddForm(true)}
            className="text-blue-600 flex items-center text-sm"
          >
            <Plus className="h-4 w-4 mr-1" />
            Add Contact
          </button>
        )}
      </div>
      
      {showAddForm && (
        <div className="mb-4 p-4 bg-gray-50 rounded-lg">
          <div className="grid grid-cols-1 gap-3">
            <div>
              <label htmlFor="name" className="block text-sm font-medium text-gray-700 mb-1">
                Name
              </label>
              <input
                type="text"
                id="name"
                value={newName}
                onChange={(e) => setNewName(e.target.value)}
                className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                placeholder="Enter name"
              />
            </div>
            
            <div>
              <label htmlFor="phone" className="block text-sm font-medium text-gray-700 mb-1">
                Phone Number
              </label>
              <input
                type="tel"
                id="phone"
                value={newPhone}
                onChange={(e) => setNewPhone(e.target.value)}
                className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                placeholder="Enter phone number"
              />
            </div>
            
            <div className="flex space-x-2 mt-1">
              <button
                onClick={addContact}
                className="bg-blue-600 text-white px-4 py-2 rounded-md hover:bg-blue-700 transition-colors"
              >
                Save
              </button>
              <button
                onClick={() => setShowAddForm(false)}
                className="bg-gray-200 text-gray-800 px-4 py-2 rounded-md hover:bg-gray-300 transition-colors"
              >
                Cancel
              </button>
            </div>
          </div>
        </div>
      )}
      
      {contacts.length === 0 ? (
        <p className="text-gray-500 text-center py-4">No emergency contacts added yet.</p>
      ) : (
        <ul className="divide-y divide-gray-200">
          {contacts.map((contact) => (
            <li key={contact.id} className="py-3 flex justify-between items-center">
              <div>
                <h3 className="font-medium">{contact.name}</h3>
                <p className="text-gray-600 text-sm">{contact.phoneNumber}</p>
              </div>
              <div className="flex space-x-2">
                <button
                  onClick={() => callContact(contact.phoneNumber)}
                  className="bg-green-100 text-green-700 p-2 rounded-full hover:bg-green-200 transition-colors"
                >
                  <Phone className="h-4 w-4" />
                </button>
                <button
                  onClick={() => removeContact(contact.id)}
                  className="bg-red-100 text-red-700 p-2 rounded-full hover:bg-red-200 transition-colors"
                >
                  <X className="h-4 w-4" />
                </button>
              </div>
            </li>
          ))}
        </ul>
      )}
    </div>
  );
};

export default EmergencyContacts;