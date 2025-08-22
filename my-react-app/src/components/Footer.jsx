import React, { useEffect, useRef } from 'react';
import './Footer.css';
import { GOOGLE_MAPS_API_KEY, DEFAULT_LOCATION, MAP_CONFIG } from '../config/maps-config';

const Footer = () => {
  const mapRef = useRef(null);

  useEffect(() => {
    // Load Google Maps API
    const loadGoogleMapsAPI = () => {
      if (window.google && window.google.maps) {
        initMap();
        return;
      }

      const script = document.createElement('script');
      script.src = `https://maps.googleapis.com/maps/api/js?key=${GOOGLE_MAPS_API_KEY}&libraries=places`;
      script.async = true;
      script.defer = true;
      script.onload = initMap;
      document.head.appendChild(script);
    };

    const initMap = () => {
      if (!mapRef.current) return;

      const map = new window.google.maps.Map(mapRef.current, {
        center: DEFAULT_LOCATION,
        zoom: MAP_CONFIG.zoom,
        styles: MAP_CONFIG.styles
      });

      // Add a marker for your location
      new window.google.maps.Marker({
        position: DEFAULT_LOCATION,
        map: map,
        title: 'PlayPal Headquarters'
      });
    };

    loadGoogleMapsAPI();

    return () => {
      // Cleanup if needed
    };
  }, []);

  return (
    <footer className="footer">
      <div className="footer-content">
                 <div className="footer-section">
           <h3>Contact Us</h3>
           <div className="contact-info">
             <div className="contact-item">
               <i className="contact-icon">📍</i>
               <span><strong>Address:</strong> 123 Sports Avenue, New York, NY 10001</span>
             </div>
             <div className="contact-item">
               <i className="contact-icon">📧</i>
               <span><strong>Email:</strong> playpal@info.in</span>
             </div>
             <div className="contact-item">
               <i className="contact-icon">📞</i>
               <span><strong>Mobile:</strong> 91354234</span>
             </div>
             <div className="contact-item">
               <i className="contact-icon">⏰</i>
               <span><strong>Hours:</strong> Mon-Fri: 9AM-6PM, Sat-Sun: 10AM-4PM</span>
             </div>
           </div>
         </div>

        

        <div className="footer-section">
          <h3>Follow Us</h3>
          <div className="social-links">
            <a href="#" className="social-link">
              <i className="social-icon">📘</i>
              <span>Facebook</span>
            </a>
            <a href="#" className="social-link">
              <i className="social-icon">🐦</i>
              <span>Twitter</span>
            </a>
            <a href="#" className="social-link">
              <i className="social-icon">📷</i>
              <span>Instagram</span>
            </a>
            <a href="#" className="social-link">
              <i className="social-icon">💼</i>
              <span>LinkedIn</span>
            </a>
          </div>
        </div>

        <div className="footer-section">
          <h3>Location</h3>
          <div className="map-container">
            <div ref={mapRef} className="google-map"></div>
          </div>
        </div>
      </div>

      <div className="footer-bottom">
        <p>&copy; 2024 PlayPal. All rights reserved. | Connect Through Sports</p>
      </div>
    </footer>
  );
};

export default Footer;
