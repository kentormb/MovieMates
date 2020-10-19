export function Card(index,result){

    const date = new Date(result.releaseDate);

    const div = document.createElement('div');
    div.setAttribute('class','card');
    div.setAttribute('key',result.movieId);

    const poster = document.createElement('div');
    poster.setAttribute('class','poster');
    div.append(poster);
    const img = document.createElement('img');
    img.src = 'https://image.tmdb.org/t/p/w400/' + result.poster;
    poster.append(img);

    const content = document.createElement('div');
    content.setAttribute('class','content');
    div.append(content);

    const title = document.createElement('div');
    title.setAttribute('class','title');
    title.innerHTML = result.tagline === '' ? result.title : result.tagline ;
    content.append(title);

    const info = document.createElement('div');
    info.setAttribute('class','info');
    content.append(info);

    const year = document.createElement('div');
    year.setAttribute('class','year');
    year.innerText = '' + date.getFullYear();
    info.append(year);

    const calendar = document.createElement('img');
    calendar.src = 'assets/icon/calendar.png';
    calendar.onload = function() {
        calendar.setAttribute('class','calendar');
        year.append(calendar);
    };
    calendar.onerror = function (){
        calendar.remove();
    }

    const vote = document.createElement('div');
    vote.setAttribute('class','vote');
    vote.innerText = '' + result.voteAverage;
    info.append(vote);

    const ratingfront = document.createElement('img');
    ratingfront.src = 'assets/icon/rating.png';
    ratingfront.onload = function() {
        ratingfront.setAttribute('class','ratingfront');
        vote.append(ratingfront);
    };
    ratingfront.onerror = function (){
        ratingfront.remove();
    }

    const moreinfo = document.createElement('div');
    moreinfo.setAttribute('class','moreinfo');
    moreinfo.style.display = 'none';
    div.append(moreinfo);

    const original_language = document.createElement('div');
    original_language.setAttribute('class','original_language');
    original_language.innerText = '' + result.original_language;
    moreinfo.append(original_language);

    const flag = document.createElement('img');
    flag.src = 'assets/flags/' + result.original_language + '.png';
    flag.onload = function() {
        flag.setAttribute('class','flag');
        original_language.append(flag);
    };
    flag.onerror = function (){
        flag.remove();
    }

    const vote_average = document.createElement('div');
    vote_average.setAttribute('class','vote_average');
    vote_average.innerText = '' + result.voteAverage;
    moreinfo.append(vote_average);

    const rating = document.createElement('img');
    rating.src = 'assets/icon/rating.png';
    rating.onload = function() {
        rating.setAttribute('class','rating');
        vote_average.append(rating);
    };
    rating.onerror = function (){
        rating.remove();
    }

    const overview = document.createElement('div');
    overview.setAttribute('class','overview');
    overview.innerText = '' + result.description;
    moreinfo.append(overview);

    return div;
}
