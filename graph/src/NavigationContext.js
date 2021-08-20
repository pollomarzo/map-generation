import React from 'react'

const NavigationContext = React.createContext(null)

export const NavigationProvider = ({ initialState, children }) => {
    const [navigationState, setNavigationState] = React.useState(initialState);

    return (
        <NavigationContext.Provider value={{ navigationState, setNavigationState }}>
            {children}
        </NavigationContext.Provider>
    )
}

export const useNavigationContext = () => React.useContext(NavigationContext)