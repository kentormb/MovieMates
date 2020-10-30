import React, {createContext, useEffect, useReducer} from "react";

const initialState = {
    count: 0
}

let AppContext = createContext(initialState as any);

const persistedState = window.localStorage['persistedState'] != undefined ? JSON.parse(window.localStorage['persistedState']) : []

let reducer = (state, action) => {
    switch(action.type) {
        case "setCount": {
            return { ...state, count: action.count }
        }
    }
    return state;
};

const logger = (reducer) => {
    const reducerWithLogger = (state, action) => {
        console.log("%cPrevious State:", "color: #9E9E9E; font-weight: 700;", state);
        console.log("%cAction:", "color: #00A7F7; font-weight: 700;", action);
        console.log("%cNext State:", "color: #47B04B; font-weight: 700;", reducer(state,action));
        return reducer(state,action);
    };
    return reducerWithLogger;
}

const loggerReducer = logger(reducer);

function AppContextProvider(props) {
    const fullInitialState = {
        ...initialState,
        ...persistedState
    }

    let [state, dispatch] = useReducer(loggerReducer, fullInitialState)

    useEffect(() => {
        // Persist any state we want to
        window.localStorage['persistedState'] = JSON.stringify({
            user: state.user
        });
    }, [state]);
    let value = { state, dispatch };

    return (
        <AppContext.Provider value={value}>{props.children}</AppContext.Provider>
    );
}

let AppContextConsumer = AppContext.Consumer;

export { AppContext, AppContextProvider, AppContextConsumer };
