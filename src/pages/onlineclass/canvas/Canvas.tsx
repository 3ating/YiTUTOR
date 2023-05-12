import React, { useState, useRef, useEffect } from 'react';
import styled from 'styled-components';
import firebase from 'firebase/compat/app';
import 'firebase/compat/firestore';
import 'firebase/compat/auth';
import {
    MdOutlineColorLens,
    MdContentCopy,
    MdContentPaste,
    MdOutlineDelete,
    MdOutlineBorderColor,
} from 'react-icons/md';
import { RxBorderWidth } from 'react-icons/rx';
import { AiOutlineClear } from 'react-icons/ai';
import { IoShapesOutline } from 'react-icons/io5';
import { Tooltip, message } from 'antd';

interface ChatroomProps {
    roomId: string | null;
}
interface IStyledCanvasProps {
    cursorStyle: string;
    hasNoRoomId: boolean;
}

const BoardContainer = styled.div`
    display: flex;
    flex-direction: column;
    justify-content: center;
    align-items: center;
    font-family: 'Roboto', sans-serif;
`;

const StyledCanvasContainer = styled.div`
    display: flex;
    flex-direction: column;
    align-items: center;
    width: 100%;
    /* margin-top: 20px; */
    position: relative;
`;

const StyledCanvas = styled.canvas<IStyledCanvasProps>`
    border: 2px solid #e8e8e8;
    background-color: #f8f8f8;
    box-shadow: 0px 5px 10px rgba(0, 0, 0, 0.1);
    width: 100%;
    height: 500px;
    /* height: 10%; */
    border-radius: 9px;
    cursor: ${(props) => props.cursorStyle};
    pointer-events: ${(props) => (props.hasNoRoomId ? 'none' : 'auto')};
`;

const StyledToolbar = styled.div`
    display: flex;
    flex-direction: column;
    align-items: flex-start;
    background: #dfdfdf;
    padding: 12px 8px;
    border-radius: 7px;
    position: absolute;
    /* left: 2%; */
    left: 20px;
    /* top: 19%; */
    top: 92.5px;
    gap: 5px;
`;

const RelativeDiv = styled.div`
    position: relative;
`;

const ToolIcon = styled.div`
    cursor: pointer;
    font-size: 24px;
    color: gray;
    &:hover {
        color: #000000;
    }
`;

const StyledInput = styled.input<{ isVisible?: boolean }>`
    position: absolute;
    z-index: 1;
    opacity: ${(props) => (props.isVisible ? 1 : 0)};
`;

const StyledSelect = styled.select<{ isVisible?: boolean }>`
    position: absolute;
    z-index: 2;
    display: ${(props) => (props.isVisible ? 'block' : 'none')};
`;

const ToolIconAno = styled(ToolIcon)`
    margin-top: 10px;
`;

const Label = styled.label`
    font-size: 16px;
    font-weight: bold;
    margin-right: 5px;
`;

const ShapeSelection = styled.div`
    display: flex;
    justify-content: center;
    align-items: center;
    margin-top: 10px;
`;

