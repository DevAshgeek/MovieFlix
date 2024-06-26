// constants
const apikey = "2b82006d3944a0680c417ddcedda30b8";
const apiEndpoint = "https://api.themoviedb.org/3";
const imgPath = "https://image.tmdb.org/t/p/original";
const imgPathReduced = "https://image.tmdb.org/t/p/w1280";
const youtubeApiEndpoint = "https://www.googleapis.com/youtube/v3/search";
const youtubeApikey = "AIzaSyDXAc75ggH4wRDWuwBgsnxPkFUl-X2OeUU";

// Api Paths
const apiPaths = {
    fetchAllCategories: `${apiEndpoint}/genre/movie/list?api_key=${apikey}`,
    fetchMoviesList: (id) => `${apiEndpoint}/discover/movie?api_key=${apikey}&with_genres=${id}`,
    fetchTrending: `${apiEndpoint}/trending/all/day?api_key=${apikey}&language=en-US`,
    searchOnYoutube: (query) => `${youtubeApiEndpoint}?part=snippet&q=${query}&key=${youtubeApikey}`,
}
// https://api.themoviedb.org/3/movie/550?api_key=2b82006d3944a0680c417ddcedda30b8
//https://www.googleapis.com/youtube/v3/search?part=snippet&q=spiderman&key=AIzaSyDXAc75ggH4wRDWuwBgsnxPkFUl-X2OeUU



//Boots up the app
init = () => {
    fetchTrendingMovies();
    fetchAndBuildAllSections();
}


function fetchTrendingMovies() {
    fetchAndBuildMovieSection(apiPaths.fetchTrending, 'Trending Now')
        .then(list => {
            const randomIndex = parseInt(Math.random() * list.length)
            buildBannerSection(list[randomIndex]);
        })
        .catch(err => {
            console.log(err);
        });
}

function buildBannerSection(movie) {
    const bannerCont = document.getElementById('banner-section');
    console.log(`${imgPath}${movie.backdrop_path} ${movie.title} ${movie}`);
    if (movie.backdrop_path === null || movie.backdrop_path === undefined) {
        bannerCont.style.backgroundImage = `url(https://res.cloudinary.com/dxdboxbyb/image/upload/v1620052094/ayi6tvyiedrlmjiim6yn.png)`
    }

    if (window.outerWidth <= 767) {
        bannerCont.style.backgroundImage = `url('${imgPathReduced}${movie.backdrop_path}')`;
    } else {
        bannerCont.style.backgroundImage = `url('${imgPath}${movie.backdrop_path}')`;
    }
    const div = document.createElement('div');
    let movieTitle = "";
    if (movie.name) {
        movieTitle = `${movie.name}`;
    }
    else if (movie.title) {
        movieTitle = `${movie.title}`;
    }

    div.innerHTML = `
    <h2 class="banner-title">${movieTitle && movieTitle.length > 40 ? movieTitle.slice(0, 30).trim() + '..' : movieTitle}</h2>
    <p class="banner-info">ratings: ${movie.vote_average}</p>
    <p class="banner-overview">
        ${movie.overview && movie.overview.length > 150 ? movie.overview.slice(0, 150).trim() + '...' : movie.overview}</p>
    <div class="action-buttons-cont">
        <button class="action-button" onclick="searchBannerMovieTrailer('${movieTitle}','${movie.id}')">
            <img
                class="action-button-icon"
                src="./assests/iconplay.png"
                alt="play icon"
                width="14px"
            />Play
        </button>
        <button class="action-button">
            <a class="action-a" href="https://en.wikipedia.org/wiki/${movieTitle}" target="_blank"><img
                class="action-button-icon"
                src="./assests/iconinfo.png"
                alt="play icon"
                width="14px"
            />More Info
            </a>
        </button>
           </div>
    `;

    //  <button class="fullscreen-button" onclick="toggleBannerFullscreen()">Fullscreen</button>

    div.className = "banner-content container";
    bannerCont.append(div);

}



function fetchAndBuildAllSections() {
    fetch(apiPaths.fetchAllCategories)
        .then(res => res.json())
        .then(res => {
            const categories = res.genres;
            if (Array.isArray(categories) && categories.length) {
                // for (let i = 0; i < 2; i++) {
                //     fetchAndBuildMovieSection(apiPaths.fetchMoviesList(categories[i].id), categories[i].name);
                // }
                categories.forEach(category => {
                    fetchAndBuildMovieSection(apiPaths.fetchMoviesList(category.id), category.name);
                });
            }
            // console.table(categories);
        })
        .catch(err => console.log(err));
}



