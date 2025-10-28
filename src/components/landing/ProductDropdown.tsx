import { useState, useRef, useEffect } from 'react';
import { ChevronDown, Package } from 'lucide-react';
import { useNavigate } from 'react-router-dom';

export default function ProductDropdown() {
  const [isOpen, setIsOpen] = useState(false);
  const dropdownRef = useRef<HTMLDivElement>(null);
  const navigate = useNavigate();

  const items = [
    { name: 'Funkcje', section: 'features' },
    { name: 'Jak to działa', section: 'how-it-works' },
    { name: 'Cennik', section: 'pricing' },
    { name: 'Kontakt', section: 'footer' },
  ];

  useEffect(() => {
    function handleClickOutside(event: MouseEvent) {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target as Node)) {
        setIsOpen(false);
      }
    }

    if (isOpen) {
      document.addEventListener('mousedown', handleClickOutside);
      return () => document.removeEventListener('mousedown', handleClickOutside);
    }
  }, [isOpen]);

  const handleItemClick = (section: string) => {
    setIsOpen(false);
    // Navigate to landing page and scroll to section
    navigate('/', { state: { scrollTo: section } });
    
    // Small delay to allow navigation to complete
    setTimeout(() => {
      const element = document.getElementById(section);
      if (element) {
        element.scrollIntoView({ behavior: 'smooth' });
      }
    }, 100);
  };

  return (
    <div className="relative" ref={dropdownRef}>
      <button
        onClick={() => setIsOpen(!isOpen)}
        className={`flex items-center space-x-2 px-3 py-2 rounded-md text-sm font-medium transition-colors ${
          isOpen
            ? 'bg-blue-100 text-blue-700'
            : 'text-gray-600 hover:text-gray-900 hover:bg-gray-100'
        }`}
      >
        <Package className="h-4 w-4" />
        <span>Product</span>
        <ChevronDown className={`h-4 w-4 transition-transform ${isOpen ? 'rotate-180' : ''}`} />
      </button>

      {/* Dropdown menu */}
      {isOpen && (
        <div className="absolute top-full left-0 mt-2 w-48 bg-white rounded-lg shadow-lg border border-gray-200 py-2 z-50">
          {items.map((item) => (
            <button
              key={item.section}
              onClick={() => handleItemClick(item.section)}
              className="w-full text-left px-4 py-2 text-sm text-gray-700 hover:bg-gray-50 transition-colors"
            >
              {item.name}
            </button>
          ))}
        </div>
      )}
    </div>
  );
}




















