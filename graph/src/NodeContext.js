import React from 'react'

const NodeContext = React.createContext(null)

export const NodeProvider = ({ state, children }) => {
    const [navigationState, setNavigationState] = React.useState(state);
    const [showResults, setShowResults] = React.useState(false);

    return (
        <NodeContext.Provider value={{ navigationState, setNavigationState, showResults, setShowResults }}>
            {children}
        </NodeContext.Provider>
    )
}

export const useNodeContext = () => React.useContext(NodeContext)