// Get HTML element by ID
const getElement = id => document.getElementById(id);

// Toggle HTML element
const toggleElement = (element, show) => {
    if(show) {
        element.style.display = 'block';
    }
    else {
        element.style.display = 'none';
    }
}

// Fetch Search Result
const loadSearchResult = () => {
    const searchInput = getElement('search-input');
    const searchValue = searchInput.value;
    searchInput.value = ``;
    const url = `https://openapi.programming-hero.com/api/phones?search=${searchValue}`;
    fetch(url)
        .then(res => res.json())
        .then(data => displaySearchResult(data));
}

// Display Search Result
const displaySearchResult = data => {
    const result = getElement('result');
    const phoneDetail = getElement('phone-detail');
    const message = getElement('message');
    result.textContent = ``;
    phoneDetail.textContent = ``;

    if(data.status) {
        const phoneList = data.data;
        toggleElement(message,false);
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
                <ul class="list-group list-group-flush text-start">
                    <li class="list-group-item"><span class="text-phone-arena me-3">Storage:</span> ${phone.mainFeatures.storage}</li>
                    <li class="list-group-item"><span class="text-phone-arena me-3">Display:</span> ${phone.mainFeatures.displaySize}</li>
                    <li class="list-group-item"><span class="text-phone-arena me-3">Chipset:</span> ${phone.mainFeatures.chipSet ? phone.mainFeatures.chipSet : "Chipset Info Not Found" }</li>
                    <li class="list-group-item"><span class="text-phone-arena me-3">Memory:</span> ${phone.mainFeatures.memory}</li>
                </ul>
            </div>
        `;
        phoneDetail.appendChild(div);
    }
}
