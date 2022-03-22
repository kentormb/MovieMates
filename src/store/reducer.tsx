import {Dispatch} from "react";
import {Action} from "redux";

export enum ActionType {
    UPDATE_MENU = 'UPDATE_MENU',
    UPDATE_MENU_DISLIKED = 'UPDATE_MENU_DISLIKED',
    UPDATE_MENU_FRIENDS = 'UPDATE_MENU_FRIENDS',
    UPDATE_MENU_GROUPS = 'UPDATE_MENU_GROUPS',
    UPDATE_MENU_FRIENDS_INC = 'UPDATE_MENU_FRIENDS_INC',
    UPDATE_MENU_FRIENDS_DEC = 'UPDATE_MENU_FRIENDS_DEC',
    UPDATE_MENU_LIKES_INC = 'UPDATE_MENU_LIKES_INC',
    UPDATE_MENU_LIKES_DEC = 'UPDATE_MENU_LIKES_DEC',
    UPDATE_MENU_DISLIKES_INC = 'UPDATE_MENU_DISLIKES_INC',
    UPDATE_MENU_DISLIKES_DEC = 'UPDATE_MENU_DISLIKES_DEC',
    UPDATE_MENU_LIKED = 'UPDATE_MENU_LIKED',
    UPDATE_USER = 'UPDATE_USER',
    UPDATE_FRIENDS = 'UPDATE_FRIENDS',
    UPDATE_CATEGORIES = 'UPDATE_CATEGORIES',
    UPDATE_ORDERBY = 'UPDATE_ORDERBY',
    UPDATE_YEARS = 'UPDATE_YEARS',
    UPDATE_ADULT = 'UPDATE_ADULT',
    UPDATE_DARKM_MODE = 'UPDATE_DARKM_MODE',
    UPDATE_INDICATORS = 'UPDATE_INDICATORS',
    UPDATE_INDICATORS_MENU = 'UPDATE_INDICATORS_MENU',
    UPDATE_INDICATORS_FRIEND_REQUESTS = 'UPDATE_INDICATORS_FRIENDS_REQUESTS',
    UPDATE_INDICATORS_SUGGESTIONS = 'UPDATE_INDICATORS_SUGGESTIONS',
    UPDATE_SETTINGS = 'UPDATE_SETTINGS',
    UPDATE_SETTINGS_SLIDS = 'UPDATE_SETTINGS_SLIDS',
    UPDATE_SETTINGS_BUTTONS = 'UPDATE_SETTINGS_BUTTONS',
    UPDATE_SELECTED_PROVIDERS = 'UPDATE_SELECTED_PROVIDERS'
}

export const initialState = {
    menu: {disliked: 0, friends: 0, groups: 0,liked: 0, suggestions: 0},
    user: { username: '', name: '', photo: '', qr: '', birthday: '', token: ''},
    friends: [],
    categories: [],
    selectedProviders: [],
    orderBy: 1,
    years: 10,
    adult: 0,
    darkMode: true,
    indicators : {menu: false, friend_request: 0, suggestions: 0, groups: 0},
    settings: {slides: false, buttons: true}
}

export interface StateProps {
    menu: {disliked: number, friends: number, groups: number, liked: number, suggestions: number},
    user: { username: string, name: string, photo: string, qr: string, birthday: string, token: string},
    friends: [],
    categories: [],
    selectedProviders: [],
    orderBy: number,
    years: number,
    adult: number,
    darkMode: boolean,
    indicators : {menu: boolean, friend_request: number, suggestions: number, groups: number},
    settings: {slides: boolean, buttons: boolean}
}

interface DispatchAction extends Action<ActionType> {
    payload: Partial<StateProps>;
}

