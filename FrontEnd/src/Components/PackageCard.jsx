import React from "react";
import PropTypes from "prop-types";

const PackageCard = ({ title, price, discount, description, onSelect }) => {
  return (
    <div className="relative shadow-lg rounded-lg hover:shadow-2xl border border-gray-300 bg-white transition-transform transform hover:-translate-y-3 p-8 text-center">
      {/* Discount Badge */}
      {discount && (
        <div className="absolute top-0 right-0 bg-red-600 text-white text-xs font-bold px-4 py-2 rounded-bl-lg">
          {discount} % OFF
        </div>
      )}

      {/* Title */}
      <h3 className="text-2xl font-bold text-gray-700 mb-4">{title}</h3>

      {/* Price */}
      <h4 className="text-3xl font-extrabold text-gray-800 mb-3"> £ {price}</h4>

      {/* Description */}
      <p className="text-gray-600 mb-8">{description}</p>

      {/* Action Button */}
      <button
        onClick={onSelect}
        className="bg-red-600 text-white font-bold py-3 px-6 rounded-md hover:bg-red-700 transition shadow-lg focus:outline-none focus:ring-2 focus:ring-red-600 focus:ring-offset-2"
        tabIndex={0}
      >
        Select {title}
      </button>
    </div>
  );
};

// Prop Validation
PackageCard.propTypes = {
  title: PropTypes.string.isRequired,
  price: PropTypes.string.isRequired,
  discount: PropTypes.string,
  description: PropTypes.string.isRequired,
  onSelect: PropTypes.func.isRequired,
};

// Default Props
PackageCard.defaultProps = {
  discount: null,
};

export default PackageCard;