function fetchAndBuildMovieSection(fetchUrl, categoryName) {
    return fetch(fetchUrl)
        .then(res => res.json())
        .then(res => {
            const movies = res.results;
            if (Array.isArray(movies) && movies.length) {
                buildMoviesSection(movies, categoryName);
            }
            return movies;
        })
        .catch(err => console.log(err));
}



function buildMoviesSection(list, categoryName) {
    const movieCont = document.getElementById("movies-container");

    const updatedCategoryName = categoryName.split(' ').join('').toLowerCase();

    const moviesSectionHtml = `
   <h2 class="movies-section-heading">
        ${categoryName}
        <span class="explore-nudge">Explore All</span>
    </h2>

    <div class="movies-row-container">
      <div class="movies-row">
        ${list.map(item => buildMovieItem(item, categoryName)).join('')}
      </div>
      <div class="category-container" id="category-container-${updatedCategoryName}"></div>
    </div>
    `;


    const div = document.createElement('div');
    div.className = "movies-section";
    let catname = categoryName.split(" ").join("");
    div.setAttribute("id", `movies-section-${catname}`)
    console.log(`${categoryName}`)
    div.innerHTML = moviesSectionHtml;
    movieCont.append(div);
}

function buildMovieItem(item, categoryName) {
    const movieTitle = item.name || item.title;
    const movieId = item.id;
    // console.log(movieId);
    const movieItemHtml = `
        <div class="movie-item">
            <img class="movie-item-img" src="${imgPath}${item.backdrop_path}" alt="${item.title}">
            <div class="movie-btn-cont action-buttons-cont">
             <button class="action-button" onclick="searchMovieTrailer('${movieTitle}', '${movieId}', '${categoryName}')">
               <img
                 class="action-button-icon"
                 src="./assests/iconplay.png"
                 alt="play icon"
                 width="14px"
                />Play
             </button>
             <button class="action-button">
               <a class="movie-btn-a" href="https://en.wikipedia.org/wiki/${movieTitle}" target="_blank"><img
                 class="action-button-icon"
                 src="./assests/iconinfo.png"
                 alt="play icon"
                 width="14px"
                />More Info
                </a>
             </button>
            </div>
            </img> 
        </div>
    `;
    // 
    return movieItemHtml;
}

function searchMovieTrailer(movieName, movieId, categoryName) {
    if (!movieName || !categoryName || !movieId) return;

    const updatedCategoryName = categoryName.split(' ').join('').toLowerCase();
    const categoryContainerId = `category-container-${updatedCategoryName}`;
    const categoryContainer = document.getElementById(categoryContainerId);
    categoryContainer.innerHTML = "";

    const bannerMovieCont = document.querySelectorAll('.bannermovie-container');
    bannerMovieCont.forEach(container => {
        container.style.display = "none";
        container.innerHTML = "";
    });

    const movierow = document.getElementsByClassName("movie-row");

    const div = document.createElement('div');
    div.classList.add("trailer-container");
    div.id = `${updatedCategoryName}-${movieId}`;
    // let trailerContainer = `<div class="trailer-container" id="${categoryName}-${item.id}"></div>`
    categoryContainer.appendChild(div);

    const trailerContainerId = `${updatedCategoryName}-${movieId}`;
    const trailerContainer = document.getElementById(trailerContainerId);

    if (!trailerContainer) {
        console.error(`Trailer container not found for movie: ${movieName}`);
        return;
    }

    // Hide all other trailer containers
    const allTrailerContainers = document.querySelectorAll('.trailer-container');
    allTrailerContainers.forEach(container => {
        container.style.display = "none";
        container.innerHTML = "";
    });

    // Clear the current trailer container
    trailerContainer.innerHTML = "";
    fetch(apiPaths.searchOnYoutube(movieName))
        .then(res => res.json())
        .then(res => {
            const bestResult = res.items[0];
            const youtubeURL = `https://www.youtube.com/watch?v=${bestResult.id.videoId}`;
            console.log(youtubeURL);

            const iframeContainer = document.createElement('div');
            iframeContainer.setAttribute('class', 'youtube-video');
            iframeContainer.innerHTML = `<div id= "movie${updatedCategoryName}-${movieId}" class="video-div"><iframe width="100%" height="100%" src="https://www.youtube.com/embed/${bestResult.id.videoId}?autoplay=1&controls=0"></iframe></div>`

            const trailerdiv = document.createElement('div');
            const fullscreenbtn = document.createElement('button');

            fullscreenbtn.classList.add("fullscreen-button")
            fullscreenbtn.innerHTML = "Fullscreen"
            fullscreenbtn.onclick = function () {
                toggleFullScreen(`${updatedCategoryName}-${movieId}`);
            };

            iframeContainer.appendChild(fullscreenbtn);
            trailerdiv.appendChild(iframeContainer);
            trailerContainer.appendChild(trailerdiv);
            trailerContainer.style.display = 'block';
            categoryContainer.style.display = "block";

        })
        .catch(err => console.log(err));
}

