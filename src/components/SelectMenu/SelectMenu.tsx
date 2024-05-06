import React, { useState, useRef, useEffect } from 'react';
import "./SelectMenu.css";
import { Model } from '@/types/types';
import { models } from '@/constants';

interface SelectMenuProps {
  models: Model[];
  selectedModel: Model;
  onModelChange: (model: Model) => void;
}

const SelectMenu: React.FC<SelectMenuProps> = ({ models, selectedModel, onModelChange }) => {
  const [isOpen, setIsOpen] = useState(false);
  const selectMenuRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const handleOutsideClick = (event: MouseEvent) => {
      if (selectMenuRef.current && !selectMenuRef.current.contains(event.target as Node)) {
        setIsOpen(false);
      }
    };
    document.addEventListener('click', handleOutsideClick);
    return () => {
      document.removeEventListener('click', handleOutsideClick);
    };
  }, []);

  const handleModelChange = (model: Model) => {
    onModelChange(model);
    setIsOpen(false);
  };

  return (
    <div
      className={`select-menu ${isOpen ? 'open' : ''}`}
      ref={selectMenuRef}
      style={{ '--t': `${models.findIndex(model => model.id === selectedModel.id) * -41}px` } as React.CSSProperties}
    >
      <select
        value={selectedModel.id}
        onChange={(e) => handleModelChange(models.find(model => model.id === e.target.value)!)}
      >
        {models.map((model) => (
          <option key={model.id} value={model.id}>
            {model.name}
          </option>
        ))}
      </select>
      <div className="button" onClick={() => setIsOpen(!isOpen)}>
        <em />
        <ul>
          {models.map((model) => (
            <li
              key={model.id}
              className={model.id === selectedModel.id ? 'selected' : ''}
              onClick={() => handleModelChange(model)}
            >
              {model.name}
            </li>
          ))}
        </ul>
      </div>
      <ul>
        {models.map((model) => (
          <li
            key={model.id}
            className={model.id === selectedModel.id ? 'selected' : ''}
            onClick={() => handleModelChange(model)}
          >
            {model.name}
          </li>
        ))}
      </ul>
    </div>
  );
};

export default SelectMenu;