# Auto-Complete Component

A production-ready auto-complete component built with React and TypeScript.

## Features

- Asynchronous data fetching
- Keyboard navigation support (arrow keys, enter, escape)
- Highlighting of matched text
- Debounced input handling
- Responsive design
- Error handling
- Loading states
- Customizable parameters
- Real API integration example

## Setup

1. Clone the repository:
```bash
git clone https://github.com/yourusername/auto-complete-component.git
cd auto-complete-component
```

2. Install dependencies:
```bash
npm install
```

3. Start the development server:
```bash
npm start
```

## Usage

Import the AutoComplete component:

```tsx
import AutoComplete from './components/AutoComplete';

// Define your data fetching function
const fetchSuggestions = async (query: string) => {
  // Your implementation to fetch suggestions
};

// Use the component
<AutoComplete 
  fetchSuggestions={fetchSuggestions}
  onSelect={(item) => console.log(item)}
  placeholder="Search..."
  minChars={2}
  debounceTime={300}
/>
```

## Props

| Prop             | Type                     | Default     | Description                                  |
|------------------|--------------------------|-------------|----------------------------------------------|
| fetchSuggestions | `(query: string) => Promise<SuggestionItem[]>` | Required   | Function to fetch suggestions                |
| onSelect         | `(item: SuggestionItem) => void` | Required   | Callback when item is selected              |
| placeholder      | `string`                 | 'Search...' | Input placeholder text                      |
| minChars         | `number`                 | 2           | Minimum characters to trigger search        |
| debounceTime     | `number`                 | 300         | Debounce time in milliseconds               |

## Design Decisions

1. **Asynchronous Operations**:
    - All data fetching is handled asynchronously
    - Debouncing prevents excessive API calls

2. **Performance Optimizations**:
    - Memoization of functions
    - Efficient rendering with virtualized lists (concept)
    - Debounced input handling

3. **User Experience**:
    - Keyboard navigation support
    - Highlighting of matched text
    - Clear loading and error states
    - Responsive design for all devices

4. **Type Safety**:
    - Comprehensive TypeScript interfaces
    - Strict typing for props and state

5. **Edge Cases**:
    - Handles empty results
    - Manages API errors gracefully
    - Prevents race conditions with abortable fetch

6. **Accessibility**:
    - ARIA attributes for screen readers
    - Keyboard navigation support
    - Focus management

## Assumptions

1. The component expects suggestion items to have at least an `id` and `name` property
2. The parent component handles any complex state management
3. The API endpoints used in examples are stable and available

## Implementation Details

1. **Debouncing**: Custom `useDebounce` hook to optimize API calls
2. **Highlighting**: Utility function to highlight matched text segments
3. **Error Handling**: Comprehensive error states and messages
4. **Responsive Design**: Media queries for different screen sizes
5. **Keyboard Navigation**: Full keyboard support for accessibility