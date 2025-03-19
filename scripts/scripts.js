document.addEventListener("DOMContentLoaded", () => {
    const memberContainer = document.getElementById("member-container");
    const gridViewButton = document.getElementById("grid-view");
    const listViewButton = document.getElementById("list-view");

    // Set default view (grid view)
    if (memberContainer) {
        memberContainer.classList.add("grid");

        // Fetch and display member data
        fetch("data/members.json")
            .then(response => response.json())
            .then(data => {
                data.forEach(member => {
                    const memberCard = document.createElement("section");

                    // Use member-specific image if available, otherwise use a default image
                    const memberImage = `images/${member.name.toLowerCase().replace(/ /g, "-")}.jpg`;
                    const imageExists = new Image();
                    imageExists.src = memberImage;

                    imageExists.onload = () => {
                        memberCard.innerHTML = `
                            <img src="${memberImage}" alt="${member.name}">
                            <h3>${member.name}</h3>
                            <p>${member.address}</p>
                            <p>${member.phone}</p>
                            <a href="${member.website}" target="_blank">Visit Website</a>
                        `;
                    };

                    imageExists.onerror = () => {
                        memberCard.innerHTML = `
                            <img src="images/default.jpg" alt="${member.name}">
                            <h3>${member.name}</h3>
                            <p>${member.address}</p>
                            <p>${member.phone}</p>
                            <a href="${member.website}" target="_blank">Visit Website</a>
                        `;
                    };

                    memberContainer.appendChild(memberCard);
                });
            })
            .catch(error => console.error("Error fetching member data:", error));
    }

    // Function to toggle views
    function toggleView(view) {
        if (memberContainer) {
            memberContainer.className = ""; // Clear all classes
            memberContainer.classList.add(view); // Add the selected view class
        }
    }

    // Event listeners for buttons
    if (gridViewButton && listViewButton) {
        gridViewButton.addEventListener("click", () => toggleView("grid"));
        listViewButton.addEventListener("click", () => toggleView("list"));
    }
});

document.addEventListener("DOMContentLoaded", () => {
    const burgerMenu = document.querySelector(".burger-menu");
    const navLinks = document.querySelector(".nav-links");

    if (burgerMenu && navLinks) {
        burgerMenu.addEventListener("click", () => {
            navLinks.classList.toggle("active");
        });
    }

    // Set current year in the footer
    const yearElement = document.getElementById("year");
    if (yearElement) {
        const currentYear = new Date().getFullYear();
        yearElement.textContent = currentYear;
    }

    // Set last modified date in the footer
    const lastModifiedElement = document.getElementById("last-modified-date");
    if (lastModifiedElement) {
        const lastModifiedDate = new Date(document.lastModified);
        lastModifiedElement.textContent = lastModifiedDate.toLocaleDateString();
    }
});

document.addEventListener("DOMContentLoaded", () => {
    // OpenWeatherMap API integration
    const weatherContainer = document.getElementById("weather-container");
    const apiKey = "53a642139468684fdf2f6d688a6f191e"; // Replace with your API key
    const city = "Freetown, SL"; // Replace with the chamber's location
    const units = "metric"; // Use "imperial" for Fahrenheit

    if (weatherContainer) {
        fetch(`https://api.openweathermap.org/data/2.5/weather?q=${city}&units=${units}&appid=${apiKey}`)
            .then(response => response.json())
            .then(data => {
                const currentTemp = data.main.temp;
                const weatherDescription = data.weather[0].description;

                weatherContainer.innerHTML = `
                    <p>Current Temperature: ${currentTemp}°C</p>
                    <p>Weather: ${weatherDescription}</p>
                `;

                // Fetch 3-day forecast
                return fetch(`https://api.openweathermap.org/data/2.5/forecast?q=${city}&units=${units}&appid=${apiKey}`);
            })
            .then(response => response.json())
            .then(data => {
                const forecast = data.list.filter((_, index) => index % 8 === 0).slice(0, 3); // Get 3 days (every 8th item)
                const forecastHTML = forecast.map(day => {
                    const date = new Date(day.dt * 1000).toLocaleDateString();
                    const temp = day.main.temp;
                    return `<p>${date}: ${temp}°C</p>`;
                }).join("");

                weatherContainer.innerHTML += `
                    <h4>3-Day Forecast:</h4>
                    ${forecastHTML}
                `;
            })
            .catch(error => {
                console.error("Error fetching weather data:", error);
                weatherContainer.innerHTML = `<p>Unable to load weather data.</p>`;
            });
    }
});

// Chamber member spotlight
const spotlightContainer = document.getElementById("spotlight-container");

if (spotlightContainer) {
    fetch("data/members.json") // Replace with the correct path to your JSON file
        .then(response => response.json())
        .then(data => {
            // Filter gold and silver members
            const goldAndSilverMembers = data.filter(member =>
                member.membershipLevel === "Gold" || member.membershipLevel === "Silver"
            );

            // Randomly shuffle members
            const shuffledMembers = goldAndSilverMembers.sort(() => 0.5 - Math.random());

            let currentIndex = 0;

            // Function to update the spotlight
            function updateSpotlight() {
                // Get the next three members
                const spotlightMembers = [
                    shuffledMembers[currentIndex],
                    shuffledMembers[(currentIndex + 1) % shuffledMembers.length],
                    shuffledMembers[(currentIndex + 2) % shuffledMembers.length]
                ];

                // Generate HTML for the three spotlight sections
                const spotlightHTML = spotlightMembers.map(member => `
                    <div class="spotlight-card">
                        <img src="${member.logo}" alt="${member.name} Logo">
                        <h4>${member.name}</h4>
                        <p>Phone: ${member.phone}</p>
                        <p>Address: ${member.address}</p>
                        <p>Website: <a href="${member.website}" target="_blank">${member.website}</a></p>
                        <p>Membership Level: ${member.membershipLevel}</p>
                    </div>
                `).join("");

                // Update the spotlight container
                spotlightContainer.innerHTML = spotlightHTML;

                // Move to the next set of members
                currentIndex = (currentIndex + 3) % shuffledMembers.length;
            }

            // Start the spotlight rotation
            setInterval(updateSpotlight, 3000); // Rotate every 3 seconds

            // Initialize the first spotlight
            updateSpotlight();
        })
        .catch(error => {
            console.error("Error fetching member data:", error);
            spotlightContainer.innerHTML = `<p>Unable to load spotlight data.</p>`;
        });
}