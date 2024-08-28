import React, { useState, useEffect, useRef } from 'react';
import styled, { keyframes, css } from 'styled-components';
import { Rnd } from 'react-rnd';
import Image from 'next/image';

const fadeOutAnimation = (position, size) => keyframes`
  0% {
    opacity: 1;
    transform: translate(${position.x}px, ${position.y}px) scale(1);
  }
  100% {
    opacity: 0;
    transform: translate(${position.x}px, ${position.y}px) scale(0.5);
  }
`;

const WindowContainer = styled(Rnd)`
  background-color: #ffffff;
  border: 1px solid #ccc;
  border-radius: 10px;
  box-shadow: 0 10px 30px rgba(0, 0, 0, 0.2);
  z-index: 1000;
  overflow: hidden;

  ${({ $isFadingOut, $position, $size }) =>
        $isFadingOut &&
        css`
      animation: ${fadeOutAnimation($position, $size)} 0.3s forwards;
    `}
`;

const WindowHeader = styled.div`
  background-color: #333;
  color: #fff;
  padding: 10px;
  display: flex;
  justify-content: space-between;
  align-items: center;
  font-weight: bold;
  border-bottom: 1px solid #ccc;
  cursor: move;
`;

const WindowTitle = styled.div`
  font-size: 16px;
`;

const WindowSubTitle = styled.div`
  display: block;
  font-size: 14px;
  font-weight: 600;
  color: #666666;
  margin-bottom: 10px;
  text-align: left;
`;

const StyledList = styled.ul`
  padding-left: 20px;
  margin-bottom: 10px;
`;

const StyledListItem = styled.li`
  margin-bottom: 10px;
  padding-left: 10px;
  position: relative;
  color: #4a5568;
  font-size: 14px;

  &:before {
    content: '•';
    position: absolute;
    left: 0;
    color: #667eea;
  }
`;

const StyledLink = styled.a`
  color: #667eea;
  text-decoration: none;
  font-weight: bold;

  &:hover {
    text-decoration: underline;
    color: #5a67d8;
  }
`;

const StyledImage = styled(Image)`
  border-radius: 5px;
  height: auto;
  width: 45%;
`;

const CloseButton = styled.button`
  background: none;
  border: none;
  color: #fff;
  font-size: 16px;
  cursor: pointer;

  &:hover {
    color: #ff5c5c;
  }
`;

const WindowContent = styled.div`
  padding: 20px;
  color: #333;
  font-size: 14px;
  line-height: 1.5;
  overflow-y: auto;
  max-height: calc(100% - 40px);
`;

const StyledButton = styled.button`
  background-color: #667eea;
  color: #ffffff;
  padding: 10px 20px;
  border: none;
  border-radius: 5px;
  cursor: pointer;
  font-weight: bold;
  margin-bottom: 10px;

  &:hover {
    background-color: #5a67d8;
  }
`;

const HelpButton = styled.button`
  position: fixed;
  bottom: 10px;
  right: 10px;
  background-color: #667eea;
  color: #ffffff;
  padding: 10px 20px;
  border: none;
  border-radius: 20px;
  cursor: pointer;
  z-index: 1001;
  display: ${({ $isButtonVisible }) => ($isButtonVisible ? 'block' : 'none')};
`;

