import { useState } from 'react';
import AppLayout from './layouts/AppLayout';
import { PAGES, type PageKey } from './router';

export default function App() {
  const [page, setPage] = useState<PageKey>('dashboard');

  const PageComponent = PAGES[page];

  return (
    <AppLayout activeKey={page} onNavigate={setPage}>
      <PageComponent />
    </AppLayout>
  );
}
