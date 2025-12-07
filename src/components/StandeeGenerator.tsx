import React, { useRef } from 'react';
import { Download, Printer } from 'lucide-react';
import { QRCodeSVG as QRCode } from 'qrcode.react';
import html2canvas from 'html2canvas';

interface StandeeGeneratorProps {
  shopName: string;
  storeUrl: string;
  upiId?: string;
}

export const StandeeGenerator: React.FC<StandeeGeneratorProps> = ({ shopName, storeUrl, upiId }) => {
  const standeeRef = useRef<HTMLDivElement>(null);

  const handleDownload = async () => {
    if (!standeeRef.current) return;
    try {
      const canvas = await html2canvas(standeeRef.current, {
        backgroundColor: '#fff',
        scale: 2,
      });
      const link = document.createElement('a');
      link.href = canvas.toDataURL('image/png');
      link.download = `${shopName}-standee.png`;
      link.click();
    } catch (error) {
      console.error('Error generating standee:', error);
    }
  };

  const handlePrint = () => {
    if (!standeeRef.current) return;
    const printWindow = window.open('', '', 'width=800,height=600');
    if (printWindow) {
      printWindow.document.write(standeeRef.current.outerHTML);
      printWindow.document.close();
      printWindow.print();
    }
  };

  return (
    <div className="flex flex-col items-center w-full">
      <div className="flex gap-2 mb-4 w-full">
        <button
          onClick={handleDownload}
          className="flex-1 py-2 bg-indigo-600 hover:bg-indigo-700 rounded-lg text-sm font-semibold flex items-center justify-center gap-2"
        >
          <Download className="w-4 h-4" />
          Download Standee
        </button>
        <button
          onClick={handlePrint}
          className="flex-1 py-2 bg-purple-600 hover:bg-purple-700 rounded-lg text-sm font-semibold flex items-center justify-center gap-2"
        >
          <Printer className="w-4 h-4" />
          Print Standee
        </button>
      </div>
      <div
        ref={standeeRef}
        className="flex flex-col items-center justify-center border border-gray-300 rounded-lg bg-white p-8 shadow-lg"
        style={{ width: 340, height: 520 }}
      >
        <h1 className="text-3xl font-bold text-gray-900 mb-2 text-center">{shopName}</h1>
        <p className="text-gray-600 text-sm mb-4 text-center">StoreGPT | Voice Commerce</p>
        <p className="text-xs text-gray-500 mb-2 text-center">SCAN TO SHOP</p>
        <div className="bg-white p-2 rounded border border-gray-200 mb-4">
          <QRCode value={storeUrl} size={120} level="H" />
        </div>
        {upiId && (
          <>
            <p className="text-xs text-gray-500 mb-2 text-center">SCAN TO PAY</p>
            <div className="bg-white p-2 rounded border border-gray-200 mb-4">
              <QRCode value={`upi://pay?pa=${upiId}`} size={80} level="H" />
            </div>
          </>
        )}
        <p className="text-xs text-gray-500 font-mono mt-2 text-center">{storeUrl}</p>
        <p className="text-xs text-gray-400 text-center">Made with StoreGPT</p>
        <div className="pt-2 border-t border-gray-200 w-full mt-4 text-center">
          <p className="text-xs text-gray-500">Voice-First Commerce Platform for Indian Businesses</p>
        </div>
      </div>
    </div>
  );
};
