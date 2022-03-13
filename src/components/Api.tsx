import { getToken } from  '../auth';

interface Options{
    when: number;
    what: number;
    cat: number;
}

export function getMovies(page: number = 1,
                          useId: string | number,
                          cat: string = '',
                          what: string = '1',
                          when: string = '10',
                          adult: number = 0,
                          prov: string){

    const token = getToken();
    const url = 'https://marios.com.gr/movies/api/?status=13&userid=' + useId + '&page=' + page + '&when=' + when + '&what=' + what + '&cat=' + cat + '&adult=' + adult + '&prov=' + prov + '&token=' + token;
    // console.log('get movies', url);
    return fetch(url)
        .then(res => res.json())
        .then((result) => {
            return result.results.reverse();
        })
        .catch(error => console.warn(error));
}

export function getUsersMovies(page: number = 1, useId: string | number, mstatus: number, seen: boolean){

    const token = getToken();
    const url = 'https://marios.com.gr/movies/api/?status=14&userid=' + useId + '&page=' + page + '&limit=20&seen=' + +seen + '&mstatus=' + mstatus + '&token=' + token;
    //console.log('get user movies', url);
    return fetch(url)
        .then(res => res.json())
        .then((result) => {
            return result.results;
        })
        .catch(error => console.warn(error));
}

export function getMatchedMovies(uid: string, fid: number){

    const token = getToken();
    const url = 'https://marios.com.gr/movies/api/?status=11&fid=' + fid + '&uid=' + uid + '&token=' + token;
    //console.log('get matched movies', url);
    return fetch(url)
        .then(res => res.json())
        .then((result) => {
            return result.results;
        })
        .catch(error => console.warn(error));
}

export function saveUser(uid: string, email: string, check: boolean = false){

    const token = getToken();
    const status = check ? 2 : 1;
    const url = 'https://marios.com.gr/movies/api/?status=' + status + '&email=' + email + '&uid=' + uid + '&token=' + token;
    //console.log('save user', url);
    return fetch(url)
        .then(res => res.json())
        .then((result) => {
        })
        .catch(error => console.warn(error));
}

export function getUser(uid: string, email: string){

    const token = getToken();
    const url = 'https://marios.com.gr/movies/api/?status=4&uid=' + uid + '&email=' + email + '&token=' + token;
    //console.log('get user', url);
    return fetch(url)
        .then(res => res.json())
        .then((result) => {
            return result;
        })
        .catch(error => console.warn(error));
}

export function updateUsersMovies(uid: string, mid: number, mstatus: number){

    const token = getToken();
    const url = 'https://marios.com.gr/movies/api/?status=3&uid=' + uid + '&mid=' + mid + '&mstatus=' + mstatus + '&token=' + token;
    //console.log('update movies', url);
    return fetch(url)
        .then(res => res.json())
        .catch(error => console.warn(error));
}

export function getMenuCounts(uid: string){
    const token = getToken();
    const url = 'https://marios.com.gr/movies/api/?status=5&uid=' + uid + '&token=' + token;
    //console.log('get menu count', url);
    return fetch(url)
        .then(res => res.json())
        .then((result) => {
            return {friends: result.results.friends, groups: result.results.groups, liked: result.results.liked, disliked: result.results.disliked, suggestions: result.results.suggestions};
        })
        .catch(error => console.warn(error));
}

export function searchFriend(uid: string, q: string){

    const token = getToken();
    const url = 'https://marios.com.gr/movies/api/?status=6&q=' + q + '&uid=' + uid + '&token=' + token;
    //console.log('save user', url);
    return fetch(url)
        .then(res => res.json())
        .then((result) => {
            return result;
        })
        .catch(error => console.warn(error));
}

export function addFriend(uid: string, fid: number){

    const token = getToken();
    const url = 'https://marios.com.gr/movies/api/?status=7&fid=' + fid + '&uid=' + uid + '&token=' + token;
    //console.log('add friend', url);
    return fetch(url)
        .then(res => res.json())
        .then((result) => {
        })
        .catch(error => console.warn(error));
}

export function deleteFriend(uid: string, fid: number){

    const token = getToken();
    const url = 'https://marios.com.gr/movies/api/?status=12&fid=' + fid + '&uid=' + uid + '&token=' + token;
    //console.log('add friend', url);
    return fetch(url)
        .then(res => res.json())
        .then((result) => {
        })
        .catch(error => console.warn(error));
}

export function getFriends(uid: string, fstatus: number){

    const token = getToken();
    const url = 'https://marios.com.gr/movies/api/?status=8&fstatus=' + fstatus + '&uid=' + uid + '&token=' + token;
    //console.log('get user friends', url);
    return fetch(url)
        .then(res => res.json())
        .then((result) => {
            return result;
        })
        .catch(error => console.warn(error));
}

export function getFriendById(uid: number){

    const token = getToken();
    const url = 'https://marios.com.gr/movies/api/?status=9&uid=' + uid + '&token=' + token;
    //console.log('get freind by id', url);
    return fetch(url)
        .then(res => res.json())
        .then((result) => {
            return result;
        })
        .catch(error => console.warn(error));
}

