/* =========================
   GRADUATE LAUNCH NIGERIA
   SCRIPT.JS
========================= */

/* Opportunities Database */



/* Containers */

const featuredContainer =
document.getElementById("featuredContainer");

const latestContainer =
document.getElementById("latestContainer");

/* Render Opportunities */

function createCard(item){

return `

<div class="opportunity-card">

<span class="deadline">
Deadline: ${item.deadline}
</span>

<h3>${item.title}</h3>

<p class="company">
${item.organization}
</p>

<p class="location">
📍 ${item.location}
</p>

<p>
${item.description}
</p>

<a
href="${item.link}"
class="btn-primary"
rel="noopener noreferrer"
target="_blank">

Apply Now

</a>

</div>

`;

}

/* Featured */

function renderFeatured(){

featuredContainer.innerHTML = "";

opportunities
.slice(0,6)
.forEach(item=>{

featuredContainer.innerHTML +=
createCard(item);

});

}

/* Latest */

function renderLatest(data){

latestContainer.innerHTML = "";

data.forEach(item=>{

latestContainer.innerHTML +=
createCard(item);

});

}

//renderFeatured();
//renderLatest(opportunities);

/* Search */

const searchInput =
document.getElementById("searchInput");

if(searchInput) {
  searchInput.addEventListener("keyup", ()=>{

  const keyword =
  searchInput.value.toLowerCase();

  const filtered =
  opportunities.filter(item =>

  item.title.toLowerCase().includes(keyword) ||

  item.organization.toLowerCase().includes(keyword) ||

  item.location.toLowerCase().includes(keyword) ||

  item.category.toLowerCase().includes(keyword)

  );

  renderLatest(filtered);

  });
}

/* Category Filter */

const categoryCards =
document.querySelectorAll(".category-card");

categoryCards.forEach(card=>{

card.addEventListener("click", ()=>{

const category =
card.dataset.category;

const filtered =
opportunities.filter(item =>

item.category === category

);

renderLatest(filtered);

});

// Support keyboard activation (Enter and Space)
card.addEventListener("keydown", (e) => {
  if(e.key === "Enter" || e.key === " "){
    e.preventDefault();
    const category = card.dataset.category;
    const filtered = opportunities.filter(item => item.category === category);
    renderLatest(filtered);
  }
});

});

/* Mobile Menu */

const hamburger = document.querySelector(".hamburger");
const navMenu = document.querySelector("#nav-menu");

if(hamburger && navMenu) {
  hamburger.addEventListener("click", () => {
    const isActive = navMenu.classList.toggle("active");
    hamburger.setAttribute("aria-expanded", isActive);
  });
  
  // Close menu when a link is clicked
  document.querySelectorAll("#nav-menu a").forEach(link => {
    link.addEventListener("click", () => {
      navMenu.classList.remove("active");
      hamburger.setAttribute("aria-expanded", false);
    });
  });
}

/* Newsletter Validation */

const newsletterForm =
document.getElementById("newsletterForm");

const newsletterMessage =
document.getElementById("newsletterMessage");

if(newsletterForm) {
  newsletterForm.addEventListener(
  "submit",
  function(e){
  
  e.preventDefault();
  
  const name =
  document.getElementById(
  "subscriberName"
  ).value.trim();
  
  const email =
  document.getElementById(
  "subscriberEmail"
  ).value.trim();
  
  // Basic email validation
  const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
  
  if(name === "" || email === ""){
  
  newsletterMessage.innerHTML =
  "Please complete all fields.";
  
  newsletterMessage.style.color =
  "yellow";
  
  return;
  
  }
  
  if(!emailRegex.test(email)){
    newsletterMessage.innerHTML =
    "Please enter a valid email address.";
    
    newsletterMessage.style.color =
    "yellow";
    
    return;
  }
  
  newsletterMessage.innerHTML =
  "Subscription successful! Check your email.";
  
  newsletterMessage.style.color =
  "#4ade80";
  
  newsletterForm.reset();
  
  }
  );
}

