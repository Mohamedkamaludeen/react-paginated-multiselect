# React Paginated MultiSelect

A lightweight, zero-dependency (except React) multi-select dropdown component with infinite scroll, server-side pagination, and async search. **No Material-UI or any UI framework required** - fully customizable with your own styles!

[![npm version](https://img.shields.io/npm/v/react-paginated-multiselect.svg)](https://www.npmjs.com/package/react-paginated-multiselect)
[![License: MIT](https://img.shields.io/badge/License-MIT-blue.svg)](https://opensource.org/licenses/MIT)

## 🔥 Features

✅ **Multi-select support** - Select one or multiple options  
✅ **Infinite scroll** - Auto-fetch next page on scroll  
✅ **Server-side pagination** - Handle massive datasets efficiently  
✅ **Async search** - Debounced API calls for search  
✅ **Lightweight** - No Material-UI or heavy dependencies  
✅ **Fully customizable** - Style it your way with CSS  
✅ **Virtual scrolling** - Smooth performance with thousands of items  
✅ **TypeScript support** - Full type definitions included  
✅ **Works with any backend** - Flexible API integration  

## 🔧 Use Cases

- Selecting users from large databases
- Searching paginated records
- Tag selectors with huge datasets
- Admin dashboards with heavy API-driven dropdowns
- Any scenario requiring efficient handling of 10,000+ options

## 📦 Installation

```bash
npm install react-paginated-multiselect
```

or

```bash
yarn add react-paginated-multiselect
```

## 🚀 Quick Start

```tsx
import React, { useState } from 'react';
import { PaginatedMultiSelect } from 'react-paginated-multiselect';
import 'react-paginated-multiselect/dist/styles.css'; // Import default styles

function App() {
  const [selectedValues, setSelectedValues] = useState([]);

  // Function to load paginated data
  const handleLoadPage = async ({ searchTerms, onPage, pageSize }) => {
    const response = await fetch(
      `/api/users?page=${onPage}&size=${pageSize}`
    );
    const data = await response.json();
    
    return {
      data: data.users,
      onPage: data.page,
      pageSize: data.size,
      totalPages: data.totalPages,
      totalRecords: data.totalRecords,
    };
  };

  // Function to handle search
  const handleSearch = async (searchTerms) => {
    const response = await fetch(
      `/api/users/search?q=${searchTerms.join(',')}`
    );
    const data = await response.json();
    
    return {
      data: data.users,
      isSearch: true,
      searchTerms: searchTerms,
    };
  };

  return (
    <PaginatedMultiSelect
      multiple
      value={selectedValues}
      onChange={setSelectedValues}
      onLoadPage={handleLoadPage}
      onSearch={handleSearch}
      getOptionLabel={(option) => option.name}
      getOptionValue={(option) => option.id}
      placeholder="Search users..."
      label="Select Users"
    />
  );
}

export default App;
```

## 📖 API Reference

### Props

| Prop | Type | Default | Description |
|------|------|---------|-------------|
| `onLoadPage` | `(params: LoadPageParams) => Promise<Response>` | **Required** | Function to load paginated data |
| `onSearch` | `(searchTerms: string[]) => Promise<Response>` | `undefined` | Function to handle search queries |
| `value` | `any \| any[]` | `undefined` | Current selected value(s) |
| `onChange` | `(value: any \| any[]) => void` | `undefined` | Callback when selection changes |
| `multiple` | `boolean` | `false` | Enable multi-select mode |
| `getOptionLabel` | `(option: T) => string` | Auto-detect | Extract display label from option |
| `getOptionValue` | `(option: T) => any` | Auto-detect | Extract unique value from option |
| `placeholder` | `string` | `"Type to search..."` | Input placeholder text |
| `label` | `string` | `undefined` | Label above the input |
| `disabled` | `boolean` | `false` | Disable the component |
| `loading` | `boolean` | `false` | Show loading state |
| `searchDebounce` | `number` | `300` | Debounce delay for search (ms) |
| `defaultPageSize` | `number` | `50` | Items per page |
| `maxVisibleItems` | `number` | `8` | Max items visible in dropdown |
| `limitTags` | `number` | `2` | Max chips to display before "+N" |
| `showSelectAll` | `boolean` | `true` | Show "Select All" option |
| `clearable` | `boolean` | `true` | Show clear button |
| `className` | `string` | `""` | Custom CSS class |
| `classNames` | `object` | `{}` | CSS classes for sub-elements |
| `styles` | `object` | `{}` | Inline styles for sub-elements |

### Response Format

Your `onLoadPage` and `onSearch` functions should return data in this format:

```typescript
// Full pagination response
{
  data: Array<T>;              // Array of options
  onPage?: number;              // Current page number
  pageSize?: number;            // Items per page
  totalPages?: number | null;   // Total pages (null if unknown)
  totalRecords?: number | null; // Total records (null if unknown)
  isSearch?: boolean;           // Is this a search result?
  searchTerms?: string[];       // Search terms used
}

// Or simply return an array
[{ id: 1, name: "Option 1" }, ...]
```

## 🎨 Customization

### Using Default Styles

```tsx
import 'react-paginated-multiselect/dist/styles.css';
```

### Custom CSS Classes

```tsx
<PaginatedMultiSelect
  className="my-custom-select"
  classNames={{
    container: 'my-container',
    input: 'my-input',
    dropdown: 'my-dropdown',
    option: 'my-option',
    selectedOption: 'my-selected-option',
    chip: 'my-chip',
    checkbox: 'my-checkbox',
    loader: 'my-loader',
  }}
  styles={{
    container: { maxWidth: '500px' },
    input: { fontSize: '16px' },
    dropdown: { maxHeight: '400px' },
  }}
/>
```

### CSS Variables

Override these CSS variables in your stylesheet:

```css
.rpms-container {
  --rpms-primary-color: #1976d2;
  --rpms-border-color: #d0d0d0;
  --rpms-hover-bg: #f5f5f5;
  --rpms-selected-bg: #e3f2fd;
}
```

### Custom Option Rendering

```tsx
<PaginatedMultiSelect
  renderOption={(option, isSelected) => (
    <div className="custom-option">
      <img src={option.avatar} alt="" />
      <span>{option.name}</span>
      {isSelected && <span>✓</span>}
    </div>
  )}
/>
```

## 💡 Advanced Examples

### Single Select Mode

```tsx
<PaginatedMultiSelect
  multiple={false}
  value={selectedValue}
  onChange={setSelectedValue}
  onLoadPage={handleLoadPage}
  getOptionLabel={(option) => option.label}
  getOptionValue={(option) => option.value}
/>
```

### With Initial Data

```tsx
const [initialData, setInitialData] = useState(null);

useEffect(() => {
  fetchInitialData().then(setInitialData);
}, []);

<PaginatedMultiSelect
  initialData={initialData}
  onLoadPage={handleLoadPage}
  {...otherProps}
/>
```

### Custom Search Separator

Users can search multiple terms separated by semicolons:

```
john; smith; admin
```

This will trigger a search for all three terms.

### Server-Side Integration

#### Express.js Example

```javascript
app.get('/api/users', async (req, res) => {
  const { page = 1, size = 50, search } = req.query;
  
  const result = await db.users.findAndCountAll({
    where: search ? { name: { [Op.like]: `%${search}%` } } : {},
    limit: parseInt(size),
    offset: (parseInt(page) - 1) * parseInt(size),
  });

  res.json({
    data: result.rows,
    onPage: parseInt(page),
    pageSize: parseInt(size),
    totalPages: Math.ceil(result.count / parseInt(size)),
    totalRecords: result.count,
  });
});
```

#### Django Example

```python
@api_view(['GET'])
def get_users(request):
    page = int(request.GET.get('page', 1))
    size = int(request.GET.get('size', 50))
    search = request.GET.get('search', '')
    
    queryset = User.objects.all()
    if search:
        queryset = queryset.filter(name__icontains=search)
    
    paginator = Paginator(queryset, size)
    page_obj = paginator.get_page(page)
    
    return Response({
        'data': UserSerializer(page_obj.object_list, many=True).data,
        'onPage': page,
        'pageSize': size,
        'totalPages': paginator.num_pages,
        'totalRecords': paginator.count,
    })
```

## 🎯 Performance Tips

1. **Use virtual scrolling** - Already built-in for large lists
2. **Implement server-side search** - Don't load all data upfront
3. **Optimize your API** - Add indexes on searchable fields
4. **Use pagination** - Return reasonable page sizes (50-100 items)
5. **Debounce search** - Adjust `searchDebounce` prop as needed

## � TypeScript Support

Full TypeScript support with comprehensive type definitions:

```typescript
import { 
  PaginatedMultiSelect,
  PaginatedMultiSelectProps,
  PaginationResponse,
  LoadPageParams,
} from 'react-paginated-multiselect';

interface User {
  id: number;
  name: string;
  email: string;
}

const MyComponent: React.FC = () => {
  const handleLoadPage = async (
    params: LoadPageParams
  ): Promise<PaginationResponse<User>> => {
    // Your implementation
  };

  return (
    <PaginatedMultiSelect<User>
      onLoadPage={handleLoadPage}
      getOptionLabel={(user) => user.name}
      getOptionValue={(user) => user.id}
    />
  );
};
```

## 🤝 Contributing

Contributions are welcome! Please feel free to submit a Pull Request.

## 📄 License

MIT © Mohamed Kamaludeen

## 🙏 Acknowledgments

- Built with React and react-window for optimal performance
- Zero dependency on Material-UI or other UI frameworks
- Designed for real-world applications with large datasets

## 📞 Support

- 🐛 [Report Bug](https://github.com/Mohamedkamaludeen/react-paginated-multiselect/issues)
- 💡 [Request Feature](https://github.com/Mohamedkamaludeen/react-paginated-multiselect/issues)
- 📖 [Documentation](https://github.com/Mohamedkamaludeen/react-paginated-multiselect#readme)

---

**Made with ❤️ for developers who need efficient, customizable dropdowns**

