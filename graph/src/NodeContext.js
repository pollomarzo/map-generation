import React from 'react'

const NodeContext = React.createContext(null)

export const NodeProvider = ({ state, children }) => {
    const [navigationState, setNavigationState] = React.useState(state);

    return (
        <NodeContext.Provider value={{ navigationState, setNavigationState }}>
            {children}
        </NodeContext.Provider>
    )
}

export const useNodeContext = () => React.useContext(NodeContext)