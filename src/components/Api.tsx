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
                          options: Options = {when:5, what:1, cat:0}){

    const token = getToken();
    const when = options.when;
    const what = options.what;
    const cat = options.cat;
    const url = 'http://marios.com.gr/movies/api.php?userid=' + useId + '&page=' + page + '&when=' + when + '&what=' + what + '&cat=' + cat + '&token=' + token;
    //console.log('get movies', url);
    return fetch(url)
        .then(res => res.json())
        .then((result) => {
            return result.results.reverse();
        })
        .catch(error => console.warn(error));
}


export function saveUser(uid: string, email: string, check: boolean = false){

    const token = getToken();
    const status = check ? 2 : 1;
    const url = 'http://marios.com.gr/movies/apiuser.php?status=' + status + '&email=' + email + '&uid=' + uid + '&token=' + token;
    //console.log('save user', url);
    return fetch(url)
        .then(res => res.json())
        .then((result) => {
        })
        .catch(error => console.warn(error));
}

export function updateUsersMovies(uid: string, mid: number, mstatus: number){

    const token = getToken();
    const url = 'http://marios.com.gr/movies/apiuser.php?status=3&uid=' + uid + '&mid=' + mid + '&mstatus=' + mstatus + '&token=' + token;
    //console.log('update movies', url);
    fetch(url)
        .then(res => res.json())
        .then((result) => {
        })
        .catch(error => console.warn(error));
}
