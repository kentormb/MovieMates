export function Card(index,result,cb = null){

    const date = new Date(result.releaseDate);

    const card = document.createElement('div');
    result?.seen === 1 ?
        card.setAttribute('class','card seen') :
        card.setAttribute('class','card');

    card.setAttribute('key',result.movieId);

    const poster = document.createElement('div');
    poster.setAttribute('class','poster');
    card.append(poster);

    const img = document.createElement('img');
    img.src = 'https://image.tmdb.org/t/p/w400' + result.poster;
    poster.append(img);

    if(result.seen !== undefined){

        if(result.seen === 1){
            const seen = document.createElement('div');
            seen.setAttribute('class','seen-layer');
            poster.append(seen);
        }
        else{
            const seenbtn = document.createElement('span');
            seenbtn.setAttribute('class','seen-btn');
            if(cb !== null){
                seenbtn.addEventListener('click', () => { cb(result.movieId, 1) });
            }
            card.append(seenbtn);

            const tickbtn = document.createElement('img');
            tickbtn.src = 'assets/icon/eye.png';
            seenbtn.append(tickbtn);
        }
    }

    const content = document.createElement('div');
    content.setAttribute('class','content');
    card.append(content);

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
    moreinfo.addEventListener('click', () => {
        if (moreinfo.style.display === "none") {
            moreinfo.style.display = "block";
        } else {
            moreinfo.style.display = "none";
        }
    });
    card.append(moreinfo);

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

    if(result?.seen === 1){
        const unseen = document.createElement('img');
        unseen.setAttribute('class','unseen-btn');
        unseen.src = 'assets/icon/unseen.png';
        if(cb !== null){
            unseen.addEventListener('click', () => { cb(result.movieId,0) });
        }
        moreinfo.append(unseen);
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

    if(result.trailer !== null){
        const trailer = document.createElement('div');
        trailer.setAttribute('class','trailer');
        const a = document.createElement('a');
        a.setAttribute('target','_blank')
        if(result.trailer_site === "YouTube"){
            //a.href = "https://www.youtube.com/embed/" + result.trailer;
            a.href = "https://www.youtube.com/watch?v=" + result.trailer;
            a.innerHTML = "Watch trailer on Youtube";
        }
        else if(result.trailer_site === "Vimeo"){
            //a.href = "https://player.vimeo.com/video/" + result.trailer;
            a.href = "https://vimeo.com/" + result.trailer;
            a.innerHTML = "Watch trailer on Vimeo";
        }
        trailer.append(a)
        moreinfo.append(trailer);
    }

    poster.addEventListener('click', () => {
        if (moreinfo.style.display === "none") {
            moreinfo.style.display = "block";
        } else {
            moreinfo.style.display = "none";
        }
    });

    return card;
}
