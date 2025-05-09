import React from 'react';
import { Heart } from 'lucide-react';

interface HeaderProps {
  title?: string;
}

const Header: React.FC<HeaderProps> = ({ title = 'CPR Assistant' }) => {
  return (
    <header className="bg-white shadow-md py-4 px-6 flex items-center justify-between">
      <div className="flex items-center space-x-2">
        <Heart className="text-red-500 h-8 w-8" />
        <h1 className="text-xl font-bold text-gray-800">{title}</h1>
      </div>
      <button 
        className="bg-red-500 hover:bg-red-600 text-white px-4 py-2 rounded-lg flex items-center space-x-2 transition-colors"
        onClick={() => {
          const tel = 'tel:911';
          window.open(tel);
        }}
      >
        <span>Emergency</span>
      </button>
    </header>
  );
};

export default Header;