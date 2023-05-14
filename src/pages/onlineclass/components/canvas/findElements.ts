export const findElements = (lines: any[], shapes: any[]) => {
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
    return { findShape, findLine };
};
