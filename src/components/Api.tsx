import { requestOptions } from  '../auth';

export function getMovies(page: number = 1,
                          uid: string | number,
                          cat: string = '',
                          what: string = '1',
                          when: string = '10',
                          adult: number = 0,
                          prov: string){

    const request = requestOptions();
    const url = request.domain + '/?status=13&uid=' + uid + '&page=' + page + '&when=' + when + '&what=' + what + '&cat=' + cat + '&adult=' + adult + '&prov=' + prov + '&token=' + request.token;
    // console.log('get movies', url);
    return fetch(url, request.options)
        .then(res => res.json())
        .then((result) => {
            return handleResult(result.results.reverse());
        })
        .catch(error => console.warn(error));
}

export function getUsersMovies(page: number = 1, uid: string | number, mstatus: number, seen: boolean){

    const request = requestOptions();
    const url = request.domain + '/?status=14&uid=' + uid + '&page=' + page + '&limit=20&seen=' + +seen + '&mstatus=' + mstatus + '&token=' + request.token;
    //console.log('get user movies', url);
    return fetch(url, request.options)
        .then(res => res.json())
        .then((result) => {
            return handleResult(result.results);
        })
        .catch(error => console.warn(error));
}

export function getMatchedMovies(uid: string, fid: number){

    const request = requestOptions();
    const url = request.domain + '/?status=11&fid=' + fid + '&uid=' + uid + '&token=' + request.token;
    //console.log('get matched movies', url);
    return fetch(url, request.options)
        .then(res => res.json())
        .then((result) => {
            return handleResult(result.results);
        })
        .catch(error => console.warn(error));
}

export function saveUser(uid: string, email: string, check: boolean = false){

    const request = requestOptions();
    const status = check ? 2 : 1
    const url = request.domain + '/?status=' + status + '&email=' + email + '&uid=' + uid + '&token=' + request.token;
    //console.log('save user', url);
    return fetch(url, request.options)
        .then(res => res.json())
        .then((result) => {
            return handleResult(result);
        })
        .catch(error => console.warn(error));
}

export function updateUsername(uid: string, username: string){

    const request = requestOptions();
    const url = request.domain + '/?status=28&username=' + username + '&uid=' + uid + '&token=' + request.token;
    //console.log('save user', url);
    return fetch(url, request.options)
        .then(res => res.json())
        .then((result) => {
            return handleResult(result);
        })
        .catch(error => console.warn(error));
}

export function updateName(uid: string, name: string){

    const request = requestOptions();
    const url = request.domain + '/?status=29&name=' + name + '&uid=' + uid + '&token=' + request.token;
    //console.log('save user', url);
    return fetch(url, request.options)
        .then(res => res.json())
        .then((result) => {
            return handleResult(result);
        })
        .catch(error => console.warn(error));
}

export function updateBirthday(uid: string, birthday: string){

    const request = requestOptions();
    const url = request.domain + '/?status=30&birthday=' + birthday + '&uid=' + uid + '&token=' + request.token;
    //console.log('save user', url);
    return fetch(url, request.options)
        .then(res => res.json())
        .then((result) => {
            return handleResult(result);
        })
        .catch(error => console.warn(error));
}

export function deleteAccount(uid: string){

    const request = requestOptions();
    const url = request.domain + '/?status=31&uid=' + uid + '&token=' + request.token;
    //console.log('save user', url);
    return fetch(url, request.options)
        .then(res => res.json())
        .then((result) => {
            return handleResult(result);
        })
        .catch(error => console.warn(error));
}

export function getUser(uid: string, email: string){

    const request = requestOptions();
    const url = request.domain + '/?status=4&uid=' + uid + '&email=' + email + '&token=' + request.token;
    //console.log('get user', url);
    return fetch(url, request.options)
        .then(res => res.json())
        .then((result) => {
            return handleResult(result);
        })
        .catch(error => console.warn(error));
}

export function updateUsersMovies(uid: string, mid: number, mstatus: number){

    const request = requestOptions();
    const url = request.domain + '/?status=3&uid=' + uid + '&mid=' + mid + '&mstatus=' + mstatus + '&token=' + request.token;
    //console.log('update movies', url);
    return fetch(url, request.options)
        .then(res => res.json())
        .catch(error => console.warn(error));
}

