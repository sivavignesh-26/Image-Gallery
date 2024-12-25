const imagesWrapper = document.querySelector(".images");
const loadMoreBtn = document.querySelector(".load-more");
const searchInput = document.querySelector(".search-box input");
const lightBox = document.querySelector(".lightbox");
const closeBtn = lightBox.querySelector(".uil-times");
const downLoadImgBtn = lightBox.querySelector(".uil-import");

const apiKey = "pEFdkjADINd419GzGmO6Jw9K4sHHoX55rMec1UWRMbIexnMqBZh4wJlj";
const perPage = 15;
let currentPage = 1;
let searchTerm = null;

const downLoadImg = (imgURL) => {
    // Converting received img to blob, creacting its downloading link, downloading it
    // console.log(imgURL)
    fetch(imgURL).then(res => res.blob()).then(file => {
        // console.log(file)
        const a = document.createElement('a');
        a.href = URL.createObjectURL(file)
        a.download = new Date().getTime();
        a.click()
    }).catch(() => alert('Failed dowmload image'))
}

const showLightbox = (name,img) => {
    lightBox.querySelector('img').src = img
    lightBox.querySelector('span').innerHTML = name
    downLoadImgBtn.setAttribute('data-img', img)
    lightBox.classList.add('show')
    document.body.style.overflow = 'hidden'
}

const hideLightbox = () => {
    lightBox.classList.remove('show')
    document.body.style.overflow = 'auto'

}

const generateHTML = (images) => {
    imagesWrapper.innerHTML += images.map(img => 
        `<li class="card" onclick="showLightbox('${img.photographer}', '${img.src.large2x}')">
                <img src="${img.src.large2x}" alt="img">
                <div class="details">
                    <div class="photographer">
                        <i class="uil uil-camera"></i>
                        <span>${img.photographer}</span>
                    </div>
                    <button onclick="downLoadImg('${img.src.large2x}');event.stopPropagation()">
                        <i class="uil uil-import"></i>
                    </button>
                </div>
            </li>
        `).join("")
}

const getImages = (apiURL) => {
    //Fetching images by API call with authorization header
    loadMoreBtn.innerHTML = 'Loading...';
    loadMoreBtn.classList.add("disabled");
    fetch(apiURL, {
        headers: {Authorization: apiKey}
    }).then(res => res.json()).then(data => {
        generateHTML(data.photos)
        loadMoreBtn.innerHTML = 'Load More';
        loadMoreBtn.classList.remove("disabled");
    }).catch(()=> alert('Failed to load images!'))
}

const loadMoreImages = () => {
    currentPage++; //Increament currentPage by 1
    let apiURL = `https://api.pexels.com/v1/curated?page=${currentPage}&per_page=${perPage}`
    apiURL = searchTerm ? `https://api.pexels.com/v1/search?query=${searchTerm}&page=${currentPage}&per_page=${perPage}` : apiURL;
    getImages(apiURL)
}

const loadSearchImages = (e) => {
    // If the search input is empty,set the search term to null and return from here
    if(e.target.value === '') return searchTerm = null
    if(e.key === 'Enter') {
        // console.log('Enter is press')
        currentPage = 1
        searchTerm = e.target.value
        imagesWrapper.innerHTML = ''
        getImages(`https://api.pexels.com/v1/search?query=${searchTerm}&page=${currentPage}&per_page=${perPage}`)
    }
}


getImages(`https://api.pexels.com/v1/curated?page=${currentPage}&per_page=${perPage}`);
loadMoreBtn.addEventListener('click', loadMoreImages);
searchInput.addEventListener('keyup', loadSearchImages);
closeBtn.addEventListener("click", hideLightbox);
downLoadImgBtn.addEventListener('click', (e) => downLoadImg(e.target.dataset.img))