export function acceptFriendRequest(fid:number, status:boolean){
    const token = getToken();
    const url = 'https://marios.com.gr/movies/api/?status=10&fid=' + fid + '&reqstatus=' + status + '&token=' + token;
    //console.log('accept friend request', url);
    return fetch(url)
        .then(res => res.json())
        .then((result) => {
            return result;
        })
        .catch(error => console.warn(error));
}

export function seenThisMovie(uid:string, mid:number, status:number){
    const token = getToken();
    const url = 'https://marios.com.gr/movies/api/?status=15&uid=' + uid + '&mid='+ mid + '&mstatus='+ status + '&token=' + token;
    //console.log('accept friend request', url);
    return fetch(url)
        .then(res => res.json())
        .then((result) => {
            return result;
        })
        .catch(error => console.warn(error));
}

export function suggestMovieToFriend(uid:string, mid:number, fid:number){
    const token = getToken();
    const url = 'https://marios.com.gr/movies/api/?status=16&uid=' + uid + '&mid='+ mid + '&fid='+ fid + '&token=' + token;
    //console.log('suggest movie', url);
    return fetch(url)
        .then(res => res.json())
        .then((result) => {
            return result;
        })
        .catch(error => console.warn(error));
}

export function getIndicators(uid: string){
    const token = getToken();
    const url = 'https://marios.com.gr/movies/api/?status=17&uid=' + uid + '&token=' + token;
    //console.log('get menu count', url);
    return fetch(url)
        .then(res => res.json())
        .then((result) => {
            return result.results;
        })
        .catch(error => console.warn(error));
}

export function getSuggestedMovies(uid: string){

    const token = getToken();
    const url = 'https://marios.com.gr/movies/api/?status=18&uid=' + uid + '&token=' + token;
    //console.log('get suggested movies', url);
    return fetch(url)
        .then(res => res.json())
        .then((result) => {
            return result.results;
        })
        .catch(error => console.warn(error));
}

export function getProviders(uid:string, mid:number){
    const token = getToken();
    const url = 'https://marios.com.gr/movies/api/?status=19&uid=' + uid + '&mid='+ mid + '&token=' + token;
    //console.log('accept friend request', url);
    return fetch(url)
        .then(res => res.json())
        .then((result) => {
            return result;
        })
        .catch(error => console.warn(error));
}

export function getAllProviders(uid:string, page:number = 1){
    const token = getToken();
    const url = 'https://marios.com.gr/movies/api/?status=20&uid=' + uid + '&page=' + page + '&token=' + token;
    //console.log('accept friend request', url);
    return fetch(url)
        .then(res => res.json())
        .then((result) => {
            return result;
        })
        .catch(error => console.warn(error));
}

export function saveGroup(uid:string, name:string, friends:string){
    const token = getToken();
    const url = 'https://marios.com.gr/movies/api/?status=21&uid=' + uid + '&groupname=' + name + '&friends=' + friends + '&token=' + token;
    //console.log('save group', url);
    return fetch(url)
        .then(res => res.json())
        .then((result) => {
            return result;
        })
        .catch(error => console.warn(error));
}

export function getGroups(uid:string){
    const token = getToken();
    const url = 'https://marios.com.gr/movies/api/?status=22&uid=' + uid + '&token=' + token;
    //console.log('get group', url);
    return fetch(url)
        .then(res => res.json())
        .then((result) => {
            return result;
        })
        .catch(error => console.warn(error));
}

export function deleteGroup(uid: string, gid: number){

    const token = getToken();
    const url = 'https://marios.com.gr/movies/api/?status=23&gid=' + gid + '&uid=' + uid + '&token=' + token;
    //console.log('add friend', url);
    return fetch(url)
        .then(res => res.json())
        .then((result) => {
        })
        .catch(error => console.warn(error));
}

export function getGroupById(uid: string, gid: number){

    const token = getToken();
    const url = 'https://marios.com.gr/movies/api/?status=24&gid=' + gid + '&uid=' + uid + '&token=' + token;
    //console.log('get freind by id', url);
    return fetch(url)
        .then(res => res.json())
        .then((result) => {
            return result;
        })
        .catch(error => console.warn(error));
}

export function getMatchedGroupedMovies(uid: string, gid: number){

    const token = getToken();
    const url = 'https://marios.com.gr/movies/api/?status=25&gid=' + gid + '&uid=' + uid + '&token=' + token;
    //console.log('get matched grouped movies', url);
    return fetch(url)
        .then(res => res.json())
        .then((result) => {
            return result.results;
        })
        .catch(error => console.warn(error));
}

export function deleteGroupUser(uid: string, gid: number, fid: number){

    const token = getToken();
    const url = 'https://marios.com.gr/movies/api/?status=26&gid=' + gid + '&uid=' + uid + '&fid=' + fid + '&token=' + token;
    //console.log('delete Group User', url);
    return fetch(url)
        .then(res => res.json())
        .then((result) => {
        })
        .catch(error => console.warn(error));
}

export function addGroupFriends(uid:string, gid: number, friends:string){
    const token = getToken();
    const url = 'https://marios.com.gr/movies/api/?status=27&uid=' + uid + '&gid=' + gid + '&friends=' + friends + '&token=' + token;
    //console.log('add Group Friends', url);
    return fetch(url)
        .then(res => res.json())
        .then((result) => {
            return result;
        })
        .catch(error => console.warn(error));
}
