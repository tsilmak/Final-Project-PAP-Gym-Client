import { BrowserRouter as Router, Route, Routes } from "react-router-dom";

import { Main } from "./Home";
import Layout from "@/components/Layout";
import ScheduleTable from "./MapaAulas";
import Origem from "@/app/Origem/index";
import Inscricao from "@/app/Inscricao/index";
import Perfil from "@/app/Perfil/index";
import ProtectedRoute from "@/components/Auth/ProtectedRoute";
import Login from "@/app/Login/index";
import Assinatura from "@/app/Perfil/Assinatura";
import Cardio from "./Home/Equipamentos/Cardio";
import UnProtectedRoute from "@/components/Auth/UnProtectedRoute";
import CompletePage from "./CompletePage";
import Pagamentos from "./Perfil/Pagamentos";
import Blog from "./Blog";
import BlogById from "./Blog/BlogById";
import CheckoutPage from "./Pagamento/checkout";
import Funcional from "./Home/Equipamentos/Funcional";
import Musculacao from "./Home/Equipamentos/Musculacao";
import PlanoTreino from "./Perfil/PlanoDeTreino";

function App() {
  return (
    <Router>
      <Routes>
        <Route
          path="/inscricao"
          element={
            <UnProtectedRoute>
              <Layout>
                <Inscricao />
              </Layout>
            </UnProtectedRoute>
          }
        />
        <Route
          path="/login"
          element={
            <UnProtectedRoute>
              <Layout showContactForm={false}>
                <Login />
              </Layout>
            </UnProtectedRoute>
          }
        />
        <Route
          path="/perfil"
          element={
            <ProtectedRoute>
              <Layout showContactForm={false}>
                <Perfil />
              </Layout>
            </ProtectedRoute>
          }
        />
        <Route
          path="/perfil/assinatura"
          element={
            <Layout showContactForm={false}>
              <Assinatura />
            </Layout>
          }
        />
        <Route
          path="/perfil/pagamentos"
          element={
            <ProtectedRoute>
              <Layout showContactForm={false}>
                <Pagamentos />
              </Layout>
            </ProtectedRoute>
          }
        />
        <Route
          path="/perfil/treino"
          element={
            <ProtectedRoute>
              <Layout showContactForm={false}>
                <PlanoTreino />
              </Layout>
            </ProtectedRoute>
          }
        />
        <Route
          path="/"
          element={
            <Layout>
              <Main />
            </Layout>
          }
        />
        <Route
          path="/home"
          element={
            <Layout>
              <Main />
            </Layout>
          }
        />
        <Route
          path="/mapaAulas"
          element={
            <Layout showContactForm={false}>
              <ScheduleTable />
            </Layout>
          }
        />
        <Route
          path="/origem"
          element={
            <Layout>
              <Origem />
            </Layout>
          }
        />

        <Route
          path="/equipamentos/cardio"
          element={
            <Layout>
              <Cardio />
            </Layout>
          }
        />
        <Route
          path="/equipamentos/musculacao"
          element={
            <Layout>
              <Musculacao />
            </Layout>
          }
        />
        <Route
          path="/equipamentos/funcional"
          element={
            <Layout>
              <Funcional />
            </Layout>
          }
        />

        <Route
          path="/complete"
          element={
            <Layout>
              <CompletePage />
            </Layout>
          }
        />
        <Route
          path="/blog"
          element={
            <Layout>
              <Blog />
            </Layout>
          }
        />
        <Route
          path="/blog/:blogId"
          element={
            <Layout showContactForm={false}>
              <BlogById />
            </Layout>
          }
        />
        <Route
          path="/checkout/"
          element={
            <Layout showContactForm={false}>
              <CheckoutPage />
            </Layout>
          }
        />
        <Route path="/complete" element={<CompletePage />} />
      </Routes>
    </Router>
  );
}

export default App;
