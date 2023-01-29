import { useState, useEffect, FormEvent, useCallback } from 'react';
import './App.css';

const App = (): JSX.Element => {
    // component states
    const [elements, setElements] = useState<string[]>([]);
    const [inpElement, setInpElement] = useState<string>('');
    const [ptr, setPtr] = useState<number>(elements.length - 1);
    const [elementsTillPtr, setElementsTillPtr] = useState<string[]>([]);

    // component callbacks
    const ptrValidatorCB = useCallback(
        (value: number) => {
            return value >= -1 && value <= elements.length - 1;
        },
        [elements]
    );

    const handleKeyboardInputCB = useCallback(
        (e: KeyboardEvent) => {
            if (e.ctrlKey && e.key.toLowerCase() === 'z') {
                e.preventDefault();

                setPtr(currentPtr => {
                    const desiredPtr = currentPtr - 1;

                    const isValid = ptrValidatorCB(desiredPtr);

                    return isValid ? desiredPtr : currentPtr;
                });
            }

            if (e.ctrlKey && e.key.toLowerCase() === 'y') {
                e.preventDefault();

                setPtr(currentPtr => {
                    const desiredPtr = currentPtr + 1;

                    const isValid = ptrValidatorCB(desiredPtr);

                    return isValid ? desiredPtr : currentPtr;
                });
            }
        },
        [ptrValidatorCB]
    );

    // component effects
    useEffect(() => {
        document.addEventListener('keydown', handleKeyboardInputCB);

        return () =>
            document.removeEventListener('keydown', handleKeyboardInputCB);
    }, [handleKeyboardInputCB]);

    useEffect(() => {
        setPtr(elements.length - 1);
    }, [elements]);

    // useEffect(() => {
    //     setElements(elements => {
    //         if (elements.length && ptr < elements.length - 1) {
    //             return elements.splice(ptr + 1, 1);
    //         }

    //         return elements;
    //     });
    // }, [ptr]);

    useEffect(() => {
        if (ptr > -1) {
            setElementsTillPtr(elements.slice(0, ptr + 1));
        }

        if (ptr === -1) {
            setElementsTillPtr([]);
        }
    }, [ptr, elements]);

    // event handlers
    const handleFormSubmit = (e: FormEvent<HTMLFormElement>) => {
        e.preventDefault();

        if (inpElement.length) {
            setElements([...elements, inpElement]);
            setInpElement('');
        }
    };

    return (
        <div className="App">
            <h1>Basic Undo / Redo</h1>

            <form onSubmit={handleFormSubmit} style={{ margin: '50px auto' }}>
                <input
                    type="text"
                    value={inpElement}
                    placeholder="New Name"
                    onChange={e => setInpElement(e.target.value)}
                />
            </form>

            {elementsTillPtr.length > 0 && (
                <>
                    <h1>Elements:</h1>

                    <ul>
                        {elementsTillPtr.map((n, i) => (
                            <li key={i}>{n.toUpperCase()}</li>
                        ))}
                    </ul>
                </>
            )}
        </div>
    );
};

export default App;
