import React from 'react';
import SignupForm from './components/SignupForm';
import { QueryClient, QueryClientProvider } from '@tanstack/react-query'; // Updated import

const queryClient = new QueryClient();

function App() {
  return (
    <QueryClientProvider client={queryClient}>
      <div className="App">
        <SignupForm />
      </div>
    </QueryClientProvider>
  );
}

export default App;
