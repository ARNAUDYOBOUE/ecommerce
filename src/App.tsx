import React from 'react';
import { Layout } from 'antd';
import { Routes, Route } from 'react-router-dom';
import HeaderComponent from './components/Header';
import FooterComponent from './components/Footer';
import Home from './components/Home';
import ProductsPage from './components/ProductsSection';
import LoginPage from './components/auth/Login';
import RegisterPage from './components/auth/Register';
import ProfilePage from './components/ProfilePage';
import PromoPage from './components/PromoSection';
import NewPage from './components/NewPage';
import About from './components/AboutPage';
import AddProduct from './components/AddProductPage';
import ProductDetailPage from './components/ProductDetailPage';
import OrderPage from './components/Order';
import CheckoutPage from './components/CheckoutPage';
import OrderConfirmation from './components/OrderConfirmation';
import OrderHistory from './components/OrderHistory';
import './App.css';

const { Header, Footer, Content } = Layout;

const App: React.FC = () => {
  return (
    <Layout className="app-layout">
      <Header className="app-header">
        <HeaderComponent />
      </Header>
      <Content className="app-content">
        <Routes>
          <Route path="/" element={<Home />} />
          <Route path="/products" element={<ProductsPage />} />
          <Route path="/products/:id" element={<ProductDetailPage />} />
          <Route path="/add-product" element={<AddProduct />} />
          <Route path="/login" element={<LoginPage />} />
          <Route path="/register" element={<RegisterPage />} />
          <Route path="/profile" element={<ProfilePage />} />
          <Route path="/sales" element={<PromoPage />} />
          <Route path="/new" element={<NewPage />} />
          <Route path="/about" element={<About />} />
          <Route path="/orders" element={<OrderPage />} />
          <Route path="/checkout" element={<CheckoutPage />} />
          <Route path="/order-confirmation" element={<OrderConfirmation />} />
          <Route path="/OrderHistory" element={<OrderHistory />} />
        </Routes>
      </Content>
      <Footer className="app-footer">
        <FooterComponent />
      </Footer>
    </Layout>
  );
};

export default App;