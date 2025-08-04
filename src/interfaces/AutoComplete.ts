// export interface AutoComplete {}
export interface AutoCompleteProps {
    fetchSuggestions: (query: string) => Promise<SuggestionItem[]>;
    onSelect: (item: SuggestionItem) => void;
    placeholder?: string;
    minChars?: number;
    debounceTime?: number;
}

export interface SuggestionItem {
    id: number | string;
    name: string;
    [key: string]: any;
}
