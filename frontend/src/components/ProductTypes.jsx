import { useParams, Link } from 'react-router-dom';

const ProductTypes = () => {
  const { productId } = useParams();

  // Mock data mapping via dynamic category IDs incoming from Home
  const productVariantsData = {
    "1": {
      parentName: "Air Conditioners",
      types: [
        { id: "lg-5star-split", name: "LG 1.5 Ton 5 Star Inverter Split AC", specs: "Copper Condenser, Convertible 5-in-1", price: "₹45,000", image: "https://via.placeholder.com/400x300?text=LG+5+Star+Split" },
        { id: "lg-3star-split", name: "LG 1.5 Ton 3 Star Inverter Split AC", specs: "Dual Inverter, HD Filter with Anti-Virus Protection", price: "₹38,500", image: "https://via.placeholder.com/400x300?text=LG+3+Star+Split" },
        { id: "lg-5star-window", name: "LG 1.5 Ton 5 Star Window AC", specs: "Dual Inverter, Clean Air Filter", price: "₹36,000", image: "https://via.placeholder.com/400x300?text=LG+Window+AC" }
      ]
    },
    "2": {
      parentName: "Refrigerators",
      types: [
        { id: "sam-double-door", name: "Samsung 253L 3 Star Double Door Refrigerator", specs: "Digital Inverter, Frost Free", price: "₹24,500", image: "https://via.placeholder.com/400x300?text=Samsung+Double+Door" },
        { id: "sam-curd-maestro", name: "Samsung 253L Curd Maestro Double Door", specs: "Make curd easily, Convertible 5-in-1", price: "₹28,990", image: "https://via.placeholder.com/400x300?text=Curd+Maestro" }
      ]
    },
    "3": {
      parentName: "Washing Machines",
      types: [
        { id: "bosch-front-load", name: "Bosch 7kg 5 Star Front Load Machine", specs: "EcoSilence Drive, AntiTangle Feature", price: "₹29,990", image: "https://via.placeholder.com/400x300?text=Bosch+Front+Load" },
        { id: "bosch-top-load", name: "Bosch 7kg Fully Automatic Top Load", specs: "PowerWave Wash System, Soft Closing Lid", price: "₹18,490", image: "https://via.placeholder.com/400x300?text=Bosch+Top+Load" }
      ]
    },
    "4": {
      parentName: "Microwaves",
      types: [
        { id: "bajaj-solo", name: "Bajaj 17L Solo Microwave Oven", specs: "Mechanical Knobs, 5 Power Levels", price: "₹5,299", image: "https://via.placeholder.com/400x300?text=Bajaj+Solo" },
        { id: "bajaj-grill", name: "Bajaj 17L Grill Microwave Oven", specs: "Tact-key controls, Auto Cook Menus", price: "₹7,499", image: "https://via.placeholder.com/400x300?text=Bajaj+Grill" }
      ]
    }
  };

  // Fallback pattern if category data index is empty or matches outer categories
  const currentProduct = productVariantsData[productId] || productVariantsData["1"];

  return (
    <div className="bg-gray-50 min-h-screen py-12">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        
        {/* Page Header */}
        <div className="mb-10 text-center md:text-left">
          <span className="text-blue-600 font-bold uppercase tracking-wider text-sm">Categories & Variants</span>
          <h1 className="text-3xl md:text-4xl font-extrabold text-gray-900 mt-1">
            Explore Types of {currentProduct.parentName}
          </h1>
          <p className="text-gray-500 mt-2">Select the perfect type or model variant that suits your requirement.</p>
        </div>

        {/* Types Grid Layout */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
          {currentProduct.types.map((type) => (
            <div key={type.id} className="group bg-white rounded-2xl overflow-hidden border border-gray-100 hover:shadow-xl transition-all duration-300 flex flex-col h-full">
              
              {/* Image box */}
              <div className="h-56 bg-gray-50 p-6 flex items-center justify-center overflow-hidden relative">
                <img 
                  src={type.image} 
                  alt={type.name} 
                  className="max-h-full object-contain group-hover:scale-105 transition-transform duration-500" 
                />
              </div>

              {/* Text Area */}
              <div className="p-6 flex flex-col flex-grow">
                <h3 className="text-xl font-bold text-gray-900 mb-2 leading-snug group-hover:text-blue-600 transition-colors">
                  {type.name}
                </h3>
                <p className="text-gray-500 text-sm mb-6 flex-grow">{type.specs}</p>
                
                {/* Final Click to Details Page */}
                <div className="pt-4 border-t border-gray-100 mt-auto">
                  <Link 
                    to={`/product-detail/${type.id}`}
                    className="w-full bg-gray-950 hover:bg-blue-600 text-white font-bold py-3 px-4 rounded-xl flex items-center justify-center gap-2 transition-all duration-300"
                  >
                    <span>View Specifications</span>
                    <svg className="w-4 h-4 transition-transform group-hover:translate-x-1" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M14 5l7 7m0 0l-7 7m7-7H3" />
                    </svg>
                  </Link>
                </div>
              </div>

            </div>
          ))}
        </div>

      </div>
    </div>
  );
};

export default ProductTypes;