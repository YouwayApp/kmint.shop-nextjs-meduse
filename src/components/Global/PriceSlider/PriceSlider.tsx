"use client";

import React, { useState, useEffect } from "react";

interface PriceData {
  code: string;
  name: string;
  price: number;
  change: number;
  changePercent: number;
  color: string;
}

const PriceSlider: React.FC = () => {
  const [prices, setPrices] = useState<PriceData[]>([]);
  const [socket, setSocket] = useState<WebSocket | null>(null);
  const [isConnected, setIsConnected] = useState(false);
  const [updatedPrices, setUpdatedPrices] = useState<Set<string>>(new Set());

  // Define the codes we want to display with their Turkish names
  const priceCodes = {
    AYAR22: "22 Ayar Altın",
    "GRAM ALTIN": "Gram Altın",
    "ALTIN GUMUS": "Altın Gümüş",
    "YENI CEYREK": "Yeni Çeyrek",
    "ESKI CEYREK": "Eski Çeyrek",
    "YENI YARIM": "Yeni Yarım",
    "ESKI YARIM": "Eski Yarım",
    "YENI TAM": "Yeni Tam",
    "ESKI TAM": "Eski Tam",
    "YENI ATA": "Yeni Ata",
    "ESKI ATA": "Eski Ata",
    "YENI ATA5": "Yeni Ata 5",
    "ESKI ATA5": "Eski Ata 5",
    "YENI GREMSE": "Yeni Gremse",
    "ESKI GREMSE": "Eski Gremse",
    AYAR14: "14 Ayar Altın",
    GUMUSTRY: "Gümüş TRY",
    "GUMUS ONS": "Gümüş Ons",
    "PLATIN ONS": "Platin Ons",
    "PALADYUM ONS": "Paladyum Ons",
    "PLATIN USD": "Platin USD",
    "PALADYUM USD": "Paladyum USD",
  };

  const colorMap = {
    AYAR22: "text-yellow-600",
    "GRAM ALTIN": "text-yellow-600",
    "ALTIN GUMUS": "text-yellow-600",
    "YENI CEYREK": "text-yellow-600",
    "ESKI CEYREK": "text-yellow-600",
    "YENI YARIM": "text-yellow-600",
    "ESKI YARIM": "text-yellow-600",
    "YENI TAM": "text-yellow-600",
    "ESKI TAM": "text-yellow-600",
    "YENI ATA": "text-yellow-600",
    "ESKI ATA": "text-yellow-600",
    "YENI ATA5": "text-yellow-600",
    "ESKI ATA5": "text-yellow-600",
    "YENI GREMSE": "text-yellow-600",
    "ESKI GREMSE": "text-yellow-600",
    AYAR14: "text-yellow-600",
    GUMUSTRY: "text-gray-600",
    "GUMUS ONS": "text-gray-600",
    "PLATIN ONS": "text-blue-600",
    "PALADYUM ONS": "text-purple-600",
    "PLATIN USD": "text-blue-600",
    "PALADYUM USD": "text-purple-600",
  };

  // Simulate real-time price updates
  useEffect(() => {
    // Set initial test data
    const initialPrices: PriceData[] = [
      {
        code: "GRAM ALTIN",
        name: "Gram Altın",
        price: 2850.5,
        change: 15.25,
        changePercent: 0.54,
        color: "text-yellow-600",
      },
      {
        code: "GUMUSTRY",
        name: "Gümüş TRY",
        price: 42.8,
        change: -0.35,
        changePercent: -0.81,
        color: "text-gray-600",
      },
      {
        code: "PLATIN ONS",
        name: "Platin Ons",
        price: 1050.75,
        change: 8.5,
        changePercent: 0.82,
        color: "text-blue-600",
      },
      {
        code: "PALADYUM ONS",
        name: "Paladyum Ons",
        price: 2450.3,
        change: -12.4,
        changePercent: -0.5,
        color: "text-purple-600",
      },
    ];

    setPrices(initialPrices);

    // Simulate price updates every 3-8 seconds
    const updatePrices = () => {
      setPrices((prevPrices) => {
        const updatedPrices = prevPrices.map((price) => {
          const randomChange = (Math.random() - 0.5) * 20; // -10 to +10
          const newPrice = Math.max(0, price.price + randomChange);
          const newChange = randomChange;
          const newChangePercent = (newChange / price.price) * 100;

          return {
            ...price,
            price: newPrice,
            change: newChange,
            changePercent: newChangePercent,
          };
        });

        // Trigger opacity effect for updated prices
        const updatedCodes = new Set(updatedPrices.map((p) => p.code));
        setUpdatedPrices(updatedCodes);

        // Clear opacity effect after 2 seconds
        setTimeout(() => {
          setUpdatedPrices(new Set());
        }, 2000);

        return updatedPrices;
      });
    };

    // Random interval between 3-8 seconds
    const scheduleNextUpdate = () => {
      const delay = Math.random() * 5000 + 3000; // 3-8 seconds
      setTimeout(() => {
        updatePrices();
        scheduleNextUpdate();
      }, delay);
    };

    scheduleNextUpdate();
  }, []);

  // WebSocket connection
  useEffect(() => {
    const connectWebSocket = () => {
      try {
        const ws = new WebSocket(
          "wss://sslsocket.aifanet.com/5.250.255.83/14679"
        );

        ws.addEventListener("open", (event) => {
          console.log("Connected to price server");
          setIsConnected(true);
          setSocket(ws);

          // Send a test message to request price data
          ws.send(
            JSON.stringify({
              type: "request",
              timestamp: Date.now(),
              message: "Requesting price data",
            })
          );
        });

        ws.addEventListener("message", (event) => {
          try {
            const data = JSON.parse(event.data);

            // Process the received data and update prices
            if (data && typeof data === "object") {
              const newPrices: PriceData[] = [];

              // Check if data is an array or object
              if (Array.isArray(data)) {
                // If it's an array, process each item
                data.forEach((item) => {
                  if (
                    item &&
                    item.code &&
                    priceCodes[item.code as keyof typeof priceCodes]
                  ) {
                    newPrices.push({
                      code: item.code,
                      name: priceCodes[item.code as keyof typeof priceCodes],
                      price: parseFloat(item.price) || 0,
                      change: parseFloat(item.change) || 0,
                      changePercent: parseFloat(item.changePercent) || 0,
                      color:
                        colorMap[item.code as keyof typeof colorMap] ||
                        "text-gray-600",
                    });
                  }
                });
              } else {
                // If it's an object, check for our codes
                Object.keys(priceCodes).forEach((code) => {
                  if (data[code]) {
                    const priceInfo = data[code];
                    newPrices.push({
                      code: code,
                      name: priceCodes[code as keyof typeof priceCodes],
                      price: parseFloat(priceInfo.price) || 0,
                      change: parseFloat(priceInfo.change) || 0,
                      changePercent: parseFloat(priceInfo.changePercent) || 0,
                      color:
                        colorMap[code as keyof typeof colorMap] ||
                        "text-gray-600",
                    });
                  }
                });
              }

              console.log("Processed prices:", newPrices);
              if (newPrices.length > 0) {
                // Mark updated prices for opacity effect
                const updatedCodes = new Set(newPrices.map((p) => p.code));
                setUpdatedPrices(updatedCodes);

                setPrices(newPrices);

                // Clear opacity effect after 2 seconds
                setTimeout(() => {
                  setUpdatedPrices(new Set());
                }, 2000);
              }
            }
          } catch (e) {
            console.log("Received text data:", event.data);
            console.log("Parse error:", e);
          }
        });

        ws.addEventListener("error", (event) => {
          console.error("WebSocket error:", event);
          setIsConnected(false);
        });

        ws.addEventListener("close", (event) => {
          console.log("Disconnected from price server");
          setIsConnected(false);
          setSocket(null);

          // Try to reconnect after 5 seconds
          setTimeout(() => {
            connectWebSocket();
          }, 5000);
        });

        return ws;
      } catch (error) {
        console.error("Failed to connect to WebSocket:", error);
        setIsConnected(false);
      }
    };

    const ws = connectWebSocket();

    return () => {
      if (ws) {
        ws.close();
      }
    };
  }, []);

  const formatPrice = (price: number) => {
    return new Intl.NumberFormat("tr-TR", {
      style: "currency",
      currency: "TRY",
      minimumFractionDigits: 2,
      maximumFractionDigits: 2,
    }).format(price);
  };

  const formatChange = (change: number) => {
    const sign = change >= 0 ? "+" : "";
    const signColor = change >= 0 ? "text-green-dark" : "text-red-dark";
    return (
      <span>
        <span className={signColor}>{sign}</span>
        <span>{change.toFixed(2)}</span>
      </span>
    );
  };

  const formatChangePercent = (percent: number) => {
    const sign = percent >= 0 ? "+" : "";
    const signColor = percent >= 0 ? "text-green-dark" : "text-red-dark";
    return (
      <span>
        <span className={signColor}>{sign}</span>
        <span>{percent.toFixed(2)}%</span>
      </span>
    );
  };

  return (
    <>
      <style jsx>{`
        @keyframes ticker {
          0% {
            transform: translateX(0);
          }
          100% {
            transform: translateX(-100%);
          }
        }
        .ticker-container {
          overflow: hidden;
          background: #f8fafc;
          border-top: 1px solid #e2e8f0;
          border-bottom: 1px solid #e2e8f0;
        }
        .ticker-track {
          display: flex;
          animation: ticker 30s linear infinite;
          white-space: nowrap;
        }
        .ticker-track:hover {
          animation-play-state: paused;
        }
        .ticker-item {
          display: inline-flex;
          align-items: center;
          padding: 8px 16px;
          margin-right: 20px;
          background: white;
          border-radius: 6px;
          border: 1px solid #e2e8f0;
          flex-shrink: 0;
        }
        .ticker-separator {
          color: #94a3b8;
          margin: 0 10px;
        }
        @keyframes priceUpdate {
          0% {
            opacity: 0.2;
          }
          50% {
            opacity: 0.8;
          }
          100% {
            opacity: 1;
          }
        }
        .price-updated {
          animation: priceUpdate 0.5s ease-out;
        }
      `}</style>

      {/* Simple Ticker */}
      <div className="ticker-container">
        <div className="ticker-track p-4">
          {prices.length > 0 ? (
            [...prices, ...prices, ...prices, ...prices].map((price, index) => (
              <div
                key={`${price.name}-${index}`}
                className={`ticker-item ${
                  updatedPrices.has(price.code) ? "price-updated" : ""
                }`}
              >
                <span className={`text-sm font-medium ${price.color} mr-2`}>
                  {price.name}:
                </span>
                <span className="font-semibold text-gray-900 mr-2">
                  {formatPrice(price.price)}
                </span>
                <span
                  className={`text-xs px-2 py-1 rounded flex items-center ${
                    price.change >= 0
                      ? "text-green-dark bg-green-50"
                      : "text-red-dark bg-red-50"
                  }`}
                >
                  <span className="mr-1">{price.change >= 0 ? "↗" : "↘"}</span>
                  {formatChange(price.change)} (
                  {formatChangePercent(price.changePercent)})
                </span>
                <span className="ticker-separator">•</span>
              </div>
            ))
          ) : (
            <div className="ticker-item">
              <span className="text-sm text-gray-500">
                Fiyat verileri yükleniyor...
              </span>
            </div>
          )}
        </div>
      </div>

      {/* Mobile View */}
      <div className="block md:hidden bg-gray-50 p-3">
        <div className="grid grid-cols-2 gap-2">
          {prices.length > 0 ? (
            prices.slice(0, 4).map((price, index) => (
              <div
                key={index}
                className={`bg-white rounded p-2 border border-gray-200 ${
                  updatedPrices.has(price.code) ? "price-updated" : ""
                }`}
              >
                <div className="mb-1">
                  <span className={`text-xs font-medium ${price.color}`}>
                    {price.name}
                  </span>
                </div>
                <div className="text-sm font-semibold text-gray-900 mb-1">
                  {formatPrice(price.price)}
                </div>
                <div
                  className={`text-xs px-1 py-0.5 rounded flex items-center ${
                    price.change >= 0
                      ? "text-green-dark bg-green-50"
                      : "text-red-dark bg-red-50"
                  }`}
                >
                  <span className="mr-1">{price.change >= 0 ? "↗" : "↘"}</span>
                  {formatChange(price.change)} (
                  {formatChangePercent(price.changePercent)})
                </div>
              </div>
            ))
          ) : (
            <div className="col-span-2 text-center text-gray-500 text-sm">
              Fiyat verileri yükleniyor...
            </div>
          )}
        </div>
      </div>
    </>
  );
};

export default PriceSlider;
