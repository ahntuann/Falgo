import { useContext } from 'react';
import CodeEditingContext from '../context/CodeEditingContext';

const useCodeEditing = () => {
    const context = useContext(CodeEditingContext);

    if (!context) throw new Error('useCodeEditing must be used within CodeEditingContext');

    return context;
};

export default useCodeEditing;
