import {
    useState,
    useEffect,
    useRef,
    useCallback,
    KeyboardEvent,
    ChangeEvent
} from 'react';

import {AutoCompleteProps, SuggestionItem} from "../../interfaces/AutoComplete";
import { highlightMatch } from '../../utils/highlightMatch';
import useDebounce from '../../hooks/useDebounce';

import './AutoComplete.css';



const AutoComplete = ({
                                                       fetchSuggestions,
                                                       onSelect,
                                                       placeholder = 'Search...',
                                                       minChars = 2,
                                                       debounceTime = 300
                                                   }: AutoCompleteProps) => {
    const [inputValue, setInputValue] = useState('');
    const [suggestions, setSuggestions] = useState<SuggestionItem[]>([]);
    const [isLoading, setIsLoading] = useState(false);
    const [error, setError] = useState<string | null>(null);
    const [activeIndex, setActiveIndex] = useState(-1);
    const [isDropdownVisible, setIsDropdownVisible] = useState(false);
    const [selectedItem, setSelectedItem] = useState<SuggestionItem | null>(null);

    const containerRef = useRef<HTMLDivElement>(null);
    const inputRef = useRef<HTMLInputElement>(null);

    const debouncedValue = useDebounce(inputValue, debounceTime);

    // Fetch suggestions when debounced value changes
    useEffect(() => {
        const fetchData = async () => {
            if (!debouncedValue || debouncedValue.length < minChars) {
                setSuggestions([]);
                setIsDropdownVisible(false);
                return;
            }

            try {
                setIsLoading(true);
                setError(null);
                const data = await fetchSuggestions(debouncedValue);
                setSuggestions(data);
                setIsDropdownVisible(data.length > 0);
                setActiveIndex(-1);
            } catch (err) {
                setError('Failed to fetch suggestions. Please try again.');
                console.error('Error fetching suggestions:', err);
                setSuggestions([]);
                setIsDropdownVisible(false);
            } finally {
                setIsLoading(false);
            }
        };

        fetchData();
    }, [debouncedValue, fetchSuggestions, minChars]);

    // Handle clicks outside the component
    useEffect(() => {
        const handleClickOutside = (event: MouseEvent) => {
            if (
                containerRef.current &&
                !containerRef.current.contains(event.target as Node)
            ) {
                setIsDropdownVisible(false);
            }
        };

        document.addEventListener('mousedown', handleClickOutside);
        return () => {
            document.removeEventListener('mousedown', handleClickOutside);
        };
    }, []);

    const handleInputChange = (e: ChangeEvent<HTMLInputElement>) => {
        const value = e.target.value;
        setInputValue(value);
        setSelectedItem(null);

        if (value.length >= minChars) {
            setIsDropdownVisible(true);
        } else {
            setIsDropdownVisible(false);
        }
    };

    const handleSelect = useCallback((item: SuggestionItem) => {
        setInputValue(item.name);
        setSelectedItem(item);
        setIsDropdownVisible(false);
        onSelect(item);
        inputRef.current?.focus();
    }, [onSelect]);

    const handleKeyDown = (e: KeyboardEvent<HTMLInputElement>) => {
        if (!isDropdownVisible) return;

        switch (e.key) {
            case 'ArrowDown':
                e.preventDefault();
                setActiveIndex(prev =>
                    prev < suggestions.length - 1 ? prev + 1 : prev
                );
                break;

            case 'ArrowUp':
                e.preventDefault();
                setActiveIndex(prev => (prev > 0 ? prev - 1 : 0));
                break;

            case 'Enter':
                if (activeIndex >= 0 && activeIndex < suggestions.length) {
                    e.preventDefault();
                    handleSelect(suggestions[activeIndex]);
                }
                break;

            case 'Escape':
                setIsDropdownVisible(false);
                break;

            default:
                break;
        }
    };

    const renderSuggestions = () => {
        if (!isDropdownVisible) return null;

        if (isLoading) {
            return (
                <div className="dropdown">
                    <div className="loading">Loading...</div>
                </div>
            );
        }

        if (error) {
            return (
                <div className="dropdown">
                    <div className="error">{error}</div>
                </div>
            );
        }

        if (suggestions.length === 0 && inputValue.length >= minChars) {
            return (
                <div className="dropdown">
                    <div className="no-results">No results found</div>
                </div>
            );
        }

        return (
            <div className="dropdown">
                <ul>
                    {suggestions.map((item, index) => (
                        <li
                            key={item.id}
                            className={`suggestion-item ${index === activeIndex ? 'active' : ''}`}
                            onClick={() => handleSelect(item)}
                            onMouseEnter={() => setActiveIndex(index)}
                        >
                            {highlightMatch(item.name, inputValue)}
                        </li>
                    ))}
                </ul>
            </div>
        );
    };

    return (
        <div className="auto-complete" ref={containerRef}>
            <input
                type="text"
                ref={inputRef}
                value={inputValue}
                onChange={handleInputChange}
                onKeyDown={handleKeyDown}
                onFocus={() => inputValue.length >= minChars && setIsDropdownVisible(true)}
                placeholder={placeholder}
                aria-autocomplete="list"
                aria-expanded={isDropdownVisible}
                aria-haspopup="listbox"
                aria-controls="suggestions-list"
            />
            {renderSuggestions()}
        </div>
    );
};

export default AutoComplete;