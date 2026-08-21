import React, { useEffect, useRef } from 'react';
import './Footer.css';
import { GOOGLE_MAPS_API_KEY, DEFAULT_LOCATION, MAP_CONFIG } from '../config/maps-config';

const Footer = () => {
  const mapRef = useRef(null);

  useEffect(() => {
    const loadGoogleMapsAPI = () => {
      if (window.google?.maps) {
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
        styles: MAP_CONFIG.styles,
      });

      new window.google.maps.Marker({
        position: DEFAULT_LOCATION,
        map,
        title: 'PlayPal Headquarters',
      });
    };

    loadGoogleMapsAPI();
  }, []);

  return (
    <footer className="footer">
      <div className="footer__grid">
        <div className="footer__section">
          <h3>Contact</h3>
          <ul className="footer__list">
            <li><span className="footer__icon">📍</span> 123 Sports Avenue, New York, NY 10001</li>
            <li><span className="footer__icon">📧</span> playpal@info.in</li>
            <li><span className="footer__icon">📞</span> (913) 542-3400</li>
            <li><span className="footer__icon">⏰</span> Mon–Fri 9AM–6PM · Sat–Sun 10AM–4PM</li>
          </ul>
        </div>

        <div className="footer__section">
          <h3>Follow us</h3>
          <div className="footer__social">
            <a href="#" className="footer__social-link">Facebook</a>
            <a href="#" className="footer__social-link">Twitter</a>
            <a href="#" className="footer__social-link">Instagram</a>
            <a href="#" className="footer__social-link">LinkedIn</a>
          </div>
        </div>

        <div className="footer__section footer__section--map">
          <h3>Location</h3>
          <div className="footer__map">
            <div ref={mapRef} className="footer__map-canvas" />
          </div>
        </div>
      </div>

      <div className="footer__bottom">
        <p>&copy; {new Date().getFullYear()} PlayPal. Connect through sports.</p>
      </div>
    </footer>
  );
};

export default Footer;