const reducer = (state = initialState, action) => {
    //console.log('[reducer]',action.type )
    switch (action.type) {
        case ActionType.UPDATE_MENU:
            return {
                ...state,
                menu: {disliked: action.payload.disliked, friends: action.payload.friends, groups: action.payload.groups, liked: action.payload.liked, suggestions: action.payload.suggestions}
            }
        case ActionType.UPDATE_MENU_DISLIKED:
            return {
                ...state,
                menu: {disliked: action.payload.disliked, friends: state.menu.friends, groups: state.menu.groups, liked: state.menu.liked, suggestions: state.menu.suggestions}
            }
        case ActionType.UPDATE_MENU_FRIENDS:
            return {
                ...state,
                menu: {disliked: state.menu.disliked, friends: action.payload.friends, groups: state.menu.groups, liked: state.menu.liked, suggestions: state.menu.suggestions}
            }
        case ActionType.UPDATE_MENU_GROUPS:
            return {
                ...state,
                menu: {disliked: state.menu.disliked, friends: state.menu.friends, groups: action.payload.groups, liked: state.menu.liked, suggestions: state.menu.suggestions}
            }
        case ActionType.UPDATE_MENU_FRIENDS_INC:
            return {
                ...state,
                menu: {disliked: state.menu.disliked, friends: state.menu.friends + 1, groups: state.menu.groups, liked: state.menu.liked, suggestions: state.menu.suggestions}
            }
        case ActionType.UPDATE_MENU_FRIENDS_DEC:
            return {
                ...state,
                menu: {disliked: state.menu.disliked, friends: state.menu.friends - 1, groups: state.menu.groups, liked: state.menu.liked, suggestions: state.menu.suggestions}
            }
        case ActionType.UPDATE_MENU_LIKES_INC:
            return {
                ...state,
                menu: {disliked: state.menu.disliked, friends: state.menu.friends, groups: state.menu.groups, liked: state.menu.liked + 1, suggestions: state.menu.suggestions}
            }
        case ActionType.UPDATE_MENU_LIKES_DEC:
            return {
                ...state,
                menu: {disliked: state.menu.disliked, friends: state.menu.friends, groups: state.menu.groups, liked: state.menu.liked - 1, suggestions: state.menu.suggestions}
            }
        case ActionType.UPDATE_MENU_DISLIKES_INC:
            return {
                ...state,
                menu: {disliked: state.menu.disliked + 1, friends: state.menu.friends, groups: state.menu.groups, liked: state.menu.liked, suggestions: state.menu.suggestions}
            }
        case ActionType.UPDATE_MENU_DISLIKES_DEC:
            return {
                ...state,
                menu: {disliked: state.menu.disliked - 1, friends: state.menu.friends, groups: state.menu.groups, liked: state.menu.liked, suggestions: state.menu.suggestions}
            }
        case ActionType.UPDATE_MENU_LIKED:
            return {
                ...state,
                menu: {disliked: state.menu.disliked, friends: state.menu.friends, groups: state.menu.groups, liked: action.payload.liked, suggestions: state.menu.suggestions}
            }
        case ActionType.UPDATE_USER:
            return {
                ...state,
                user: { username: action.payload.username, name: action.payload.name, photo: action.payload.photo, qr: action.payload.qr, birthday: action.payload.birthday, token: action.payload.token}
            }
        case ActionType.UPDATE_FRIENDS:
            return {
                ...state,
                friends: action.payload
            }
        case ActionType.UPDATE_CATEGORIES:
            return {
                ...state,
                categories: action.payload
            }
        case ActionType.UPDATE_ORDERBY:
            return {
                ...state,
                orderBy: action.payload
            }
        case ActionType.UPDATE_YEARS:
            return {
                ...state,
                years: action.payload
            }
        case ActionType.UPDATE_ADULT:
            return {
                ...state,
                adult: action.payload
            }
        case ActionType.UPDATE_DARKM_MODE:
            return {
                ...state,
                darkMode: action.payload
            }
        case ActionType.UPDATE_INDICATORS:
            return {
                ...state,
                indicators: action.payload
            }
        case ActionType.UPDATE_INDICATORS_MENU:
            return {
                ...state,
                indicators: {menu: action.payload, friend_request: state.indicators.friend_request, suggestions: state.indicators.suggestions, groups: state.indicators.groups}
            }
        case ActionType.UPDATE_INDICATORS_FRIEND_REQUESTS:
            return {
                ...state,
                indicators: {friend_request: action.payload, menu: state.indicators.menu, suggestions: state.indicators.suggestions, groups: state.indicators.groups}
            }
        case ActionType.UPDATE_INDICATORS_SUGGESTIONS:
            return {
                ...state,
                indicators: {suggestions: action.payload, menu: state.indicators.menu, friend_request: state.indicators.friend_request, groups: state.indicators.groups}
            }
        case ActionType.UPDATE_SETTINGS:
            return {
                ...state,
                settings: action.payload
            }
        case ActionType.UPDATE_SETTINGS_SLIDS:
            return {
                ...state,
                settings: {slides: action.payload, buttons: state.settings.buttons}
            }
        case ActionType.UPDATE_SETTINGS_BUTTONS:
            return {
                ...state,
                settings: {buttons: action.payload, slides: state.settings.slides}
            }
        case ActionType.UPDATE_SELECTED_PROVIDERS:
            return {
                ...state,
                selectedProviders: action.payload
            }
    }
    return state;
}