/* Contact Validation */

const contactForm =
document.getElementById("contactForm");

const contactStatus =
document.getElementById("contactStatus");

if(contactForm) {
  contactForm.addEventListener(
  "submit",
  function(e){
  
  e.preventDefault();
  
  const name =
  document.getElementById(
  "contactName"
  ).value.trim();
  
  const email =
  document.getElementById(
  "contactEmail"
  ).value.trim();
  
  const message =
  document.getElementById(
  "contactMessage"
  ).value.trim();
  
  // Basic email validation
  const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
  
  if(
  name === "" ||
  email === "" ||
  message === ""
  ){
  
  contactStatus.innerHTML =
  "Please complete all fields.";
  
  contactStatus.style.color =
  "red";
  
  return;
  
  }
  
  if(!emailRegex.test(email)){
    contactStatus.innerHTML =
    "Please enter a valid email address.";
    
    contactStatus.style.color =
    "red";
    
    return;
  }
  
  contactStatus.innerHTML =
  "Message sent successfully! We'll get back to you soon.";
  
  contactStatus.style.color =
  "green";
  
  contactForm.reset();
  
  }
  );
}

/* Back To Top */

const backToTop =
document.getElementById("backToTop");

if(backToTop) {
  window.addEventListener(
  "scroll",
  ()=>{
  
  if(window.scrollY > 400){
  
  backToTop.style.display =
  "block";
  
  }else{
  
  backToTop.style.display =
  "none";
  
  }
  
  }
  );
  
  backToTop.addEventListener(
  "click",
  ()=>{
  
  window.scrollTo({
  
  top:0,
  
  behavior:"smooth"
  
  });
  
  }
  );
}

/* Fade-In Animation */

const observer =
new IntersectionObserver(

(entries)=>{

entries.forEach(entry=>{

if(entry.isIntersecting){

entry.target.style.opacity = 1;

entry.target.style.transform =
"translateY(0px)";

}

});

}

);
function displayOpportunities(data){

const container =
document.getElementById("opportunitiesContainer");

container.innerHTML = "";

data.forEach(item => {

container.innerHTML += `
<div class="opportunity-card">

<span class="deadline">
${item.Deadline}
</span>

<h3>${item.Title}</h3>

<p><strong>${item.Organization}</strong></p>

<p>${item.Location}</p>

<p>${item.Description}</p>

<a href="${item.Link}"
target="_blank"
class="btn-primary">

Apply Now

</a>

</div>
`;

});

  }

document.querySelectorAll(
".category-card, .tip-card, .opportunity-card"
).forEach(el=>{

el.style.opacity = 0;

el.style.transform =
"translateY(40px)";

el.style.transition =
"all 0.8s ease";

observer.observe(el);

});

const SHEET_ID = "1ivBHTajPPYNvXn6mQpjL37j1kZHNliKZnmmULwcNkAg";

const SHEET_URL =
`https://opensheet.elk.sh/${SHEET_ID}/Sheet1`;

async function loadOpportunities() {

    const container =
    document.getElementById(
      "opportunitiesContainer"
    );

    try {

        const response =
        await fetch(SHEET_URL);

        const data =
        await response.json();

        container.innerHTML = "";

        data.forEach(item => {

            container.innerHTML += `

            <div class="opportunity-card">

                <span class="deadline">
                ${item.deadline}
                </span>

                <h3>
                ${item.title}
                </h3>

                <p class="company">
                ${item.organization}
                </p>

                <p class="location">
                📍 ${item.location}
                </p>

                <p>
                ${item.description}
                </p>

                <br>

                <a href="${item.link}"
                   target="_blank"
                   class="btn-primary">

                   Apply Now

                </a>

            </div>

            `;

        });

    }

    catch(error){

        container.innerHTML = `
        <p>
        Unable to load opportunities.
        </p>
        `;

        console.error(error);

    }

}

loadOpportunities();
