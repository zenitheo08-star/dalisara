/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import { BrowserRouter, Routes, Route, useLocation } from 'react-router-dom';
import { useEffect } from 'react';
import { HelmetProvider } from 'react-helmet-async';
import { ReactLenis } from 'lenis/react';
import { BookingProvider } from './store';
import { CustomCursor } from './components/CustomCursor';
import { Layout } from './components/Layout';
import { Home } from './pages/Home';
import { Stays } from './pages/Stays';
import { StayDetail } from './pages/StayDetail';
import { Dining } from './pages/Dining';
import { Wellness } from './pages/Wellness';
import { Experiences } from './pages/Experiences';
import { Location } from './pages/Location';
import { About } from './pages/About';
import { Contact } from './pages/Contact';
import { Policies } from './pages/Policies';
import { BookingModal } from './components/BookingModal';

function ScrollToTop() {
  const { pathname } = useLocation();

  useEffect(() => {
    window.scrollTo(0, 0);
  }, [pathname]);

  return null;
}

export default function App() {
  return (
    <HelmetProvider>
      <ReactLenis root options={{ lerp: 0.1, duration: 1.1, smoothWheel: true }}>
        <BrowserRouter>
          <BookingProvider>
            <CustomCursor />
            <BookingModal />
            <ScrollToTop />
            <Routes>
              <Route path="/" element={<Layout />}>
                <Route index element={<Home />} />
                <Route path="stays" element={<Stays />} />
                <Route path="stays/:id" element={<StayDetail />} />
                <Route path="dining" element={<Dining />} />
                <Route path="wellness" element={<Wellness />} />
                <Route path="experiences" element={<Experiences />} />
                <Route path="location" element={<Location />} />
                <Route path="about" element={<About />} />
                <Route path="contact" element={<Contact />} />
                <Route path="policies" element={<Policies />} />
              </Route>
            </Routes>
          </BookingProvider>
        </BrowserRouter>
      </ReactLenis>
    </HelmetProvider>
  );
}

