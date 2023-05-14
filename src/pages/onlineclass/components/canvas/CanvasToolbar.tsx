import React, { useRef, useState } from 'react';
import styled from 'styled-components';
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

type ToolbarProps = {
    color: string;
    setColor: (color: string) => void;
    lineWidth: number;
    setLineWidth: (width: number) => void;
    shape: string | null;
    setShape: (shape: string | null) => void;
    selectedItemColor: string;
    setSelectedItemColor: (color: string) => void;
    changeColor: (color: string) => void;
    copySelectedItem: () => void;
    pasteClipboardItem: () => void;
    deleteSelectedItem: () => void;
    handleClearCanvas: () => void;
};

const StyledToolbar = styled.div`
    display: flex;
    flex-direction: column;
    align-items: flex-start;
    background: #dfdfdf;
    padding: 12px 8px;
    border-radius: 7px;
    position: absolute;
    left: 20px;
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

const Toolbar: React.FC<ToolbarProps> = ({
    color,
    setColor,
    lineWidth,
    setLineWidth,
    shape,
    setShape,
    selectedItemColor,
    setSelectedItemColor,
    changeColor,
    copySelectedItem,
    pasteClipboardItem,
    deleteSelectedItem,
    handleClearCanvas,
}) => {
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
        <StyledToolbar>
            <RelativeDiv>
                <ToolIcon onClick={handleColorLineClick}>
                    <MdOutlineColorLens />
                </ToolIcon>
                <StyledInput
                    type='color'
                    value={color}
                    onChange={(e) => setColor(e.target.value)}
                    ref={inputRef}
                    style={{ top: '-23px', left: '40px' }}
                />
            </RelativeDiv>
            <RelativeDiv>
                <ToolIcon onClick={handleLineWidthPickerClick}>
                    <RxBorderWidth />
                </ToolIcon>
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
                <ToolIcon onClick={handleShapeIconClick}>
                    <IoShapesOutline />
                </ToolIcon>
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
                <ToolIcon onClick={handleColorWandClick}>
                    <MdOutlineBorderColor />
                </ToolIcon>
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
            <ToolIconAno as={MdContentCopy} onClick={copySelectedItem} />
            <ToolIconAno as={MdContentPaste} onClick={pasteClipboardItem} />
            <ToolIconAno as={MdOutlineDelete} onClick={deleteSelectedItem} />
            <ToolIconAno as={AiOutlineClear} onClick={handleClearCanvas} />
        </StyledToolbar>
    );
};

export default Toolbar;
