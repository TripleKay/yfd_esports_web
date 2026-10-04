import { BrowserRouter, Navigate, Route, Routes } from 'react-router-dom'
import { Layout } from './components/layout/Layout'
import { HomePage } from './pages/HomePage'
import { NewsArticlePage } from './pages/NewsArticlePage'
import { NewsPage } from './pages/NewsPage'
import { RegisterPage } from './pages/RegisterPage'
import { RulesPage } from './pages/RulesPage'

export default function App() {
  return (
    <BrowserRouter>
      <Routes>
        <Route element={<Layout />}>
          <Route index element={<HomePage />} />
          <Route path="register" element={<RegisterPage />} />
          <Route path="rules" element={<RulesPage />} />
          <Route path="news" element={<NewsPage />} />
          <Route path="news/:id" element={<NewsArticlePage />} />
          <Route path="*" element={<Navigate to="/" replace />} />
        </Route>
      </Routes>
    </BrowserRouter>
  )
}