export function getMenuCounts(uid: string){
    const request = requestOptions();
    const url = request.domain + '/?status=5&uid=' + uid + '&token=' + request.token;
    //console.log('get menu count', url);
    return fetch(url, request.options)
        .then(res => res.json())
        .then((result) => {
            return {friends: result.results.friends, groups: result.results.groups, liked: result.results.liked, disliked: result.results.disliked, suggestions: result.results.suggestions};
        })
        .catch(error => console.warn(error));
}

export function searchFriend(uid: string, q: string){

    const request = requestOptions();
    const url = request.domain + '/?status=6&q=' + q + '&uid=' + uid + '&token=' + request.token;
    //console.log('save user', url);
    return fetch(url, request.options)
        .then(res => res.json())
        .then((result) => {
            return handleResult(result);
        })
        .catch(error => console.warn(error));
}

export function addFriend(uid: string, fid: number){

    const request = requestOptions();
    const url = request.domain + '/?status=7&fid=' + fid + '&uid=' + uid + '&token=' + request.token;
    //console.log('add friend', url);
    return fetch(url, request.options)
        .then(res => res.json())
        .then((result) => {
        })
        .catch(error => console.warn(error));
}

export function deleteFriend(uid: string, fid: number){

    const request = requestOptions();
    const url = request.domain + '/?status=12&fid=' + fid + '&uid=' + uid + '&token=' + request.token;
    //console.log('add friend', url);
    return fetch(url, request.options)
        .then(res => res.json())
        .then((result) => {
            return handleResult(result);
        })
        .catch(error => console.warn(error));
}

export function getFriends(uid: string, fstatus: number){

    const request = requestOptions();
    const url = request.domain + '/?status=8&fstatus=' + fstatus + '&uid=' + uid + '&token=' + request.token;
    //console.log('get user friends', url);
    return fetch(url, request.options)
        .then(res => res.json())
        .then((result) => {
            return handleResult(result);
        })
        .catch(error => console.warn(error));
}

export function getFriendById(uid: string, fid: number){

    const request = requestOptions();
    const url = request.domain + '/?status=9&uid=' + uid + '&fid=' + fid + '&token=' + request.token;
    //console.log('get freind by id', url);
    return fetch(url, request.options)
        .then(res => res.json())
        .then((result) => {
            return handleResult(result);
        })
        .catch(error => console.warn(error));
}

export function acceptFriendRequest(uid: string, fid:number, status:boolean){
    const request = requestOptions();
    const url = request.domain + '/?status=10&uid=' + uid + '&fid=' + fid + '&reqstatus=' + status + '&token=' + request.token;
    //console.log('accept friend request', url);
    return fetch(url, request.options)
        .then(res => res.json())
        .then((result) => {
            return handleResult(result);
        })
        .catch(error => console.warn(error));
}

export function seenThisMovie(uid: string, mid:number, status:number){
    const request = requestOptions();
    const url = request.domain + '/?status=15&uid=' + uid + '&mid='+ mid + '&mstatus='+ status + '&token=' + request.token;
    //console.log('accept friend request', url);
    return fetch(url, request.options)
        .then(res => res.json())
        .then((result) => {
            return handleResult(result);
        })
        .catch(error => console.warn(error));
}

export function suggestMovieToFriend(uid: string, mid:number, fid:number){
    const request = requestOptions();
    const url = request.domain + '/?status=16&uid=' + uid + '&mid='+ mid + '&fid='+ fid + '&token=' + request.token;
    //console.log('suggest movie', url);
    return fetch(url, request.options)
        .then(res => res.json())
        .then((result) => {
            return handleResult(result);
        })
        .catch(error => console.warn(error));
}

export function getIndicators(uid: string){
    const request = requestOptions();
    const url = request.domain + '/?status=17&uid=' + uid + '&token=' + request.token;
    //console.log('get menu count', url);
    return fetch(url, request.options)
        .then(res => res.json())
        .then((result) => {
            return handleResult(result.results);
        })
        .catch(error => console.warn(error));
}

