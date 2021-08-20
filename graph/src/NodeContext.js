import React from 'react'

const NodeContext = React.createContext(null)

export const NodeProvider = ({ children }) => {
    const [showResults, setShowResults] = React.useState(false);

    return (
        <NodeContext.Provider value={{ showResults, setShowResults }}>
            {children}
        </NodeContext.Provider>
    )
}

export const useNodeContext = () => React.useContext(NodeContext)