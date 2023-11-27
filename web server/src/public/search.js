document.getElementById('search-button').addEventListener('click', async function() {
    var searchQuery = document.getElementById('medicine-search').value;
    await searchMedicine(searchQuery);
});

async function searchMedicine(query) {
    try {
        document.getElementById('loading').hidden = false; 
        document.getElementById('spinner').hidden = false; 
        const response = await fetch('/search?q=' + encodeURIComponent(query));
        const data = await response.json();
        console.log(data);
        return data;
    } catch (error) {
        console.error('Error:', error);
        return [];
    } finally {
        document.getElementById('loading').hidden = true; 
        document.getElementById('spinner').hidden = true; 

    }
}

async function showSuggestions() {
    var searchQuery = document.getElementById('medicine-search').value;
    const suggestionsPanel = document.getElementById('searchResults');

    Array.from(suggestionsPanel.children).forEach(child => {
        if (child.id !== 'loading') {
            suggestionsPanel.removeChild(child);
        }
    });

    if (searchQuery.length < 2) {
        return;
    }

    const medicines = await searchMedicine(searchQuery); // Await the data

    medicines.forEach(medicine => {
        const div = document.createElement('div');
        div.innerHTML = medicine.name;
        div.onclick = function() {
           //process click event here
        };
        suggestionsPanel.appendChild(div);
    });
}

// debouce is a technique that cancels the previous api calls if the user is typing too fast
function debounce(func, delay) {
    let debounceTimer;
    return function() {
        const context = this;
        const args = arguments;
        clearTimeout(debounceTimer);
        debounceTimer = setTimeout(() => func.apply(context, args), delay);
    };
}

const debouncedShowSuggestions = debounce(showSuggestions, 500);
document.getElementById('medicine-search').addEventListener('input', debouncedShowSuggestions);

