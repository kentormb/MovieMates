export const initialState = {
    menu: {disliked: 0, friends: 0, liked: 0},
    user: { username: '', name: '', photo: ''},
    friends: []
}

export interface StateProps {
    menu: {disliked: number, friends: number, liked: number},
    user: { username: string, name: string, photo: string},
    friends: []
}

const reducer = (state = initialState, action) => {
    console.log(state,action)
    switch (action.type) {
        case 'UPDATE_MENU':
            return {
                ...state,
                menu: {disliked: action.payload.disliked, friends: action.payload.friends, liked: action.payload.liked}
            }
        case 'UPDATE_MENU_DISLIKED':
            return {
                ...state,
                menu: {disliked: action.payload.disliked, friends: state.menu.friends, liked: state.menu.liked}
            }
        case 'UPDATE_MENU_FRIENDS':
            return {
                ...state,
                menu: {disliked: state.menu.disliked, friends: action.payload.friends, liked: state.menu.liked}
            }
        case 'UPDATE_MENU_FRIENDS_INC':
            return {
                ...state,
                menu: {disliked: state.menu.disliked, friends: state.menu.friends + 1, liked: state.menu.liked}
            }
        case 'UPDATE_MENU_FRIENDS_DEC':
            return {
                ...state,
                menu: {disliked: state.menu.disliked, friends: state.menu.friends - 1, liked: state.menu.liked}
            }
        case 'UPDATE_MENU_LIKED':
            return {
                ...state,
                menu: {disliked: state.menu.disliked, friends: state.menu.friends, liked: action.payload.liked}
            }
        case 'UPDATE_USER':
            return {
                ...state,
                user: { username: action.payload.username, name: action.payload.name, photo: action.payload.photo}
            }
        case 'UPDATE_FRIENDS':
            return {
                ...state,
                friends: action.payload
            }
    }
    return state;
}
export default reducer;