const firebaseConfig = {
    apiKey: process.env.FIRESTORE_API_KEY,
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

const Canvas = ({ roomId }: ChatroomProps) => {
    const MIN_DISTANCE = 5;

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
    const [moveEnabled, setMoveEnabled] = useState<boolean>(false);
    const [selectedShapeIndex, setSelectedShapeIndex] = useState<number | null>(null);
    const [selectedLineIndex, setSelectedLineIndex] = useState<number | null>(null);
    const [moveStartX, setMoveStartX] = useState<number>(0);
    const [moveStartY, setMoveStartY] = useState<number>(0);
    const [scaleEnabled, setScaleEnabled] = useState<boolean>(false);
    const [selectedShape, setSelectedShape] = useState<any>(null);
    const [cursorStyle, setCursorStyle] = useState('default');
    const [eraserEnabled, setEraserEnabled] = useState(false);
    const [selectedItem, setSelectedItem] = useState<{ type: string; index: number } | null>(null);
    const [selectedItemColor, setSelectedItemColor] = useState('');
    const [clipboardItem, setClipboardItem] = useState<{ type: string; data: object } | null>(null);
    const [isMoving, setIsMoving] = useState(false);
    const [isScaling, setIsScaling] = useState(false);

    const updateCursor: React.MouseEventHandler<HTMLCanvasElement> = (e) => {
        const rect = canvasRef.current?.getBoundingClientRect();
        if (!rect) return;

        const x = e.clientX - rect.left;
        const y = e.clientY - rect.top;

        const shapeIndex = findShape(x, y);
        const lineIndex = findLine(x, y);

        if (isMoving || shapeIndex !== null || lineIndex !== null) {
            setCursorStyle('move');
            setMoveEnabled(true);
        } else {
            setCursorStyle('default');
            setMoveEnabled(false);
        }
    };

    useEffect(() => {
        const handleKeyDown = (event: KeyboardEvent) => {
            if (event.shiftKey && event.key === 'S') {
                setScaleEnabled(true);
                setMoveEnabled(false);
            }
        };

        const handleKeyUp = (event: KeyboardEvent) => {
            if (event.key === 'Shift' || event.key === 'S') {
                setScaleEnabled(false);
            }
        };

        window.addEventListener('keydown', handleKeyDown);
        window.addEventListener('keyup', handleKeyUp);

        return () => {
            window.removeEventListener('keydown', handleKeyDown);
            window.removeEventListener('keyup', handleKeyUp);
        };
    }, []);

    const handleCanvasClick = (e: { clientX: number; clientY: number }) => {
        const canvas = canvasRef.current;
        if (!canvas) return;

        const rect = canvas.getBoundingClientRect();
        const x = e.clientX - rect.left;
        const y = e.clientY - rect.top;

        const foundShapeIndex = findShape(x, y);
        if (foundShapeIndex !== null) {
            console.log('click');

            setSelectedItem({ type: 'shape', index: foundShapeIndex });
            return;
        }

        const foundLineIndex = findLine(x, y);
        if (foundLineIndex !== null) {
            setSelectedItem({ type: 'line', index: foundLineIndex });
            return;
        }

        setSelectedItem(null);
    };

    const copySelectedItem = () => {
        if (selectedItem) {
            if (selectedItem.type === 'line') {
                const copiedLine = { ...lines[selectedItem.index] };
                setClipboardItem({ type: 'line', data: copiedLine });
                message.info('已複製線條');
            } else if (selectedItem.type === 'shape') {
                const copiedShape = { ...shapes[selectedItem.index] };
                setClipboardItem({ type: 'shape', data: copiedShape });
                message.info('已複製圖形');
            }
        }
    };

    const pasteClipboardItem = () => {
        if (clipboardItem) {
            if (clipboardItem.type === 'line') {
                const newLines = [...lines, clipboardItem.data];
                setLines(newLines);
                message.info('已貼上線條');
            } else if (clipboardItem.type === 'shape') {
                const newShapes = [...shapes, clipboardItem.data];
                setShapes(newShapes);
                message.info('已貼上圖形');
            }
        }
    };

    const deleteSelectedItem = async () => {
        if (selectedItem) {
            if (selectedItem.type === 'line') {
                const newLines = lines.filter((_: any, index: number) => index !== selectedItem.index);
                setLines(newLines);
                await db
                    .collection('rooms')
                    .doc(roomId ?? '')
                    .update({ lines: newLines });
            } else if (selectedItem.type === 'shape') {
                const newShapes = shapes.filter((_, index) => index !== selectedItem.index);
                setShapes(newShapes);
                await db
                    .collection('rooms')
                    .doc(roomId ?? '')
                    .update({ shapes: newShapes });
            }
            setSelectedItem(null);
        }
        message.info('已刪除');
    };

    const changeColor = async (newColor: string) => {
        if (selectedItem) {
            if (selectedItem.type === 'line') {
                const newLines = [...lines];
                newLines[selectedItem.index].points = newLines[selectedItem.index].points.map((point: any) => ({
                    ...point,
                    color: newColor,
                }));
                setLines(newLines);

                await db
                    .collection('rooms')
                    .doc(roomId ?? '')
                    .update({ lines: newLines });
            } else if (selectedItem.type === 'shape') {
                const newShapes = [...shapes];
                newShapes[selectedItem.index].color = newColor;
                setShapes(newShapes);

                await db
                    .collection('rooms')
                    .doc(roomId ?? '')
                    .update({ shapes: newShapes });
            }

            renderShapes();
            renderLines();
        }
    };

    const findShape = (x: number, y: number) => {
        for (let i = shapes.length - 1; i >= 0; i--) {
            const shapeData = shapes[i];
            switch (shapeData.type) {
                case 'circle':
                    const radius = Math.sqrt(
                        Math.pow(shapeData.endX - shapeData.startX, 2) + Math.pow(shapeData.endY - shapeData.startY, 2)
                    );
                    const distance = Math.sqrt(Math.pow(x - shapeData.startX, 2) + Math.pow(y - shapeData.startY, 2));
                    if (distance <= radius) {
                        return i;
                    }
                    break;
                case 'rectangle':
                    const minX = Math.min(shapeData.endX, shapeData.startX);
                    const minY = Math.min(shapeData.endY, shapeData.startY);
                    const width = Math.abs(shapeData.endX - shapeData.startX);
                    const height = Math.abs(shapeData.endY - shapeData.startY);
                    if (x >= minX && x <= minX + width && y >= minY && y <= minY + height) {
                        return i;
                    }
                    break;
                case 'triangle':
                    const p1 = {
                        x: shapeData.startX,
                        y: shapeData.startY - Math.abs(shapeData.endY - shapeData.startY),
                    };
                    const p2 = {
                        x: shapeData.startX - Math.abs(shapeData.endX - shapeData.startX) / 2,
                        y: shapeData.startY + Math.abs(shapeData.endY - shapeData.startY),
                    };
                    const p3 = {
                        x: shapeData.startX + Math.abs(shapeData.endX - shapeData.startX) / 2,
                        y: shapeData.startY + Math.abs(shapeData.endY - shapeData.startY),
                    };

                    const area = Math.abs((p1.x * (p2.y - p3.y) + p2.x * (p3.y - p1.y) + p3.x * (p1.y - p2.y)) / 2);
                    const area1 = Math.abs((x * (p2.y - p3.y) + p2.x * (p3.y - y) + p3.x * (y - p2.y)) / 2);
                    const area2 = Math.abs((p1.x * (y - p3.y) + x * (p3.y - p1.y) + p3.x * (p1.y - y)) / 2);
                    const area3 = Math.abs((p1.x * (p2.y - y) + p2.x * (y - p1.y) + x * (p1.y - p2.y)) / 2);

                    if (area === area1 + area2 + area3) {
                        return i;
                    }
                    break;
                default:
                    break;
            }
        }
        return null;
    };

    const findLine = (x: number, y: number, threshold = 5) => {
        for (let i = lines.length - 1; i >= 0; i--) {
            const line = lines[i];
            for (let j = 0; j < line.points.length - 1; j++) {
                const point1 = line.points[j];
                const point2 = line.points[j + 1];

                const dx = point2.x - point1.x;
                const dy = point2.y - point1.y;
                const length = Math.sqrt(dx * dx + dy * dy);

                const t = ((x - point1.x) * dx + (y - point1.y) * dy) / (length * length);

                if (t < 0 || t > 1) {
                    continue;
                }

                const closestX = point1.x + t * dx;
                const closestY = point1.y + t * dy;

                const distance = Math.sqrt(Math.pow(x - closestX, 2) + Math.pow(y - closestY, 2));

                if (distance <= threshold) {
                    return i;
                }
            }
        }

        return null;
    };

    const startMoving: React.MouseEventHandler<HTMLCanvasElement> = (e) => {
        const canvas = canvasRef.current;
        if (!canvas || scaleEnabled) return;

        const rect = canvas.getBoundingClientRect();
        const x = e.clientX - rect.left;
        const y = e.clientY - rect.top;

        const shapeIndex = findShape(x, y);
        const lineIndex = findLine(x, y);

        setSelectedShapeIndex(shapeIndex);
        setSelectedLineIndex(lineIndex);
        setIsMoving(true);
        setMoveStartX(x);
        setMoveStartY(y);
        message.loading({ content: '移動中...', key: 'movingMessage', duration: 0 });
    };

    const move: React.MouseEventHandler<HTMLCanvasElement> = (e) => {
        if (!isMoving) return;
        if (isScaling) return;
        if (selectedShapeIndex === null && selectedLineIndex === null) return;

        const canvas = canvasRef.current;
        if (!canvas) return;

        const rect = canvas.getBoundingClientRect();
        const x = e.clientX - rect.left;
        const y = e.clientY - rect.top;

        const dx = x - moveStartX;
        const dy = y - moveStartY;

        if (selectedShapeIndex !== null) {
            const movedShape = {
                ...shapes[selectedShapeIndex],
                startX: shapes[selectedShapeIndex].startX + dx,
                startY: shapes[selectedShapeIndex].startY + dy,
                endX: shapes[selectedShapeIndex].endX + dx,
                endY: shapes[selectedShapeIndex].endY + dy,
            };

            setShapes(shapes.map((shape, index) => (index === selectedShapeIndex ? movedShape : shape)));
        }

        if (selectedLineIndex !== null) {
            const movedLine = {
                ...lines[selectedLineIndex],
                points: lines[selectedLineIndex].points.map(
                    (point: { x: number; y: number; prevX: number; prevY: number }) => ({
                        ...point,
                        x: point.x + dx,
                        y: point.y + dy,
                        prevX: point.prevX + dx,
                        prevY: point.prevY + dy,
                    })
                ),
            };

            setLines(lines.map((line: any, index: number) => (index === selectedLineIndex ? movedLine : line)));
        }

        setMoveStartX(x);
        setMoveStartY(y);
    };

    const endMoving: React.MouseEventHandler<HTMLCanvasElement> = (e) => {
        const canvas = canvasRef.current;
        if (!canvas) return;

        const rect = canvas.getBoundingClientRect();
        const x = e.clientX - rect.left;
        const y = e.clientY - rect.top;

        const deltaX = x - moveStartX;
        const deltaY = y - moveStartY;

        if (selectedShapeIndex !== null) {
            const movedShape = shapes[selectedShapeIndex];

            movedShape.startX += deltaX;
            movedShape.startY += deltaY;
            movedShape.endX += deltaX;
            movedShape.endY += deltaY;

            db.collection('rooms')
                .doc(roomId || '')
                .update({
                    shapes: shapes.map((shape, index) => (index === selectedShapeIndex ? movedShape : shape)),
                });

            setSelectedShapeIndex(null);
        } else if (selectedLineIndex !== null) {
            const movedLine = lines[selectedLineIndex];

            movedLine.points = movedLine.points.map(
                (point: { x: number; y: number; prevX: number; prevY: number }) => ({
                    ...point,
                    x: point.x + deltaX,
                    y: point.y + deltaY,
                    prevX: point.prevX + deltaX,
                    prevY: point.prevY + deltaY,
                })
            );

            db.collection('rooms')
                .doc(roomId || '')
                .update({
                    lines: lines.map((line: any, index: number) => (index === selectedLineIndex ? movedLine : line)),
                });

            setSelectedLineIndex(null);
        }

        setMoveStartX(0);
        setMoveStartY(0);
        setIsMoving(false);
        setIsScaling(false);
        message.destroy('movingMessage');
    };

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

        ctx.fillStyle = 'white';
        ctx.fillRect(0, 0, canvas.width, canvas.height);
    }, [roomId, lines, shapes]);

    // const startDrawing: React.MouseEventHandler<HTMLCanvasElement> = (e) => {
    //     const canvas = canvasRef.current;
    //     if (!canvas) return;

    //     const rect = canvas.getBoundingClientRect();
    //     setStartX(e.clientX - rect.left);
    //     setStartY(e.clientY - rect.top);

    //     if (shape) {
    //         setIsDrawing(true);
    //     } else {
    //         const ctx = canvas.getContext('2d');
    //         if (!ctx) return;

    //         ctx.globalCompositeOperation = eraserEnabled ? 'destination-out' : 'source-over';
    //         ctx.lineWidth = eraserEnabled ? 50 : lineWidth; // 如果需要，可以調整橡皮擦的大小

    //         console.log('globalCompositeOperation', ctx.globalCompositeOperation);

    //         ctx.strokeStyle = color;
    //         ctx.beginPath();
    //         ctx.moveTo(e.clientX - canvas.offsetLeft, e.clientY - canvas.offsetTop);

    //         setIsDrawing(true);
    //     }
    // };

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

            ctx.globalCompositeOperation = eraserEnabled ? 'destination-out' : 'source-over';
            ctx.lineWidth = eraserEnabled ? 50 : lineWidth; // 如果需要，可以調整橡皮擦的大小
            console.log('color:', color);

            console.log('globalCompositeOperation', ctx.globalCompositeOperation);
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

        const dx = x - startX;
        const dy = y - startY;
        const distance = Math.sqrt(dx * dx + dy * dy);
        setDistanceMoved(distance);

        ctx.clearRect(0, 0, canvas.width, canvas.height);
        ctx.fillStyle = 'white';
        ctx.fillRect(0, 0, canvas.width, canvas.height);

        renderShapes();
        renderLines();

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

    // const draw: React.MouseEventHandler<HTMLCanvasElement> = (e) => {
    //     if (!isDrawing) return;

    //     const canvas = canvasRef.current;
    //     if (!canvas) return;

    //     const ctx = canvas.getContext('2d');
    //     if (!ctx) return;

    //     ctx.lineWidth = lineWidth;

    //     const rect = canvas.getBoundingClientRect();
    //     const x = e.clientX - rect.left;
    //     const y = e.clientY - rect.top;

    //     const dx = x - (tempLine.length > 0 ? tempLine[tempLine.length - 1].x : x);
    //     const dy = y - (tempLine.length > 0 ? tempLine[tempLine.length - 1].y : y);
    //     const distance = Math.sqrt(dx * dx + dy * dy);
    //     setDistanceMoved((prevDistance) => prevDistance + distance);

    //     setLastMouseX(e.clientX);
    //     setLastMouseY(e.clientY);

    //     ctx.beginPath();
    //     ctx.moveTo(
    //         tempLine.length > 0 ? tempLine[tempLine.length - 1].x : x,
    //         tempLine.length > 0 ? tempLine[tempLine.length - 1].y : y
    //     );
    //     ctx.lineTo(x, y);
    //     ctx.stroke();

    //     setTempLine((prevLine: any) => [
    //         ...prevLine,
    //         {
    //             x,
    //             y,
    //             prevX: prevLine.length > 0 ? prevLine[prevLine.length - 1].x : x,
    //             prevY: prevLine.length > 0 ? prevLine[prevLine.length - 1].y : y,
    //             color,
    //             lineWidth,
    //         },
    //     ]);
    // };

    const draw: React.MouseEventHandler<HTMLCanvasElement> = (e) => {
        if (!isDrawing) return;

        const canvas = canvasRef.current;
        if (!canvas) return;

        const ctx = canvas.getContext('2d');
        if (!ctx) return;

        ctx.globalCompositeOperation = eraserEnabled ? 'destination-out' : 'source-over';
        ctx.lineWidth = eraserEnabled ? 50 : lineWidth;

        console.log('draw globalCompositeOperation in draw function', ctx.globalCompositeOperation);

        const rect = canvas.getBoundingClientRect();
        const x = e.clientX - rect.left;
        const y = e.clientY - rect.top;

        const dx = x - (tempLine.length > 0 ? tempLine[tempLine.length - 1].x : x);
        const dy = y - (tempLine.length > 0 ? tempLine[tempLine.length - 1].y : y);
        const distance = Math.sqrt(dx * dx + dy * dy);
        setDistanceMoved((prevDistance) => prevDistance + distance);

        setLastMouseX(e.clientX);
        setLastMouseY(e.clientY);

        ctx.beginPath();
        ctx.moveTo(
            tempLine.length > 0 ? tempLine[tempLine.length - 1].x : x,
            tempLine.length > 0 ? tempLine[tempLine.length - 1].y : y
        );
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
                isErased: eraserEnabled,
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
                if (point.isErased) continue;

                ctx.beginPath();
                ctx.moveTo(point.prevX, point.prevY);
                ctx.lineTo(point.x, point.y);
                ctx.strokeStyle = point.color;
                ctx.lineWidth = point.lineWidth;
                ctx.stroke();
            }
        }
    };

    const endDrawing = () => {
        setIsDrawing(false);

        const canvas = canvasRef.current;
        if (!canvas) {
            return;
        }

        const rect = canvas.getBoundingClientRect();
        const endX = lastMouseX - rect.left;
        const endY = lastMouseY - rect.top;

        if (shape && distanceMoved >= MIN_DISTANCE) {
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
        } else if (tempLine.length > 0 && distanceMoved >= MIN_DISTANCE) {
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
        message.info('已清空白板');
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

    const startScaling: React.MouseEventHandler<HTMLCanvasElement> = (e) => {
        const canvas = canvasRef.current;
        if (!canvas) return;

        const ctx = canvas.getContext('2d');
        if (!ctx) return;

        const rect = canvas.getBoundingClientRect();
        const x = e.clientX - rect.left;
        const y = e.clientY - rect.top;

        const shape = shapes.find((shape) => {
            switch (shape.type) {
                case 'rectangle':
                    return (
                        x >= Math.min(shape.startX, shape.endX) &&
                        x <= Math.max(shape.startX, shape.endX) &&
                        y >= Math.min(shape.startY, shape.endY) &&
                        y <= Math.max(shape.startY, shape.endY)
                    );
                case 'circle':
                    const radius = Math.sqrt(
                        Math.pow(shape.endX - shape.startX, 2) + Math.pow(shape.endY - shape.startY, 2)
                    );
                    const distanceFromCenter = Math.sqrt(Math.pow(x - shape.startX, 2) + Math.pow(y - shape.startY, 2));
                    return distanceFromCenter <= radius;
                case 'triangle':
                    const path = new Path2D();
                    path.moveTo(shape.startX, shape.startY);
                    path.lineTo(shape.startX + (shape.endX - shape.startX) / 2, shape.endY);
                    path.lineTo(shape.endX, shape.startY);
                    path.closePath();
                    return ctx.isPointInPath(path, x, y);
                default:
                    return false;
            }
        });

        if (shape) {
            setSelectedShape(shape);
            setIsDrawing(true);
        }
    };

    const scale: React.MouseEventHandler<HTMLCanvasElement> = (e) => {
        if (!isDrawing || !selectedShape) return;

        const canvas = canvasRef.current;
        if (!canvas) return;

        const ctx = canvas.getContext('2d');
        if (!ctx) return;

        const rect = canvas.getBoundingClientRect();
        const x = e.clientX - rect.left;
        const y = e.clientY - rect.top;

        switch (selectedShape.type) {
            case 'rectangle':
                const newWidth = x - selectedShape.startX;
                const newHeight = y - selectedShape.startY;

                selectedShape.endX = selectedShape.startX + newWidth;
                selectedShape.endY = selectedShape.startY + newHeight;
                break;
            case 'circle':
                const radius = Math.sqrt(Math.pow(x - selectedShape.startX, 2) + Math.pow(y - selectedShape.startY, 2));
                selectedShape.endX = selectedShape.startX + radius;
                selectedShape.endY = selectedShape.startY;
                break;
            case 'triangle':
                const topVertex = {
                    x: selectedShape.startX + (selectedShape.endX - selectedShape.startX) / 2,
                    y: selectedShape.endY,
                };
                const scaleX = (x - selectedShape.startX) / (selectedShape.endX - selectedShape.startX);
                const scaleY = (y - selectedShape.startY) / (topVertex.y - selectedShape.startY);

                const scaledTopVertex = {
                    x: selectedShape.startX + (topVertex.x - selectedShape.startX) * scaleX,
                    y: selectedShape.startY + (topVertex.y - selectedShape.startY) * scaleY,
                };

                selectedShape.endX = 2 * scaledTopVertex.x - selectedShape.startX;
                selectedShape.endY = scaledTopVertex.y;
                break;
            default:
                break;
        }

        ctx.clearRect(0, 0, canvas.width, canvas.height);
        ctx.fillStyle = 'white';
        ctx.fillRect(0, 0, canvas.width, canvas.height);

        renderShapes();
        renderLines();
    };

    const endScaling = async () => {
        if (selectedShape) {
            const shapeIndex = shapes.findIndex((shape) => shape === selectedShape);

            setShapes(shapes.map((shape, index) => (index === shapeIndex ? selectedShape : shape)));

            await db
                .collection('rooms')
                .doc(roomId || '')
                .update({
                    shapes: shapes.map((shape, index) => (index === shapeIndex ? selectedShape : shape)),
                });
        }
        setIsDrawing(false);
        setSelectedShape(null);
        setIsMoving(false);
    };

    // console.log('eraserEnabled', eraserEnabled);
    const inputRef = useRef<HTMLInputElement>(null);
    const [showLineWidthPicker, setShowLineWidthPicker] = useState(false);
    const [shapeSelectorVisible, setShapeSelectorVisible] = useState(false);
    const [colorPickerVisible, setColorPickerVisible] = useState(false);

    const handleColorLineClick = () => {
        inputRef.current?.click();
        setShowLineWidthPicker(false);
        setShapeSelectorVisible(false);
        setColorPickerVisible(false);
    };
    const handleLineWidthPickerClick = () => {
        setShowLineWidthPicker(!showLineWidthPicker);
        setShapeSelectorVisible(false);
        setColorPickerVisible(false);
    };
    const handleShapeIconClick = () => {
        setShapeSelectorVisible(!shapeSelectorVisible);
        setShowLineWidthPicker(false);
        setColorPickerVisible(false);
    };

    const handleColorWandClick = () => {
        setColorPickerVisible(!colorPickerVisible);
        setShowLineWidthPicker(false);
        setShapeSelectorVisible(false);
    };

    return (
        <BoardContainer>
            <StyledCanvasContainer>
                <StyledCanvas
                    ref={canvasRef}
                    hasNoRoomId={!roomId}
                    cursorStyle={cursorStyle}
                    onMouseDown={moveEnabled ? startMoving : scaleEnabled ? startScaling : startDrawing}
                    onMouseMove={(e) => {
                        updateCursor(e);
                        if (moveEnabled) {
                            move(e);
                        } else if (scaleEnabled) {
                            scale(e);
                        } else if (shape) {
                            drawShape(e);
                        } else {
                            draw(e);
                        }
                    }}
                    onMouseUp={moveEnabled ? endMoving : scaleEnabled ? endScaling : endDrawing}
                    onMouseOut={moveEnabled ? endMoving : scaleEnabled ? endScaling : endDrawing}
                    onClick={handleCanvasClick}
                />
                <StyledToolbar>
                    <RelativeDiv>
                        {/* <Tooltip title='畫筆顏色' placement='right'> */}
                        <ToolIcon onClick={handleColorLineClick}>
                            <MdOutlineColorLens />
                        </ToolIcon>
                        {/* </Tooltip> */}
                        <StyledInput
                            type='color'
                            value={color}
                            onChange={(e) => setColor(e.target.value)}
                            ref={inputRef}
                            style={{ top: '-23px', left: '40px' }}
                        />
                    </RelativeDiv>
                    <RelativeDiv>
                        {/* <Tooltip title='畫筆粗細' placement='right'> */}
                        <ToolIcon onClick={handleLineWidthPickerClick}>
                            <RxBorderWidth />
                        </ToolIcon>
                        {/* </Tooltip> */}
                        {showLineWidthPicker && (
                            <StyledInput
                                type='range'
                                min='1'
                                max='20'
                                value={lineWidth}
                                onChange={(e) => setLineWidth(Number(e.target.value))}
                                style={{ top: '10px', left: '30px' }}
                                isVisible={showLineWidthPicker}
                            />
                        )}
                    </RelativeDiv>
                    <RelativeDiv>
                        {/* <Tooltip title='圖案' placement='right'> */}
                        <ToolIcon onClick={handleShapeIconClick}>
                            <IoShapesOutline />
                        </ToolIcon>
                        {/* </Tooltip> */}
                        <StyledSelect
                            value={shape || ''}
                            onChange={(e) => setShape(e.target.value)}
                            style={{ top: '8px', left: '35px' }}
                            isVisible={shapeSelectorVisible}
                        >
                            <option value=''>Line</option>
                            <option value='circle'>Circle</option>
                            <option value='rectangle'>Rectangle</option>
                            <option value='triangle'>Triangle</option>
                        </StyledSelect>
                    </RelativeDiv>
                    <RelativeDiv>
                        {/* <Tooltip title='框線顏色' placement='right'> */}
                        <ToolIcon onClick={handleColorWandClick}>
                            <MdOutlineBorderColor />
                        </ToolIcon>
                        {/* </Tooltip> */}
                        <StyledInput
                            type='color'
                            value={selectedItemColor}
                            onChange={(e) => {
                                setSelectedItemColor(e.target.value);
                                changeColor(e.target.value);
                            }}
                            style={{ top: '5px', left: '35px' }}
                            isVisible={colorPickerVisible}
                        />
                    </RelativeDiv>
                    {/* <Tooltip title='複製' placement='right'> */}
                    <ToolIconAno as={MdContentCopy} onClick={copySelectedItem} />
                    {/* </Tooltip> */}
                    {/* <Tooltip title='貼上' placement='right'> */}
                    <ToolIconAno as={MdContentPaste} onClick={pasteClipboardItem} />
                    {/* </Tooltip> */}
                    {/* <Tooltip title='刪除' placement='right'> */}
                    <ToolIconAno as={MdOutlineDelete} onClick={deleteSelectedItem} />
                    {/* </Tooltip> */}
                    {/* <Tooltip title='清空' placement='right'> */}
                    <ToolIconAno as={AiOutlineClear} onClick={handleClearCanvas} />
                    {/* </Tooltip> */}
                </StyledToolbar>
            </StyledCanvasContainer>
        </BoardContainer>
    );
};

export default Canvas;