function searchBannerMovieTrailer(movieName, movieId) {
    if (!movieName || !movieId) return;

    const movieContainer = document.createElement('div');
    movieContainer.classList.add("bannermovie-container");

    const headercont = this.document.getElementById('header-cont');

    const allTrailerContainers = document.querySelectorAll('.category-container');
    allTrailerContainers.forEach(container => {
        container.style.display = "none";
        container.innerHTML = "";
    });

    movieContainer.innerHTML = "";

    fetch(apiPaths.searchOnYoutube(movieName))
        .then(res => res.json())
        .then(res => {
            const bestResult = res.items[0];
            const youtubeURL = `https://www.youtube.com/watch?v=${bestResult.id.videoId}`;
            console.log(youtubeURL);

            const iframeContainer = document.createElement('div');
            iframeContainer.setAttribute('class', 'banner-video');
            iframeContainer.innerHTML = `<iframe width="100%" height="100%" src="https://www.youtube.com/embed/${bestResult.id.videoId}?autoplay=1&controls=0"></iframe>`
            movieContainer.appendChild(iframeContainer);
            movieContainer.style.display = 'block';

            const bannerCont = document.getElementById('banner-section');
            bannerCont.append(movieContainer);


            const fullscreenBtn = document.createElement('button');
            fullscreenBtn.classList.add("fullscreen-button")
            fullscreenBtn.innerHTML = "Fullscreen"
            fullscreenBtn.onclick = toggleBannerFullScreen;

            bannerCont.appendChild(fullscreenBtn);


        })
        .catch(err => console.log(err));
}

let navstatus = false;
function displaynav() {
    const leftcont = document.getElementById("left-cont");
    const mainnav = document.getElementById("main-nav");
    if (window.outerWidth < 773) {
        if (!navstatus) {
            leftcont.classList.add("menubar")
            mainnav.style.display = "flex"
            navstatus = true;
        }
        else {
            leftcont.classList.remove("menubar")
            mainnav.style.display = "none"
            navstatus = false;
        }
    }

}

function hideNavOnResize() {
    const leftcont = document.getElementById("left-cont");
    const mainnav = document.getElementById("main-nav");
    if (window.outerWidth >= 773) {
        leftcont.classList.remove("menubar")
        mainnav.style.display = "inline-flex"
        navstatus = false;
    }
    else
        if (window.outerWidth < 773) {
            if (!navstatus) {
                leftcont.classList.remove("menubar")
                mainnav.style.display = "none"
                navstatus = false;
            }
        }
}



//toggle banner fullscreen

function toggleBannerFullScreen() {
    const bannerElement = document.getElementById('banner-section');
    const bannerVideoElement = bannerElement.querySelector('.banner-video');
    const fullscreenBtn = bannerElement.querySelector('.fullscreen-button');

    if (!document.fullscreenElement && !document.mozFullScreenElement && !document.webkitFullscreenElement && !document.msFullscreenElement) {
        // Enter fullscreen mode
        if (bannerElement.requestFullscreen) {
            bannerElement.requestFullscreen();
        } else if (bannerElement.mozRequestFullScreen) {
            bannerElement.mozRequestFullScreen();
        } else if (bannerElement.webkitRequestFullscreen) {
            bannerElement.webkitRequestFullscreen();
        } else if (bannerElement.msRequestFullscreen) {
            bannerElement.msRequestFullscreen();
        }

        // Hide fullscreen button
        fullscreenBtn.style.display = "none";
    } else {
        // Exit fullscreen mode
        if (document.exitFullscreen) {
            document.exitFullscreen();
        } else if (document.mozCancelFullScreen) {
            document.mozCancelFullScreen();
        } else if (document.webkitExitFullscreen) {
            document.webkitExitFullscreen();
        } else if (document.msExitFullscreen) {
            document.msExitFullscreen();
        }

        // Show fullscreen button
        fullscreenBtn.style.display = "block";
    }

    const updateBannerVideoSize = () => {
        const isFullscreen =
            document.fullscreenElement ||
            document.webkitFullscreenElement ||
            document.mozFullScreenElement ||
            document.msFullscreenElement;

        if (!isFullscreen) {
            // Update video size when exiting fullscreen
            bannerVideoElement.style.height = "56.25vw";
        } else {
            // Update video size when entering fullscreen
            bannerVideoElement.style.height = "56.25vw";
            bannerVideoElement.style.width = "100%";
            bannerElement.style.backgroundSize = "contain";
        }
    };

    // Listen for fullscreen change event to update video size
    document.addEventListener("fullscreenchange", updateBannerVideoSize);
    document.addEventListener("webkitfullscreenchange", updateBannerVideoSize);
    document.addEventListener("mozfullscreenchange", updateBannerVideoSize);
    document.addEventListener("MSFullscreenChange", updateBannerVideoSize);
}



