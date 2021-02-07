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
                          adult: number = 0){

    const token = getToken();
    const url = 'https://marios.com.gr/movies/api/?status=13&userid=' + useId + '&page=' + page + '&when=' + when + '&what=' + what + '&cat=' + cat + '&adult=' + adult + '&token=' + token;
    //console.log('get movies', url);
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

export function getRandomAvatar(name){
    //https://stackoverflow.com/questions/6150289/how-can-i-convert-an-image-into-base64-string-using-javascript
    return fetch('https://eu.ui-avatars.com/api/?background=random&name='+name)
        .then(response => response.blob())
        .then(blob => new Promise((resolve, reject) => {
            const reader = new FileReader()
            reader.onloadend = () => resolve(reader.result)
            reader.onerror = reject
            reader.readAsDataURL(blob)
        }))
}

export function getMenuCounts(uid: string){
    const token = getToken();
    const url = 'https://marios.com.gr/movies/api/?status=5&uid=' + uid + '&token=' + token;
    //console.log('get menu count', url);
    return fetch(url)
        .then(res => res.json())
        .then((result) => {
            return {friends: result.results.friends, liked: result.results.liked, disliked: result.results.disliked};
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
