import { useCallback, useState } from 'react';
import AutoComplete from './components/AutoComplete/AutoComplete';
import './App.css';

const App = () => {
  const [selectedItem, setSelectedItem] = useState<any>(null);

  // Mock data function
  const mockFetch = useCallback(async (query: string) => {
    // Simulate API call delay without error handler
    await new Promise(resolve => setTimeout(resolve, 500));

    // Mock data
    const allItems = [
      { id: 1, name: 'Apple', category: 'Fruit' },
      { id: 2, name: 'Banana', category: 'Fruit' },
      { id: 3, name: 'Orange', category: 'Fruit' },
      { id: 4, name: 'Carrot', category: 'Vegetable' },
      { id: 5, name: 'Broccoli', category: 'Vegetable' },
      { id: 6, name: 'Cucumber', category: 'Vegetable' },
      { id: 7, name: 'Chocolate', category: 'Dessert' },
      { id: 8, name: 'Ice Cream', category: 'Dessert' },
      { id: 9, name: 'Cake', category: 'Dessert' },
      { id: 10, name: 'Bread', category: 'Bakery' },
    ];

    return allItems.filter(item =>
        item.name.toLowerCase().includes(query.toLowerCase())
    );
  }, []);

  // Real API call function
  const realApiFetch = useCallback(async (query: string) => {
    if (!query) return [];

    try {
      const response = await fetch(
          `https://api.github.com/search/users?q=${query}&per_page=5`
      );

      if (!response.ok) {
        throw new Error('Failed to fetch users');
      }

      const data = await response.json();
      return data.items.map((item: any) => ({
        id: item.id,
        name: item.login,
        avatar: item.avatar_url,
      }));
    } catch (error) {
      console.error('API error:', error);
      return [];
    }
  }, []);

  const handleSelect = (item: any) => {
    setSelectedItem(item);
  };

  return (
      <div className="app">
        <h1>Auto-Complete Component Example Usage</h1>

        <div className="container">
          <h2>Mock Data Example</h2>
          <AutoComplete
              fetchSuggestions={mockFetch}
              onSelect={handleSelect}
              placeholder="Search fruits, vegetables..."
              minChars={2}
          />

          <div className="spacer"></div>

          <h2>Real API Example (GitHub Users)</h2>
          <AutoComplete
              fetchSuggestions={realApiFetch}
              onSelect={handleSelect}
              placeholder="Search GitHub users..."
              minChars={3}
          />

          {selectedItem && (
              <div className="selected-item">
                <h3>Selected Item:</h3>
                <pre>{JSON.stringify(selectedItem, null, 2)}</pre>
              </div>
          )}
        </div>
      </div>
  );
};

export default App;