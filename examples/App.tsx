import React, { useState } from 'react';
import { PaginatedMultiSelect } from '../src/PaginatedMultiSelect';
import '../src/styles.css';

// Mock API data
const generateMockUsers = (count: number, offset: number = 0) => {
  return Array.from({ length: count }, (_, i) => ({
    id: offset + i + 1,
    name: `User ${offset + i + 1}`,
    email: `user${offset + i + 1}@example.com`,
    role: ['Admin', 'Editor', 'Viewer'][Math.floor(Math.random() * 3)],
  }));
};

const TOTAL_USERS = 1000;
const mockDatabase = generateMockUsers(TOTAL_USERS);

interface User {
  id: number;
  name: string;
  email: string;
  role: string;
}

function App() {
  const [selectedUsers, setSelectedUsers] = useState<number[]>([]);
  const [singleSelected, setSingleSelected] = useState<number | null>(null);

  // Simulate API call to load paginated data
  const handleLoadPage = async ({ searchTerms, onPage, pageSize }: any) => {
    // Simulate network delay
    await new Promise((resolve) => setTimeout(resolve, 500));

    const startIndex = (onPage - 1) * pageSize;
    const endIndex = startIndex + pageSize;
    const paginatedData = mockDatabase.slice(startIndex, endIndex);

    return {
      data: paginatedData,
      onPage,
      pageSize,
      totalPages: Math.ceil(TOTAL_USERS / pageSize),
      totalRecords: TOTAL_USERS,
    };
  };

  // Simulate API call to search
  const handleSearch = async (searchTerms: string[]) => {
    // Simulate network delay
    await new Promise((resolve) => setTimeout(resolve, 300));

    const results = mockDatabase.filter((user) =>
      searchTerms.some(
        (term) =>
          user.name.toLowerCase().includes(term.toLowerCase()) ||
          user.email.toLowerCase().includes(term.toLowerCase()) ||
          user.role.toLowerCase().includes(term.toLowerCase())
      )
    );

    return {
      data: results.slice(0, 100), // Return max 100 search results
      isSearch: true,
      searchTerms,
    };
  };

  return (
    <div style={{ padding: '40px', maxWidth: '800px', margin: '0 auto' }}>
      <h1>React Paginated MultiSelect Examples</h1>

      <section style={{ marginBottom: '40px' }}>
        <h2>Multi-Select Mode</h2>
        <p>Select multiple users from {TOTAL_USERS} total records</p>
        
        <PaginatedMultiSelect<User>
          multiple
          value={selectedUsers}
          onChange={(values) => setSelectedUsers(values)}
          onLoadPage={handleLoadPage}
          onSearch={handleSearch}
          getOptionLabel={(option) => `${option.name} (${option.email})`}
          getOptionValue={(option) => option.id}
          placeholder="Search users by name, email, or role..."
          label="Select Users"
          showSelectAll
          limitTags={3}
        />

        <div style={{ marginTop: '20px' }}>
          <strong>Selected IDs:</strong> {selectedUsers.join(', ') || 'None'}
        </div>
      </section>

      <section style={{ marginBottom: '40px' }}>
        <h2>Single-Select Mode</h2>
        <p>Select a single user</p>
        
        <PaginatedMultiSelect<User>
          multiple={false}
          value={singleSelected}
          onChange={(value) => setSingleSelected(value)}
          onLoadPage={handleLoadPage}
          onSearch={handleSearch}
          getOptionLabel={(option) => option.name}
          getOptionValue={(option) => option.id}
          placeholder="Type to search..."
          label="Select One User"
          showSelectAll={false}
        />

        <div style={{ marginTop: '20px' }}>
          <strong>Selected ID:</strong> {singleSelected || 'None'}
        </div>
      </section>

      <section style={{ marginBottom: '40px' }}>
        <h2>Custom Styled</h2>
        <p>With custom CSS classes and styles</p>
        
        <PaginatedMultiSelect<User>
          multiple
          value={[]}
          onChange={() => {}}
          onLoadPage={handleLoadPage}
          onSearch={handleSearch}
          getOptionLabel={(option) => option.name}
          getOptionValue={(option) => option.id}
          placeholder="Custom styled dropdown..."
          className="custom-select"
          classNames={{
            input: 'custom-input',
            dropdown: 'custom-dropdown',
            option: 'custom-option',
          }}
          styles={{
            container: { 
              border: '2px solid #e91e63',
              borderRadius: '8px',
              padding: '8px',
            },
            input: {
              fontSize: '16px',
            },
          }}
        />
      </section>

      <section style={{ marginBottom: '40px' }}>
        <h2>Custom Option Rendering</h2>
        <p>With custom option component</p>
        
        <PaginatedMultiSelect<User>
          multiple
          value={[]}
          onChange={() => {}}
          onLoadPage={handleLoadPage}
          onSearch={handleSearch}
          getOptionLabel={(option) => option.name}
          getOptionValue={(option) => option.id}
          placeholder="With custom options..."
          renderOption={(option, isSelected) => (
            <div
              style={{
                display: 'flex',
                alignItems: 'center',
                gap: '12px',
                width: '100%',
              }}
            >
              <div
                style={{
                  width: '32px',
                  height: '32px',
                  borderRadius: '50%',
                  backgroundColor: '#3f51b5',
                  color: 'white',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  fontWeight: 'bold',
                }}
              >
                {option.name.charAt(0)}
              </div>
              <div style={{ flex: 1 }}>
                <div style={{ fontWeight: isSelected ? 'bold' : 'normal' }}>
                  {option.name}
                </div>
                <div style={{ fontSize: '12px', color: '#666' }}>
                  {option.email} • {option.role}
                </div>
              </div>
              {isSelected && <span style={{ color: '#4caf50' }}>✓</span>}
            </div>
          )}
        />
      </section>

      <section style={{ marginBottom: '40px' }}>
        <h2>Disabled State</h2>
        
        <PaginatedMultiSelect<User>
          multiple
          value={[1, 2, 3]}
          onChange={() => {}}
          onLoadPage={handleLoadPage}
          getOptionLabel={(option) => option.name}
          getOptionValue={(option) => option.id}
          placeholder="Disabled component..."
          disabled
        />
      </section>

      <section>
        <h2>Features</h2>
        <ul>
          <li>✅ Infinite scroll - Try scrolling in the dropdown</li>
          <li>✅ Server-side pagination - Loads {TOTAL_USERS} users efficiently</li>
          <li>✅ Async search - Type to search (debounced)</li>
          <li>✅ Multi-search - Use semicolon (;) to search multiple terms</li>
          <li>✅ Select All - Checkbox at the top</li>
          <li>✅ Virtual scrolling - Smooth with large lists</li>
          <li>✅ Fully customizable - No MUI dependency!</li>
        </ul>
      </section>
    </div>
  );
}

export default App;
