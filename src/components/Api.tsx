import { getToken } from  '../auth';

interface Options{
    when: number;
    what: number;
    cat: number;
}

export function getMovies(page: number = 1,
                          useId: string | number,
                          friendId: string | number = null,
                          groupId: string | number = null,
                          movieStatus: number = 0,
                          options: Options = {when:10 , what:1, cat:0}){

    const token = getToken();
    const when = options.when;
    const what = options.what;
    const cat = options.cat;
    const url = 'http://marios.com.gr/movies/api.php?status=13&userid=' + useId + '&page=' + page + '&when=' + when + '&what=' + what + '&cat=' + cat + '&token=' + token;
    //console.log('get movies', url);
    return fetch(url)
        .then(res => res.json())
        .then((result) => {
            return result.results.reverse();
        })
        .catch(error => console.warn(error));
}

export function getUsersMovies(page: number = 1, useId: string | number, mstatus: number){

    const token = getToken();
    const url = 'http://marios.com.gr/movies/api.php?status=14&userid=' + useId + '&page=' + page + '&mstatus=' + mstatus + '&token=' + token;
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
    const url = 'http://marios.com.gr/movies/api.php?status=11&fid=' + fid + '&uid=' + uid + '&token=' + token;
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
    const url = 'http://marios.com.gr/movies/api.php?status=' + status + '&email=' + email + '&uid=' + uid + '&token=' + token;
    //console.log('save user', url);
    return fetch(url)
        .then(res => res.json())
        .then((result) => {
        })
        .catch(error => console.warn(error));
}

export function getUser(uid: string, email: string){

    const token = getToken();
    const url = 'http://marios.com.gr/movies/api.php?status=4&uid=' + uid + '&email=' + email + '&token=' + token;
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
    const url = 'http://marios.com.gr/movies/api.php?status=3&uid=' + uid + '&mid=' + mid + '&mstatus=' + mstatus + '&token=' + token;
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
    const url = 'http://marios.com.gr/movies/api.php?status=5&uid=' + uid + '&token=' + token;
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
    const url = 'http://marios.com.gr/movies/api.php?status=6&q=' + q + '&uid=' + uid + '&token=' + token;
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
    const url = 'http://marios.com.gr/movies/api.php?status=7&fid=' + fid + '&uid=' + uid + '&token=' + token;
    //console.log('add friend', url);
    return fetch(url)
        .then(res => res.json())
        .then((result) => {
        })
        .catch(error => console.warn(error));
}

export function deleteFriend(uid: string, fid: number){

    const token = getToken();
    const url = 'http://marios.com.gr/movies/api.php?status=12&fid=' + fid + '&uid=' + uid + '&token=' + token;
    //console.log('add friend', url);
    return fetch(url)
        .then(res => res.json())
        .then((result) => {
        })
        .catch(error => console.warn(error));
}

export function getFriends(uid: string, fstatus: number){

    const token = getToken();
    const url = 'http://marios.com.gr/movies/api.php?status=8&fstatus=' + fstatus + '&uid=' + uid + '&token=' + token;
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
    const url = 'http://marios.com.gr/movies/api.php?status=9&uid=' + uid + '&token=' + token;
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
    const url = 'http://marios.com.gr/movies/api.php?status=10&fid=' + fid + '&reqstatus=' + status + '&token=' + token;
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
    const url = 'http://marios.com.gr/movies/api.php?status=15&uid=' + uid + '&mid='+ mid + '&mstatus='+ status + '&token=' + token;
    //console.log('accept friend request', url);
    return fetch(url)
        .then(res => res.json())
        .then((result) => {
            return result;
        })
        .catch(error => console.warn(error));
}
