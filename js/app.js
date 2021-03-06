// Get HTML element by ID
const getElement = id => document.getElementById(id);

let storeValue =''; // For Store Search Value

// Toggle HTML element
const toggleElement = (element, show) => {
    if(show) {
        element.style.display = 'block';
    }
    else {
        element.style.display = 'none';
    }
}


// Search Phone By User Input
const searchPhone = () => {
    const searchInput = getElement('search-input');
    const spinner = getElement('spinner');
    const result = getElement('result');
    const searchValue = searchInput.value;
    searchInput.value = ``;

    // Display Spinner
    toggleElement(spinner, true);
    result.classList.add('visually-hidden');
    loadSearchResult(searchValue);
    storeSearchVal(searchValue);
}

// Set Search Value to storeValue variable
const storeSearchVal = searchValue => storeValue = searchValue ;

// Show All data function
const showAllResult = () => {
    loadSearchResult(storeValue, true);
}

// Fetch Search Result
const loadSearchResult = (searchValue, showAll = false) => {
    const url = `https://openapi.programming-hero.com/api/phones?search=${searchValue}`;
    fetch(url)
        .then(res => res.json())
        .then(data => displaySearchResult(data, showAll));
}

// Display Search Result
const displaySearchResult = (data, showAll) => {
    const result = getElement('result');
    const phoneDetail = getElement('phone-detail');
    const message = getElement('message');
    // Hide Spinner Show Result
    toggleElement(getElement('spinner'), false);
    result.classList.remove('visually-hidden');

    result.textContent = ``;
    phoneDetail.textContent = ``;

    if(data.status) {
        toggleElement(message,false);
        let phoneList = [];
        !showAll ? phoneList = data.data.slice(0,20) : phoneList = data.data;

        phoneList.forEach(phone => {
            const div = document.createElement('div');
            div.classList.add('col');
            div.innerHTML = `
                <div class="card shadow p-2 mx-auto" style="width: 18rem;">
                    <img src="${phone.image}" class="card-img-top" alt="Phone Picture">
                    <div class="card-body text-center">
                        <h6>${phone.brand}</h6>
                        <h4 class="card-title">${phone.phone_name}</h4>
                        <a href="#phone-detail" onclick="loadPhoneDetail('${phone.slug}')" class="btn bg-phone-arena">Details</a>
                    </div>
                </div>
            `;
            result.appendChild(div);
        });

        // If Search result in more then 20
        if(data.data.length > 20 && !showAll) {
            const viewAllBtn = document.createElement('button');
            viewAllBtn.classList.add('view-all-btn', 'mx-auto','my-5');
            viewAllBtn.innerText = "Show All";
            viewAllBtn.onclick = showAllResult;
            result.appendChild(viewAllBtn);
        }
    }
    else {
        toggleElement(message,true);
    }
}

// Fetch Phone Details By Slug
const loadPhoneDetail = slug => {
    const url = `https://openapi.programming-hero.com/api/phone/${slug}`;

    fetch(url)
        .then(res => res.json())
        .then(data => displayPhoneDetail(data));
}

// Display Phone Details
const displayPhoneDetail = data => {
    const phoneDetail = getElement('phone-detail');
    phoneDetail.textContent = ``;
    if(data.status) {
        const phone = data.data;
        const div = document.createElement('div');
        div.classList.add("card", "shadow", "p-4", "text-center", "text-md-start", "mx-auto");
        let sensors = '';
        // If phone object have sensors property
        if(phone.mainFeatures.sensors) {
            const li = document.createElement('li')
            li.innerText = `<span class="text-phone-arena me-3">Sensors:</span>`
            phone.mainFeatures.sensors.forEach( element => {
                const span = document.createElement('span');
                span.innerText = `${element}, `;
                li.appendChild(span);
            }
            );
            sensors = li;
        }

        div.innerHTML = `
            <div class="d-md-flex flex-row justify-content-evenly align-items-center">
            <div class="mb-3">
                <img src="${phone.image}" alt="Phone picture">
            </div>
            <div>
                <h6>${phone.brand}</h6>
                <h3 class="card-title">${phone.name}</h3>
                <small class="text-muted">${phone.releaseDate ? phone.releaseDate : "Release Date Not Found"}</small>
            </div>
            </div>
            <hr class="bg-phone-arena my-3">
            <div class="p-2">
                <h5 class="text-center text-phone-arena">Main Features</h5>
                <ul class="list-group list-group-flush text-start mb-3">
                    <li class="list-group-item"><span class="text-phone-arena me-3">Storage:</span> ${phone.mainFeatures.storage}</li>
                    <li class="list-group-item"><span class="text-phone-arena me-3">Display:</span> ${phone.mainFeatures.displaySize}</li>
                    <li class="list-group-item"><span class="text-phone-arena me-3">Chipset:</span> ${phone.mainFeatures.chipSet ? phone.mainFeatures.chipSet : "Chipset Info Not Found" }</li>
                    <li class="list-group-item"><span class="text-phone-arena me-3">Memory:</span> ${phone.mainFeatures.memory ? phone.mainFeatures.memory : "Memory Info Not Found"}</li>
                    <li class="list-group-item ${!sensors ? "d-none": ''}">${sensors ? sensors.textContent : ''}</li>
                </ul>
            </div>
        `;

        // if phone object have others property
        if(phone.others) {
           const others = phone.others;
           const divForOther = document.createElement('div');
           const ul = document.createElement('ul');
           ul.classList.add("list-group", "list-group-flush", "text-start");
           divForOther.innerHTML = `<h5 class="text-center text-phone-arena">Other Features</h5>`;
           for(const key in others) {
                const otherLi = document.createElement('li');
                otherLi.classList.add('list-group-item');
                otherLi.innerHTML = `<span class="text-phone-arena me-3">${key}:</span> ${others[key]}`;
                ul.appendChild(otherLi);            
           }
           divForOther.appendChild(ul);
           div.appendChild(divForOther);
        }
        phoneDetail.appendChild(div);
    }

}