export class RootDispatcher {

    private readonly dispatch: Dispatch<DispatchAction>;

    constructor(dispatch: Dispatch<DispatchAction>){
        this.dispatch = dispatch;
    }

    updateMenu = (payload) => this.dispatch({type: ActionType.UPDATE_MENU, payload: payload});
    incFriendsCount = () =>  this.dispatch({type: ActionType.UPDATE_MENU_FRIENDS_INC, payload: {}});
    decFriendsCount = () =>  this.dispatch({type: ActionType.UPDATE_MENU_FRIENDS_DEC, payload: {}});
    incLiked = () => this.dispatch({type: ActionType.UPDATE_MENU_LIKES_INC, payload: {}});
    decLiked = () => this.dispatch({type: ActionType.UPDATE_MENU_LIKES_DEC, payload: {}});
    incDisLiked = () => this.dispatch({type: ActionType.UPDATE_MENU_DISLIKES_INC, payload: {}});
    decDisLiked = () => this.dispatch({type: ActionType.UPDATE_MENU_DISLIKES_DEC, payload: {}});
    updateUser = (payload) => this.dispatch({type: ActionType.UPDATE_USER, payload: payload});
    updateCategories = (payload) => this.dispatch({type: ActionType.UPDATE_CATEGORIES, payload: payload});
    updateOrderBy = (payload) => this.dispatch({type: ActionType.UPDATE_ORDERBY, payload: payload});
    updateYears = (payload) => this.dispatch({type: ActionType.UPDATE_YEARS, payload: payload});
    updateAdults = (payload) => this.dispatch({type: ActionType.UPDATE_ADULT, payload: payload});
    updateDarkMode = (payload) => this.dispatch({type: ActionType.UPDATE_DARKM_MODE, payload: payload});
    updateIndicators = (payload) => this.dispatch({type: ActionType.UPDATE_INDICATORS, payload: payload});
    updateIndicatorsMenu = (payload) => this.dispatch({type: ActionType.UPDATE_INDICATORS_MENU, payload: payload});
    updateIndicatorsFriendRequests = (payload) => this.dispatch({type: ActionType.UPDATE_INDICATORS_FRIEND_REQUESTS, payload: payload});
    updateIndicatorsSuggestions = (payload) => this.dispatch({type: ActionType.UPDATE_INDICATORS_SUGGESTIONS, payload: payload});
    updateFriends = (payload) => this.dispatch({type: ActionType.UPDATE_FRIENDS, payload: payload});
    updateSettings = (payload) => this.dispatch({type: ActionType.UPDATE_SETTINGS, payload: payload});
    updateSettingsSlides = (payload) => this.dispatch({type: ActionType.UPDATE_SETTINGS_SLIDS, payload: payload});
    updateSettingsButtons = (payload) => this.dispatch({type: ActionType.UPDATE_SETTINGS_BUTTONS, payload: payload});
    updateSelectedProviders = (payload) => this.dispatch({type: ActionType.UPDATE_SELECTED_PROVIDERS, payload: payload});
}

export default reducer;
