import { createContext } from 'react';

const DataProviderContext = createContext<any>(null);

DataProviderContext.displayName = 'DataProviderContext';

export default DataProviderContext;
