/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import { BrowserRouter, Routes, Route } from 'react-router-dom';
import { Layout } from './components/layout/Layout';
import { Home } from './pages/Home';
import { Dashboard } from './pages/Dashboard';
import { Editor } from './pages/Editor';
import { Pricing } from './pages/Pricing';
import { ProjectWorkspace } from './pages/ProjectWorkspace';
import { PromptLibrary } from './pages/PromptLibrary';
import { Assistants } from './pages/Assistants';

export default function App() {
  return (
    <BrowserRouter>
      <Routes>
        <Route path="/" element={<Layout />}>
          <Route index element={<Home />} />
          <Route path="dashboard" element={<Dashboard />} />
          <Route path="project/:id" element={<ProjectWorkspace />} />
          <Route path="editor" element={<Editor />} />
          <Route path="prompts" element={<PromptLibrary />} />
          <Route path="assistants" element={<Assistants />} />
          <Route path="pricing" element={<Pricing />} />
        </Route>
      </Routes>
    </BrowserRouter>
  );
}

