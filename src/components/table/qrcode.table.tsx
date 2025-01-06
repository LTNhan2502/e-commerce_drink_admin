'use client';
import { useEffect, useRef } from "react";
import QRCode from "qrcode";

interface QrcodeTableProps {
    token: string;
    tableNumber: string;
    width?: number;
}

const QrcodeTable = ({ token, tableNumber, width = 250 }: QrcodeTableProps) => {
    const canvasRef = useRef<HTMLCanvasElement | null>(null);

    useEffect(() => {
        const canvas = canvasRef.current;
        if (!canvas) return;

        const canvasContext = canvas.getContext("2d");
        if (!canvasContext) return;

        // Tạo một canvas ảo để render QR code
        const virtualCanvas = document.createElement("canvas");

        // Kích thước canvas chính
        const borderRadius = 20; // Border radius
        canvas.height = width + 90; // Adjust height for added text
        canvas.width = width;

        // Vẽ nền với border radius
        canvasContext.fillStyle = "#f7f7f7"; // Màu xám dịu nhẹ
        canvasContext.beginPath();
        canvasContext.moveTo(borderRadius, 0);
        canvasContext.lineTo(canvas.width - borderRadius, 0);
        canvasContext.quadraticCurveTo(canvas.width, 0, canvas.width, borderRadius);
        canvasContext.lineTo(canvas.width, canvas.height - borderRadius);
        canvasContext.quadraticCurveTo(canvas.width, canvas.height, canvas.width - borderRadius, canvas.height);
        canvasContext.lineTo(borderRadius, canvas.height);
        canvasContext.quadraticCurveTo(0, canvas.height, 0, canvas.height - borderRadius);
        canvasContext.lineTo(0, borderRadius);
        canvasContext.quadraticCurveTo(0, 0, borderRadius, 0);
        canvasContext.closePath();
        canvasContext.fill();

        // Hiển thị thông tin bàn
        canvasContext.font = "18px Arial";
        canvasContext.textAlign = "center";
        canvasContext.fillStyle = "#333"; // Màu chữ
        canvasContext.fillText(`Bàn số ${tableNumber}`, canvas.width / 2, width + 30);
        canvasContext.fillText(`Quét mã QR để gọi món`, canvas.width / 2, width + 60);

        // Vẽ QR code lên canvas
        QRCode.toCanvas(virtualCanvas, token, (error) => {
            if (error) {
                console.error("QR Code Generation Error:", error);
                return;
            }
            canvasContext.drawImage(virtualCanvas, 10, 10, width - 20, width - 20);
        });
    }, [token, tableNumber, width]);

    return (
        <div className={`${token ? 'inline-block rounded-[20px] overflow-hidden shadow-md' : ''}`}>
            <canvas ref={canvasRef} />
        </div>
    );
};

export default QrcodeTable;
