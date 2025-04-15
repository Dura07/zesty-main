document.addEventListener("DOMContentLoaded", function () {
    const menuBtn = document.getElementById("menu-btn");
    const menu = document.querySelector("ul");

    menuBtn.addEventListener("click", function () {
        menu.classList.toggle("active");
    });

    // Enable dropdown toggle on mobile
    const dropdowns = document.querySelectorAll("ul li.has-dropdown > a");

    dropdowns.forEach(dropdown => {
        dropdown.addEventListener("click", function (e) {
            e.preventDefault(); // Prevent default link behavior
            this.nextElementSibling.classList.toggle("show-dropdown");
        });
    });
});


//toggleDropdown //


function toggleDropdown(id) {
    // Close any other open dropdowns
    document.querySelectorAll(".dropdown").forEach(menu => {
        if (menu.id !== id) {
            menu.classList.remove("show");
        }
    });

    // Toggle the selected dropdown
    document.getElementById(id).classList.toggle("show");
}

// Close dropdown if clicked outside
document.addEventListener("click", function(event) {
    let isDropdownBtn = event.target.matches(".dropdown-btn") || event.target.closest(".dropdown-btn");
    let isDropdownMenu = event.target.closest(".dropdown");

    if (!isDropdownBtn && !isDropdownMenu) {
        document.querySelectorAll(".dropdown").forEach(menu => {
            menu.classList.remove("show");
        });
    }
});


//slider//

// let slideIndex = 0;
// const slides = document.querySelectorAll('.fade-slide');

// function showSlides() {
//     slides.forEach(slide => slide.classList.remove('active'));
//     slideIndex = (slideIndex + 1) % slides.length;
//     slides[slideIndex].classList.add('active');
// }

// // Show the first slide immediately
// slides[slideIndex].classList.add('active');

// // Change image every 4 seconds
// setInterval(showSlides, 4000);


// script for scroll effect


window.addEventListener("scroll", function() {
    let header = document.querySelector(".header");
    if (window.scrollY > 50) { // Adjust threshold as needed
        header.classList.add("scrolled");
    } else {
        header.classList.remove("scrolled");
    }
});



// footer 

document.addEventListener("DOMContentLoaded", function () {
    document.getElementById("currentYear").textContent = new Date().getFullYear();
});



//back to top buttton

document.addEventListener("DOMContentLoaded", function () {
    const backToTop = document.getElementById("backToTop");

    window.addEventListener("scroll", function () {
        if (window.scrollY > 200) { // Show button after scrolling 200px
            backToTop.classList.add("show");
        } else {
            backToTop.classList.remove("show");
        }
    });

    backToTop.addEventListener("click", function () {
        window.scrollTo({ top: 0, behavior: "smooth" });
    });
});



// LOADER
// Simulate a loading delay

// window.addEventListener("load", function () {
//     const loader = document.getElementById("loader");
//     const content = document.getElementById("content");

//     if (loader) {
//         loader.style.display = "none";
//     }
    
//     if (content) {
//         content.style.display = "block";
//     }
// });

document.addEventListener("DOMContentLoaded", function () {
    const loader = document.getElementById("loader");
    const content = document.getElementById("content");

    if (loader) {
        loader.style.display = "none";
    }
    
    if (content) {
        content.style.display = "block";
    }
});




  

  