function toggleFullScreen(elementId) {
    const element = document.getElementById(elementId);
    const movieElement = document.getElementById(`movie${elementId}`);
    const movieiframe = movieElement.firstChild;
    const fullscreenbtn = document.querySelector(`#${elementId} .fullscreen-button`);

    if (!document.fullscreenElement && !document.mozFullScreenElement && !document.webkitFullscreenElement && !document.msFullscreenElement) {
        // Enter fullscreen mode

        // movieElement.style.height = "100vh";

        if (element.requestFullscreen) {
            element.requestFullscreen();
        } else if (element.mozRequestFullScreen) {
            element.mozRequestFullScreen();
        } else if (element.webkitRequestFullscreen) {
            element.webkitRequestFullscreen();
        } else if (element.msRequestFullscreen) {
            element.msRequestFullscreen();
        }

        // Hide fullscreen button
        fullscreenbtn.style.display = "none";
    } else {
        // Exit fullscreen mode
        if (document.exitFullscreen) {
            document.exitFullscreen();
        } else if (document.mozCancelFullScreen) {
            document.mozCancelFullScreen();
        } else if (document.webkitExitFullscreen) {
            document.webkitExitFullscreen();
        } else if (document.msExitFullscreen) {
            document.msExitFullscreen();
        }

        // movieElement.style.height = "56.25vh";
        fullscreenbtn.style.display = "block";

    }

    const updateVideoSize = () => {
        const isFullscreen =
            document.fullscreenElement ||
            document.webkitFullscreenElement ||
            document.mozFullScreenElement ||
            document.msFullscreenElement;

        if (!isFullscreen) {
            movieElement.style.height = "56.25vw";
            movieElement.style.width = "100%";
            movieiframe.style.height = "56.25vw";
            movieiframe.style.width = "100%";

        }
        else if (isFullscreen) {
            movieiframe.style.height = "100vh";
            movieiframe.style.width = "100vw";
        }
    };

    // Listen for fullscreen change event to update video size
    document.addEventListener("fullscreenchange", updateVideoSize);
    document.addEventListener("webkitfullscreenchange", updateVideoSize);
    document.addEventListener("mozfullscreenchange", updateVideoSize);
    document.addEventListener("MSFullscreenChange", updateVideoSize);
}

// Add event listener for fullscreen change
document.addEventListener("fullscreenchange", function () {
    const fullscreenElement = document.fullscreenElement ||
        document.webkitFullscreenElement ||
        document.mozFullScreenElement ||
        document.msFullscreenElement;

    // If not in fullscreen mode, show the fullscreen button
    if (!fullscreenElement) {
        const fullscreenbtns = document.querySelectorAll(".fullscreen-button");
        fullscreenbtns.forEach(btn => {
            btn.style.display = "block";
        });
    }
});


window.addEventListener("load", () => {
    init();
    window.addEventListener('scroll', function () {
        const header = this.document.getElementById('header-cont');
        if (this.window.scrollY > 30) {
            header.classList.add('black-bg');
        }
        else header.classList.remove('black-bg');
    })
})

window.addEventListener("resize", () => {
    hideNavOnResize();
});

document.addEventListener("DOMContentLoaded", function () {
    const links = document.querySelectorAll('a[href^="#"]');
    const leftcont = document.getElementById("left-cont");
    const mainnav = document.getElementById("main-nav");
    for (const link of links) {
        link.addEventListener("click", smoothScroll);
    }

    function smoothScroll(e) {
        e.preventDefault();
        const targetId = this.getAttribute("href");
        const targetElement = document.querySelector(targetId);
        if (targetElement) {
            const offsetTop = targetElement.offsetTop;
            window.scrollTo({
                top: offsetTop,
                behavior: "smooth",
            });
        }
        if (window.outerWidth < 773) {
            leftcont.classList.remove("menubar")
            mainnav.style.display = "none"
            navstatus = false;
        }


    }
});

