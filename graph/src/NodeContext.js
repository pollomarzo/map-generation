import React from 'react'

const NodeContext = React.createContext(null)

export const NodeProvider = ({ state, children }) => {
    const [currentState, setCurrentState] = React.useState(state);

    return (
        <NodeContext.Provider value={{ currentState, setCurrentState }}>
            {children}
        </NodeContext.Provider>
    )
}

export const useNodeContext = () => React.useContext(NodeContext)