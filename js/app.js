// Get HTML element by ID
const getElement = id => document.getElementById(id);

// Fetch Search Result
const loadSearchResult = () => {
    const searchValue = getElement('search-input').value;
    const url = `https://openapi.programming-hero.com/api/phones?search=${searchValue}`;

    fetch(url)
        .then(res => res.json())
        .then(data => displaySearchResult(data));
}

// Display Search Result
const displaySearchResult = data => {
    const result = getElement('result');
    result.textContent = ``;
    
    if(data.status) {
        const phoneList = data.data;
        phoneList.forEach(phone => {
            const div = document.createElement('div');
            div.classList.add('col');
            div.innerHTML = `
                <div class="card shadow p-2 mx-auto" style="width: 18rem;">
                    <img src="${phone.image}" class="card-img-top" alt="Phone Picture">
                    <div class="card-body text-center">
                        <h6>${phone.brand}</h6>
                        <h4 class="card-title">${phone.phone_name}</h4>
                        <a href="#" class="btn bg-phone-arena">Details</a>
                    </div>
                </div>
            `;
            result.appendChild(div);
        });
    }
    else {
        console.log("Result not found");
    }
}
