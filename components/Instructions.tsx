import React, { useState } from 'react';
import { ChevronDown, ChevronUp, Info } from 'lucide-react';

const Instructions: React.FC = () => {
  const [isExpanded, setIsExpanded] = useState(false);
  
  return (
    <div className="bg-white rounded-lg shadow-md p-6 mb-6">
      <div 
        className="flex items-center justify-between cursor-pointer" 
        onClick={() => setIsExpanded(!isExpanded)}
      >
        <h2 className="text-xl font-semibold flex items-center">
          <Info className="h-5 w-5 mr-2 text-blue-500" />
          CPR Instructions
        </h2>
        {isExpanded ? (
          <ChevronUp className="h-5 w-5 text-gray-500" />
        ) : (
          <ChevronDown className="h-5 w-5 text-gray-500" />
        )}
      </div>
      
      {isExpanded && (
        <div className="mt-4 space-y-4 text-gray-700">
          <div className="space-y-2">
            <h3 className="font-medium text-lg">Before Starting</h3>
            <ul className="list-disc pl-5 space-y-1">
              <li>Check for dangers around you and the person</li>
              <li>Check if the person is responsive by tapping their shoulders and asking if they're okay</li>
              <li>Call for emergency help (911) or ask someone else to do it</li>
              <li>Place the person on their back on a firm, flat surface</li>
            </ul>
          </div>
          
          <div className="space-y-2">
            <h3 className="font-medium text-lg">Chest Compressions</h3>
            <ul className="list-disc pl-5 space-y-1">
              <li>Place our CPR pressure sheet on the center of the person's chest</li>
              <li>Place your hands over the device, with one hand on top of the other</li>
              <li>Keep your arms straight and shoulders directly over your hands</li>
              <li>Push hard and fast, following the pressure indicators on the app</li>
              <li>Allow the chest to completely recoil between compressions</li>
              <li>Try to maintain a rate of 100-120 compressions per minute</li>
            </ul>
          </div>
          
          <div className="space-y-2">
            <h3 className="font-medium text-lg">Reading the Pressure Indicators</h3>
            <ul className="list-disc pl-5 space-y-1">
              <li><span className="text-yellow-500 font-medium">Yellow</span>: Push harder - pressure is too light</li>
              <li><span className="text-green-500 font-medium">Green</span>: Perfect pressure - maintain this level</li>
              <li><span className="text-red-500 font-medium">Red</span>: Ease up - pressure is too hard</li>
            </ul>
          </div>
          
          <div className="mt-4 bg-blue-50 p-4 rounded-lg">
            <p className="text-blue-800 font-medium">Continue CPR until emergency services arrive or the person shows signs of life.</p>
          </div>
        </div>
      )}
    </div>
  );
};

export default Instructions;