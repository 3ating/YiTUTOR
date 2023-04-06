import React, { useState, useRef, useEffect } from 'react';
import firebase from 'firebase/compat/app';
import 'firebase/compat/firestore';
import 'firebase/compat/auth';

const firebaseConfig = {
    apiKey: 'AIzaSyDrG9uBznJyP7Fe_4JRwVG7pvR7SjScQsg',
    authDomain: 'board-12c3c.firebaseapp.com',
    projectId: 'board-12c3c',
    storageBucket: 'board-12c3c.appspot.com',
    messagingSenderId: '662676665549',
    appId: '1:662676665549:web:d2d23417c365f3ec666584',
    measurementId: 'G-YY6Q81WPY9',
};

if (!firebase.apps.length) {
    firebase.initializeApp(firebaseConfig);
}

const db = firebase.firestore();

interface ChatroomProps {
    roomId: string | null;
}

const Canvas = ({ roomId }: ChatroomProps) => {
    const canvasRef = useRef<HTMLCanvasElement>(null);
    const [color, setColor] = useState<string>('black');
    const [lineWidth, setLineWidth] = useState<number>(5);
    const [isDrawing, setIsDrawing] = useState<boolean>(false);
    const [lines, setLines] = useState<any>([]);
    const [tempLine, setTempLine] = useState<any>([]);

    const [shape, setShape] = useState<string | null>(null);
    const [startX, setStartX] = useState<number>(0);
    const [startY, setStartY] = useState<number>(0);
    const [lastMouseX, setLastMouseX] = useState<number>(0);
    const [lastMouseY, setLastMouseY] = useState<number>(0);

    const [shapes, setShapes] = useState<any[]>([]);
    const [distanceMoved, setDistanceMoved] = useState<number>(0);

    useEffect(() => {
        if (!roomId) return;

        const canvas = canvasRef.current;
        if (!canvas) return;

        const ctx = canvas.getContext('2d');
        if (!ctx) return;

        canvas.width = canvas.clientWidth;
        canvas.height = canvas.clientHeight;

        ctx.lineJoin = 'round';
        ctx.lineCap = 'round';
        ctx.lineWidth = lineWidth;

        // Set canvas background to white
        ctx.fillStyle = 'white';
        ctx.fillRect(0, 0, canvas.width, canvas.height);
    }, [lineWidth, roomId, lines, shapes]);

    const startDrawing: React.MouseEventHandler<HTMLCanvasElement> = (e) => {
        const canvas = canvasRef.current;
        if (!canvas) return;

        const rect = canvas.getBoundingClientRect();
        setStartX(e.clientX - rect.left);
        setStartY(e.clientY - rect.top);

        if (shape) {
            setIsDrawing(true);
        } else {
            const ctx = canvas.getContext('2d');
            if (!ctx) return;

            ctx.strokeStyle = color;
            ctx.beginPath();
            ctx.moveTo(e.clientX - canvas.offsetLeft, e.clientY - canvas.offsetTop);

            setIsDrawing(true);
        }
    };

    const drawShape: React.MouseEventHandler<HTMLCanvasElement> = (e) => {
        if (!isDrawing) return;

        const canvas = canvasRef.current;
        if (!canvas) return;

        const ctx = canvas.getContext('2d');
        if (!ctx) return;

        const rect = canvas.getBoundingClientRect();
        const x = e.clientX - rect.left;
        const y = e.clientY - rect.top;

        // const x = e.clientX - canvas.offsetLeft;
        // const y = e.clientY - canvas.offsetTop;

        console.log('in drawshap x:', x);
        console.log('in drawshap y:', y);

        ctx.clearRect(0, 0, canvas.width, canvas.height); // 清除畫布
        ctx.fillStyle = 'white'; // 將背景設置為白色
        ctx.fillRect(0, 0, canvas.width, canvas.height); // 填充白色背景
        renderLines(); // 重新繪製線條

        ctx.strokeStyle = color;
        ctx.lineWidth = lineWidth;

        switch (shape) {
            case 'circle':
                ctx.beginPath();
                const radius = Math.sqrt(Math.pow(x - startX, 2) + Math.pow(y - startY, 2));
                ctx.arc(startX, startY, radius, 0, 2 * Math.PI);
                ctx.stroke();
                break;
            case 'rectangle':
                ctx.beginPath();
                ctx.rect(Math.min(x, startX), Math.min(y, startY), Math.abs(x - startX), Math.abs(y - startY));
                ctx.stroke();
                break;
            case 'triangle':
                ctx.beginPath();
                ctx.moveTo(startX, startY - Math.abs(y - startY));
                ctx.lineTo(startX - Math.abs(x - startX) / 2, startY + Math.abs(y - startY));
                ctx.lineTo(startX + Math.abs(x - startX) / 2, startY + Math.abs(y - startY));
                ctx.closePath();
                ctx.stroke();
                break;
            default:
                break;
        }
        setLastMouseX(e.clientX);
        setLastMouseY(e.clientY);
    };

    const draw: React.MouseEventHandler<HTMLCanvasElement> = (e) => {
        if (!isDrawing) return;

        const canvas = canvasRef.current;
        if (!canvas) return;

        const ctx = canvas.getContext('2d');
        if (!ctx) return;

        const rect = canvas.getBoundingClientRect();
        const x = e.clientX - rect.left;
        const y = e.clientY - rect.top;

        const dx = x - (tempLine.length > 0 ? tempLine[tempLine.length - 1].x : x);
        const dy = y - (tempLine.length > 0 ? tempLine[tempLine.length - 1].y : y);
        const distance = Math.sqrt(dx * dx + dy * dy);
        setDistanceMoved((prevDistance) => prevDistance + distance);

        // const x = e.clientX - canvas.offsetLeft;
        // const y = e.clientY - canvas.offsetTop;

        setLastMouseX(e.clientX);
        setLastMouseY(e.clientY);

        ctx.lineTo(x, y);
        ctx.stroke();

        setTempLine((prevLine: any) => [
            ...prevLine,
            {
                x,
                y,
                prevX: prevLine.length > 0 ? prevLine[prevLine.length - 1].x : x,
                prevY: prevLine.length > 0 ? prevLine[prevLine.length - 1].y : y,
                color,
                lineWidth,
            },
        ]);
    };

    const renderLines = () => {
        const canvas = canvasRef.current;
        if (!canvas) return;

        const ctx = canvas.getContext('2d');
        if (!ctx) return;

        for (const line of lines) {
            for (const point of line.points) {
                ctx.beginPath();
                ctx.moveTo(point.prevX, point.prevY);
                ctx.lineTo(point.x, point.y);
                ctx.strokeStyle = point.color;
                ctx.lineWidth = point.lineWidth;
                ctx.stroke();
            }
        }
    };

    // const endDrawing = () => {
    //     setIsDrawing(false);

    //     const canvas = canvasRef.current;
    //     if (!canvas) return;

    //     if (distanceMoved < 5) {
    //         setDistanceMoved(0);
    //         // return;
    //     }

    //     const rect = canvas.getBoundingClientRect();
    //     const endX = lastMouseX - rect.left;
    //     const endY = lastMouseY - rect.top;

    //     if (shape) {
    //         const shapeData = {
    //             type: shape,
    //             startX,
    //             startY,
    //             endX,
    //             endY,
    //             color,
    //             lineWidth,
    //         };

    //         setShapes((prevShapes) => [...prevShapes, shapeData]);

    //         db.collection('rooms')
    //             .doc(roomId || '')
    //             .update({
    //                 shapes: firebase.firestore.FieldValue.arrayUnion(shapeData),
    //             });
    //     } else if (tempLine.length > 0) {
    //         db.collection('rooms')
    //             .doc(roomId || '')
    //             .update({
    //                 lines: firebase.firestore.FieldValue.arrayUnion({ points: tempLine }),
    //             })
    //             .then(() => {
    //                 setTempLine([]);
    //             });
    //     }
    // };

    // const endDrawing = () => {
    //     setIsDrawing(false);

    //     const canvas = canvasRef.current;
    //     if (!canvas || distanceMoved < 1) {
    //         console.log('!canvas || distanceMoved < 10');
    //         return;
    //     }

    //     const rect = canvas.getBoundingClientRect();
    //     const endX = lastMouseX - rect.left;
    //     const endY = lastMouseY - rect.top;

    //     if (shape) {
    //         const shapeData = {
    //             type: shape,
    //             startX,
    //             startY,
    //             endX,
    //             endY,
    //             color,
    //             lineWidth,
    //         };

    //         setShapes((prevShapes) => [...prevShapes, shapeData]);

    //         // Move this part to the end of the function
    //         db.collection('rooms')
    //             .doc(roomId || '')
    //             .update({
    //                 shapes: firebase.firestore.FieldValue.arrayUnion(shapeData),
    //             });
    //     } else if (tempLine.length > 0) {
    //         db.collection('rooms')
    //             .doc(roomId || '')
    //             .update({
    //                 lines: firebase.firestore.FieldValue.arrayUnion({ points: tempLine }),
    //             })
    //             .then(() => {
    //                 setTempLine([]);
    //             });
    //     }
    //     setDistanceMoved(0);
    // };

    const endDrawing = () => {
        setIsDrawing(false);

        const canvas = canvasRef.current;
        if (!canvas) {
            console.log('!canvas');
            return;
        }

        const rect = canvas.getBoundingClientRect();
        const endX = lastMouseX - rect.left;
        const endY = lastMouseY - rect.top;

        if (shape) {
            const shapeData = {
                type: shape,
                startX,
                startY,
                endX,
                endY,
                color,
                lineWidth,
            };

            setShapes((prevShapes) => [...prevShapes, shapeData]);

            db.collection('rooms')
                .doc(roomId || '')
                .update({
                    shapes: firebase.firestore.FieldValue.arrayUnion(shapeData),
                });
        } else if (tempLine.length > 0 && distanceMoved >= 5) {
            db.collection('rooms')
                .doc(roomId || '')
                .update({
                    lines: firebase.firestore.FieldValue.arrayUnion({ points: tempLine }),
                })
                .then(() => {
                    setTempLine([]);
                });
        }
        setDistanceMoved(0);
    };

    const handleClearCanvas = () => {
        const canvas = canvasRef.current;
        if (!canvas) return;

        const ctx = canvas.getContext('2d');
        if (!ctx) return;

        ctx.clearRect(0, 0, canvas.width, canvas.height);

        ctx.fillStyle = 'white';
        ctx.fillRect(0, 0, canvas.width, canvas.height);

        db.collection('rooms')
            .doc(roomId || '')
            .update({ lines: [], shapes: [] });
    };

    useEffect(() => {
        if (!roomId) return;
        const unsubscribeLines = db
            .collection('rooms')
            .doc(roomId)
            .onSnapshot((doc) => {
                const roomData = doc.data();
                if (roomData && roomData.lines) {
                    setLines(roomData.lines);
                } else {
                    setLines([]);
                }
            });

        const unsubscribeShapes = db
            .collection('rooms')
            .doc(roomId)
            .onSnapshot((doc) => {
                const roomData = doc.data();
                if (roomData && roomData.shapes) {
                    setShapes(roomData.shapes);
                } else {
                    setShapes([]);
                }
            });

        return () => {
            unsubscribeLines();
            unsubscribeShapes();
        };
    }, [roomId]);

    const renderShapes = () => {
        const canvas = canvasRef.current;
        if (!canvas) return;

        const ctx = canvas.getContext('2d');
        if (!ctx) return;

        for (const shapeData of shapes) {
            ctx.strokeStyle = shapeData.color;
            ctx.lineWidth = shapeData.lineWidth;

            switch (shapeData.type) {
                case 'circle':
                    ctx.beginPath();
                    const radius = Math.sqrt(
                        Math.pow(shapeData.endX - shapeData.startX, 2) + Math.pow(shapeData.endY - shapeData.startY, 2)
                    );
                    ctx.arc(shapeData.startX, shapeData.startY, radius, 0, 2 * Math.PI);
                    ctx.stroke();
                    break;
                case 'rectangle':
                    ctx.beginPath();
                    ctx.rect(
                        Math.min(shapeData.endX, shapeData.startX),
                        Math.min(shapeData.endY, shapeData.startY),
                        Math.abs(shapeData.endX - shapeData.startX),
                        Math.abs(shapeData.endY - shapeData.startY)
                    );
                    ctx.stroke();
                    break;
                case 'triangle':
                    ctx.beginPath();
                    ctx.moveTo(shapeData.startX, shapeData.startY - Math.abs(shapeData.endY - shapeData.startY));
                    ctx.lineTo(
                        shapeData.startX - Math.abs(shapeData.endX - shapeData.startX) / 2,
                        shapeData.startY + Math.abs(shapeData.endY - shapeData.startY)
                    );
                    ctx.lineTo(
                        shapeData.startX + Math.abs(shapeData.endX - shapeData.startX) / 2,
                        shapeData.startY + Math.abs(shapeData.endY - shapeData.startY)
                    );
                    ctx.closePath();
                    ctx.stroke();
                    break;
                default:
                    break;
            }
        }
    };

    useEffect(() => {
        renderLines();
        renderShapes();
    }, [lines, shapes]);

    // console.log('lines:', lines);
    console.log('shapes in firestore:', shapes);

    return (
        <div>
            <canvas
                ref={canvasRef}
                onMouseDown={startDrawing}
                onMouseMove={shape ? drawShape : draw} // 添加這一行
                onMouseUp={endDrawing}
                onMouseOut={endDrawing}
                style={{ border: '1px solid black', width: '100%', height: '300px' }}
            />
            <div>
                <div style={{ display: 'flex', justifyContent: 'space-between' }}>
                    <label>Color:</label>
                    <input type='color' value={color} onChange={(e) => setColor(e.target.value)} />
                    <label>Line Width:</label>
                    <input
                        type='range'
                        min='1'
                        max='20'
                        value={lineWidth}
                        onChange={(e) => setLineWidth(Number(e.target.value))}
                    />
                    <button onClick={handleClearCanvas}>Clear</button>
                </div>
            </div>
            <div>
                <label>Shape:</label>
                <select value={shape || ''} onChange={(e) => setShape(e.target.value)}>
                    <option value=''>Free Draw</option>
                    <option value='circle'>Circle</option>
                    <option value='rectangle'>Rectangle</option>
                    <option value='triangle'>Triangle</option>
                </select>
            </div>

            <div>
                {lines.map((line: { points: any[] }, index: React.Key | null | undefined) => (
                    <div key={index}>
                        {line.points.map((point: any, idx: number) => (
                            <div
                                key={idx}
                                style={{
                                    position: 'absolute',
                                    left: point.x,
                                    top: point.y,
                                    width: point.lineWidth,
                                    height: 0,
                                    border: `1px solid ${point.color}`,
                                }}
                            ></div>
                        ))}
                    </div>
                ))}
            </div>
        </div>
    );
};

export default Canvas;
