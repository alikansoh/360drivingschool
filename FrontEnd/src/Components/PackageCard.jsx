import React from 'react'

    const PackageCard = ({ title, price, discount, description, onSelect }) => {
        return (
          <div className="shadow-lg rounded-lg hover:shadow-2xl border border-gray-300 bg-white transition-transform transform hover:-translate-y-3 p-8 text-center">
            <h3 className="text-2xl font-bold text-gray-700 mb-4">{title}</h3>
            <h4 className="text-3xl font-extrabold text-gray-800 mb-3">{price}</h4>
            <p className="text-red-600 font-semibold text-lg mb-6">{discount}</p>
            <p className="text-gray-600 mb-8">{description}</p>
            <button
              onClick={onSelect}
              className="bg-red-600 text-white font-bold py-3 px-6 rounded-md hover:bg-red-700 transition shadow-lg"
            >
              Select {title}
            </button>
          </div>
        );
      };
      
      
  


export default PackageCard