export function getSuggestedMovies(uid: string){

    const request = requestOptions();
    const url = request.domain + '/?status=18&uid=' + uid + '&token=' + request.token;
    //console.log('get suggested movies', url);
    return fetch(url, request.options)
        .then(res => res.json())
        .then((result) => {
            return handleResult(result.results);
        })
        .catch(error => console.warn(error));
}

export function getProviders(uid: string, mid: number){
    const request = requestOptions();
    const url = request.domain + '/?status=19&uid=' + uid + '&mid='+ mid + '&token=' + request.token;
    //console.log('accept friend request', url);
    return fetch(url, request.options)
        .then(res => res.json())
        .then((result) => {
            return handleResult(result);
        })
        .catch(error => console.warn(error));
}

export function getAllProviders(uid: string, page: number = 1){
    const request = requestOptions();
    const url = request.domain + '/?status=20&uid=' + uid + '&page=' + page + '&token=' + request.token;
    //console.log('accept friend request', url);
    return fetch(url, request.options)
        .then(res => res.json())
        .then((result) => {
            return handleResult(result);
        })
        .catch(error => console.warn(error));
}

export function saveGroup(uid: string, name: string, friends: string){
    const request = requestOptions();
    const url = request.domain + '/?status=21&uid=' + uid + '&groupname=' + name + '&friends=' + friends + '&token=' + request.token;
    //console.log('save group', url);
    return fetch(url, request.options)
        .then(res => res.json())
        .then((result) => {
            return handleResult(result);
        })
        .catch(error => console.warn(error));
}

export function getGroups(uid: string){
    const request = requestOptions();
    const url = request.domain + '/?status=22&uid=' + uid + '&token=' + request.token;
    //console.log('get group', url);
    return fetch(url, request.options)
        .then(res => res.json())
        .then((result) => {
            return handleResult(result);
        })
        .catch(error => console.warn(error));
}

export function deleteGroup(uid: string, gid: number){

    const request = requestOptions();
    const url = request.domain + '/?status=23&gid=' + gid + '&uid=' + uid + '&token=' + request.token;
    //console.log('add friend', url);
    return fetch(url, request.options)
        .then(res => res.json())
        .then((result) => {
            return handleResult(result);
        })
        .catch(error => console.warn(error));
}

export function getGroupById(uid: string, gid: number){

    const request = requestOptions();
    const url = request.domain + '/?status=24&gid=' + gid + '&uid=' + uid + '&token=' + request.token;
    //console.log('get freind by id', url);
    return fetch(url, request.options)
        .then(res => res.json())
        .then((result) => {
            return handleResult(result);
        })
        .catch(error => console.warn(error));
}

export function getMatchedGroupedMovies(uid: string, gid: number){

    const request = requestOptions();
    const url = request.domain + '/?status=25&gid=' + gid + '&uid=' + uid + '&token=' + request.token;
    //console.log('get matched grouped movies', url);
    return fetch(url, request.options)
        .then(res => res.json())
        .then((result) => {
            return handleResult(result.results);
        })
        .catch(error => console.warn(error));
}

export function deleteGroupUser(uid: string, gid: number, fid: number){

    const request = requestOptions();
    const url = request.domain + '/?status=26&gid=' + gid + '&uid=' + uid + '&fid=' + fid + '&token=' + request.token;
    //console.log('delete Group User', url);
    return fetch(url, request.options)
        .then(res => res.json())
        .then((result) => {
            return handleResult(result);
        })
        .catch(error => console.warn(error));
}

export function addGroupFriends(uid: string, gid: number, friends:string){
    const request = requestOptions();
    const url = request.domain + '/?status=27&uid=' + uid + '&gid=' + gid + '&friends=' + friends + '&token=' + request.token;
    //console.log('add Group Friends', url);
    return fetch(url, request.options)
        .then(res => res.json())
        .then((result) => {
            return handleResult(result);
        })
        .catch(error => console.warn(error));
}

function handleResult(res){
    // if(res.error && res.error === 99 || res === 99){
    //     const token = createAccessToken();
    // }
    return res
}
