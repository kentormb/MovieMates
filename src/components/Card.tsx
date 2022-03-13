import {getProviders} from "./Api";
import {getCurrentUser} from "../auth";
import {Plugins} from "@capacitor/core";

export function Card(index,result,cb = null){

    const { Storage } = Plugins;
    const date = new Date(result.releaseDate);
    let movieProviders = [];
    let providersList = [];
    let selectedType = '';
    let selectedLang = '';

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
    moreinfo.addEventListener('click', (e) => {
        let close = true;
        e.composedPath().map((el)=>{
            // @ts-ignore
            if(el.className === 'providers nomove'){
                close = false;
                return;
            }
        })
        if (moreinfo.style.display === "none") {
            moreinfo.style.display = "block";
        } else if(close) {
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

    if(result.trailer !== ''){
        const trailer = document.createElement('div');
        trailer.setAttribute('class','trailer');
        const a = document.createElement('a');
        a.setAttribute('target','_blank')
        if(result.trailer_site === "YouTube"){
            //a.href = "https://www.youtube.com/embed/" + result.trailer;
            a.href = "https://www.youtube.com/watch?v=" + result.trailer;
            a.innerHTML = "Watch trailer on Youtube";
            trailer.setAttribute('class','trailer youtube');
        }
        else if(result.trailer_site === "Vimeo"){
            //a.href = "https://player.vimeo.com/video/" + result.trailer;
            a.href = "https://vimeo.com/" + result.trailer;
            a.innerHTML = "Watch trailer on Vimeo";
            trailer.setAttribute('class','trailer vimeo');
        }
        trailer.append(a)
        moreinfo.append(trailer);
    }

    const providers = document.createElement('div');
    providers.setAttribute('class','providers nomove');

    const provider_lang = document.createElement('div');
    provider_lang.setAttribute('class','lang nomove');
    const provider_lang_label = document.createElement('div');
    provider_lang_label.setAttribute('class','lang_label nomove');
    const provider_lang_container = document.createElement('div');
    provider_lang_container.setAttribute('class','lang_container nomove');
    provider_lang.append(provider_lang_label);
    provider_lang.append(provider_lang_container);

    const provider_type = document.createElement('div');
    provider_type.setAttribute('class','type nomove');
    const provider_type_label = document.createElement('div');
    provider_type_label.setAttribute('class','type_label nomove');
    const provider_type_container = document.createElement('div');
    provider_type_container.setAttribute('class','type_container nomove');
    provider_type.append(provider_type_label);
    provider_type.append(provider_type_container);

    const provider_container = document.createElement('div');
    provider_container.setAttribute('class','container nomove');

    provider_lang.addEventListener('click', (e)=>{
        if(provider_lang_container.style.display === ''){
            provider_lang_container.innerHTML = '';
            Object.keys(providersList).map((lng)=>{
                let l = document.createElement('span');
                l.setAttribute('class', 'nomove');
                l.innerHTML = lng;
                const lang_flag = document.createElement('img');
                lang_flag.src = 'assets/flags/' + lng.toLowerCase() + '.png';
                lang_flag.onload = function() {
                    lang_flag.setAttribute('class','flag nomove');
                    l.prepend(lang_flag);
                };
                lang_flag.onerror = function (){
                    lang_flag.remove();
                }
                l.addEventListener('click', (e)=>{
                    provider_lang_label.innerHTML = '';
                    provider_lang_label.append(l);
                    selectedLang = lng;
                    let prov_list = [];
                    if(providersList[lng][selectedType]){
                        prov_list = providersList[lng][selectedType]
                    }
                    else{
                       let t = Object.keys(providersList[lng])[0];
                        prov_list = providersList[lng][t];
                        provider_type_container.innerHTML = t;
                    }
                    provider_container.innerHTML = '';
                    if(prov_list.length > 0) {
                        prov_list.map((l) => {
                            let i = document.createElement('img');
                            i.src = 'https://image.tmdb.org/t/p/original' + l.path;
                            i.setAttribute('class', 'nomove');
                            provider_container.append(i);
                        })
                    }
                    Storage.set({
                        key: 'providers',
                        value: JSON.stringify({'lang': selectedLang, 'type': selectedType})
                    });
                });
                provider_lang_container.append(l);
            });
            provider_lang_container.style.display = 'flex';
            provider_type_container.style.display = ''
        }
        else{
            provider_lang_container.style.display = ''
        }
    });

    provider_type.addEventListener('click', (e)=>{
        if(provider_type_container.style.display === ''){
            provider_type_container.innerHTML = '';
            Object.keys(providersList[selectedLang]).map((type)=>{
                let tp = document.createElement('span');
                tp.setAttribute('class', 'nomove');
                tp.innerHTML = type;
                tp.addEventListener('click', (e)=>{
                    provider_type_label.innerHTML = '';
                    provider_type_label.append(tp);
                    selectedType = type;
                    let prov_list = [];
                    if(providersList[selectedLang][selectedType]){
                        prov_list = providersList[selectedLang][selectedType]
                    }
                    else{
                        let t = Object.keys(providersList[selectedLang])[0];
                        prov_list = providersList[selectedLang][t];
                        provider_type_container.innerHTML = t;
                    }
                    provider_container.innerHTML = '';
                    if(prov_list.length > 0) {
                        prov_list.map((l) => {
                            let i = document.createElement('img');
                            i.src = 'https://image.tmdb.org/t/p/original' + l.path;
                            i.setAttribute('class', 'nomove');
                            provider_container.append(i);
                        })
                    }
                    Storage.set({
                        key: 'providers',
                        value: JSON.stringify({'lang': selectedLang, 'type': selectedType})
                    });
                });
                provider_type_container.append(tp);
            });
            provider_type_container.style.display = 'flex';
            provider_lang_container.style.display = ''
        }
        else{
            provider_type_container.style.display = ''
        }
    });

    providers.append(provider_lang);
    providers.append(provider_type);
    providers.append(provider_container);
    moreinfo.append(providers);

    poster.addEventListener('click', (e) => {
        if (moreinfo.style.display === "none") {
            if(!movieProviders.includes(result.movieId)){
                movieProviders.push(result.movieId);
                getProviders(getCurrentUser().uid, result.movieId).then((res)=>{
                    if(res.error === 0){
                        providersList = [];
                        res.results.map((p)=>{
                            if(!providersList[p.lang]){
                                providersList[p.lang] = [];
                            }
                            if(!providersList[p.lang][p.type]){
                                providersList[p.lang][p.type] = [];
                            }
                            providersList[p.lang][p.type].push({'path': p.logo_path, 'name': p.provider_name});
                        })

                        if(Object.keys(providersList).length > 0){
                            Storage.get({ key: 'providers' }).then((sett)=>{
                                let storageProviders = JSON.parse(sett.value);
                                let first_lang =  storageProviders && storageProviders['lang'] ?
                                    (Object.keys(providersList).includes(storageProviders['lang']) ? storageProviders['lang'] : Object.keys(providersList)[0]) :
                                    Object.keys(providersList)[0];
                                let first_type = storageProviders && storageProviders['type'] ?
                                    (Object.keys(providersList[first_lang]).includes(storageProviders['type']) ? storageProviders['type'] : Object.keys(providersList[first_lang])[0]) :
                                    (Object.keys(providersList[first_lang]).includes('streaming') ? 'streaming' : Object.keys(providersList[first_lang])[0])
                                let prov_list = providersList[first_lang][first_type];

                                provider_lang_label.innerHTML = selectedLang = first_lang;
                                provider_type_label.innerHTML = selectedType = first_type;
                                prov_list.map((l)=>{
                                    let i = document.createElement('img');
                                    i.src = 'https://image.tmdb.org/t/p/original' + l.path;
                                    i.setAttribute('class','nomove');
                                    provider_container.append(i);
                                })
                                const prov_flag = document.createElement('img');
                                prov_flag.src = 'assets/flags/' + first_lang.toLowerCase() + '.png';
                                prov_flag.onload = function() {
                                    prov_flag.setAttribute('class','flag nomove');
                                    provider_lang_label.prepend(prov_flag);
                                };
                                prov_flag.onerror = function (){
                                    prov_flag.remove();
                                }
                                providers.style.display = "flex";
                            });
                        }
                    }
                })
            }
            moreinfo.style.display = "block";
        } else {
            moreinfo.style.display = "none";
        }
    });

    return card;
}
