import React, { useEffect, useRef } from "react";

const Ticker = () => {
  const containerRef = useRef(null);

  useEffect(() => {
    const script = document.createElement("script");
    script.src =
      "https://s3.tradingview.com/external-embedding/embed-widget-ticker-tape.js";
    script.async = true;
    script.innerHTML = JSON.stringify({
      symbols: [
        { proName: "BSE:RELIANCE", title: "Reliance Industries" },
        { proName: "BSE:TCS", title: "Tata Consultancy Services" },
        { proName: "BSE:INFY", title: "Infosys" },
        { proName: "BSE:HDFCBANK", title: "HDFC Bank" },
        { proName: "BSE:ICICIBANK", title: "ICICI Bank" },
        { proName: "BSE:SBIN", title: "State Bank of India" },
        { proName: "BSE:ITC", title: "ITC Ltd" },
        { proName: "BSE:LT", title: "Larsen & Toubro" },
        { proName: "BSE:KOTAKBANK", title: "Kotak Mahindra Bank" },
        { proName: "BSE:HINDUNILVR", title: "Hindustan Unilever" },
      ],
      showSymbolLogo: true,
      isTransparent: false,
      displayMode: "adaptive",
      colorTheme: "dark",
      locale: "en",
    });

    if (containerRef.current) {
      containerRef.current.innerHTML = "";
      containerRef.current.appendChild(script);
    }
  }, []);

  return (
    <div className="tradingview-widget-container">
      <div
        ref={containerRef}
        className="tradingview-widget-container__widget"
      />
    </div>
  );
};

export default Ticker;
