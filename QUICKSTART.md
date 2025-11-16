# Quick Start Guide

## Installation

```bash
npm install react-paginated-multiselect
# or
yarn add react-paginated-multiselect
```

## Basic Setup (5 minutes)

### 1. Import the component

```tsx
import { PaginatedMultiSelect } from 'react-paginated-multiselect';
import 'react-paginated-multiselect/dist/styles.css';
```

### 2. Create your data fetching functions

```tsx
// Load paginated data
const handleLoadPage = async ({ searchTerms, onPage, pageSize }) => {
  const response = await fetch(`/api/items?page=${onPage}&size=${pageSize}`);
  const data = await response.json();
  
  return {
    data: data.items,
    onPage: data.page,
    pageSize: data.size,
    totalPages: data.totalPages,
    totalRecords: data.total,
  };
};

// Search data
const handleSearch = async (searchTerms) => {
  const response = await fetch(`/api/items/search?q=${searchTerms.join(',')}`);
  const data = await response.json();
  
  return {
    data: data.results,
    isSearch: true,
  };
};
```

### 3. Use the component

```tsx
function MyComponent() {
  const [selected, setSelected] = useState([]);

  return (
    <PaginatedMultiSelect
      multiple
      value={selected}
      onChange={setSelected}
      onLoadPage={handleLoadPage}
      onSearch={handleSearch}
      getOptionLabel={(item) => item.name}
      getOptionValue={(item) => item.id}
      placeholder="Search..."
    />
  );
}
```

## That's it! 🎉

Your component will now:
- ✅ Load data in pages as you scroll
- ✅ Search with debouncing
- ✅ Handle thousands of items efficiently
- ✅ Work with any backend API

## Next Steps

- [Full API Documentation](./README.md#api-reference)
- [Customization Guide](./README.md#customization)
- [Advanced Examples](./README.md#advanced-examples)

## Common Patterns

### Single Select
```tsx
<PaginatedMultiSelect
  multiple={false}
  value={singleValue}
  onChange={setSingleValue}
  // ... other props
/>
```

### Custom Styling
```tsx
<PaginatedMultiSelect
  className="my-select"
  classNames={{
    input: 'my-input',
    dropdown: 'my-dropdown',
  }}
  styles={{
    container: { maxWidth: '500px' },
  }}
  // ... other props
/>
```

### With Initial Data
```tsx
const [initialData, setInitialData] = useState(null);

useEffect(() => {
  fetchData().then(setInitialData);
}, []);

<PaginatedMultiSelect
  initialData={initialData}
  // ... other props
/>
```

## Need Help?

- 📖 [Full Documentation](./README.md)
- 🐛 [Report Issues](https://github.com/Mohamedkamaludeen/react-paginated-multiselect/issues)
- 💡 [Request Features](https://github.com/Mohamedkamaludeen/react-paginated-multiselect/issues)