const PopUpWindow = () => {
    const [isVisible, setIsVisible] = useState(true);
    const [isFadingOut, setIsFadingOut] = useState(false);
    const [position, setPosition] = useState(null); // Initially null
    const [size, setSize] = useState(null); // Initially null
    const [windowSize, setWindowSize] = useState({
        width: window.innerWidth,
        height: window.innerHeight,
    });

    const [hasMounted, setHasMounted] = useState(false);

    useEffect(() => {
        const savedPosition = JSON.parse(localStorage.getItem('popup-position'));
        const savedSize = JSON.parse(localStorage.getItem('popup-size'));
        const savedVisibility = JSON.parse(localStorage.getItem('popup-visible'));

        setPosition(savedPosition || { x: (window.innerWidth - 600) / 2, y: (window.innerHeight - 420) / 2 });
        setSize(savedSize || { width: 600, height: 400 });
        if (savedVisibility !== null) setIsVisible(savedVisibility);

        setHasMounted(true);
    }, []);

    useEffect(() => {
        if (position && size) {
            localStorage.setItem('popup-position', JSON.stringify(position));
            localStorage.setItem('popup-size', JSON.stringify(size));
            localStorage.setItem('popup-visible', JSON.stringify(isVisible));
        }
    }, [position, size, isVisible]);

    useEffect(() => {
        const handleResize = () => {
            const newWidth = window.innerWidth;
            const newHeight = window.innerHeight;

            const deltaX = newWidth - windowSize.width;
            const deltaY = newHeight - windowSize.height;

            setPosition((prevPosition) => ({
                x: prevPosition.x + deltaX / 2,
                y: prevPosition.y + deltaY / 2,
            }));

            setWindowSize({ width: newWidth, height: newHeight });
        };

        window.addEventListener('resize', handleResize);
        return () => window.removeEventListener('resize', handleResize);
    }, [windowSize]);

    const handleClose = () => {
        setIsFadingOut(true);
        setTimeout(() => {
            setIsVisible(false);
        }, 300);
    };

    const handleReopen = () => {
        setIsVisible(true);
        setIsFadingOut(false);
    };

    const handleDoubleClick = () => {
        setPosition({ x: (window.innerWidth - 600) / 2, y: (window.innerHeight - 420) / 2 });
        setSize({ width: 600, height: 400 });
    };

    if (!hasMounted || !position || !size) {
        return null;
    }

    return (
        <>
            {isVisible && (
                <WindowContainer
                    $isFadingOut={isFadingOut}
                    $position={position}
                    $size={size}
                    position={position}
                    size={size}
                    minWidth={300}
                    minHeight={200}
                    bounds="window"
                    dragHandleClassName="drag-handle"
                    onDragStop={(e, d) => setPosition({ x: d.x, y: d.y })}
                    onResizeStop={(e, direction, ref, delta, position) => {
                        setSize({
                            width: ref.style.width,
                            height: ref.style.height,
                        });
                        setPosition(position);
                    }}
                >
                    <WindowHeader className="drag-handle" onDoubleClick={handleDoubleClick}>
                        <WindowTitle>Welcome to Goodreads Book Selector</WindowTitle>
                        <CloseButton onClick={handleClose}>—</CloseButton>
                    </WindowHeader>
                    <WindowContent>
                        <WindowSubTitle>Here is how to get your To-Read List from Goodreads and upload it:</WindowSubTitle>
                        <StyledList>
                            <StyledListItem>
                                Visit this{' '}
                                <StyledLink href="https://www.goodreads.com/review/import" target="_blank">
                                    link
                                </StyledLink>{' '}
                                and click this button at the top of the page.
                                <br />
                                <StyledImage
                                    src="/Export_Image.png"
                                    priority={true}
                                    alt="Export button"
                                    width={250}
                                    height={125}
                                />
                            </StyledListItem>
                            <StyledListItem>This might take a minute to generate the CSV.</StyledListItem>
                            <StyledListItem>
                                Click the link that has now appeared below the button.
                                <br />
                                &ensp; it will look like this:
                                <StyledImage
                                    src="/Download_Image.png"
                                    priority={true}
                                    alt="Download button"
                                    width={200}
                                    height={100}
                                />
                            </StyledListItem>
                            <StyledListItem>
                                Upload the file you just downloaded using the button behind this window.
                            </StyledListItem>
                            <StyledListItem>
                                Start exploring your To-Read list by selecting a genre!
                            </StyledListItem>
                        </StyledList>
                        <StyledButton onClick={handleClose}>Got it!</StyledButton>
                    </WindowContent>
                </WindowContainer>
            )}
            <HelpButton $isButtonVisible={!isVisible} onClick={handleReopen}>
                ?
            </HelpButton>
        </>
    );
};

export default PopUpWindow;
