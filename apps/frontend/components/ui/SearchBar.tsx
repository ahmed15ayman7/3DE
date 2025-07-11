import { useState } from 'react';
import { Search } from "lucide-react";
import { LazyMotion, domAnimation, m } from 'framer-motion';

interface SearchBarProps {
  placeholder: string;
  setSearch: (search: string) => void;
}

const SearchBar = ({ placeholder, setSearch }: SearchBarProps) => {
  const [searchTerm, setSearchTerm] = useState('');

  const handleSearchChange = (value: string) => {
    setSearchTerm(value);
    setSearch(value);
  };

  return (
    <div className="relative">
      <LazyMotion features={domAnimation}>
        <m.div
          initial={{ y: -20, opacity: 0 }}
          animate={{ y: 0, opacity: 1 }}
          className="flex items-center bg-white p-2 rounded-full shadow-md mt-3 mx-4"
        >
          <Search className="text-gray-500 ml-2" size={16} />
          <input
            type="text"
            placeholder={placeholder}
            className="ml-3 flex-1 text-gray-700 bg-transparent border-none outline-none placeholder-gray-500"
            value={searchTerm}
            onChange={(e) => handleSearchChange(e.target.value)}
          />
        </m.div>
      </LazyMotion>
    </div>
  );
};

export default SearchBar;
