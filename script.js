/* =========================
   GRADUATE LAUNCH NIGERIA
   SCRIPT.JS
========================= */

/* Opportunities Database */

const opportunities = [

{
title: "Graduate Trainee Program 2026",
category: "Graduate Trainee",
organization: "XYZ Bank",
location: "Lagos, Nigeria",
deadline: "July 30, 2026",
description: "XYZ Bank is recruiting graduates into its trainee program.",
link: "https://www.example.com/apply"
},

{
title: "Engineering Internship",
category: "Internship",
organization: "ABC Energy",
location: "Abuja, Nigeria",
deadline: "August 15, 2026",
description: "Engineering internship for recent graduates.",
link: "#"
},

{
title: "Mastercard Foundation Scholarship",
category: "Scholarship",
organization: "Mastercard Foundation",
location: "Africa",
deadline: "September 1, 2026",
description: "Scholarship opportunity for African students.",
link: "#"
},

{
title: "Young Leaders Fellowship",
category: "Fellowship",
organization: "Global Leaders Network",
location: "Remote",
deadline: "October 10, 2026",
description: "Leadership development fellowship.",
link: "#"
},

{
title: "Graduate Analyst",
category: "Entry-Level",
organization: "TechNova",
location: "Lagos",
deadline: "August 12, 2026",
description: "Entry-level analyst role.",
link: "#"
},

{
title: "Remote Content Associate",
category: "Remote",
organization: "Digital Africa",
location: "Remote",
deadline: "July 20, 2026",
description: "Work remotely from anywhere.",
link: "#"
},

{
title: "Finance Graduate Program",
category: "Graduate Trainee",
organization: "Access Finance",
location: "Abuja",
deadline: "August 25, 2026",
description: "Graduate development program.",
link: "#"
},

{
title: "Marketing Internship",
category: "Internship",
organization: "BrandHub",
location: "Lagos",
deadline: "July 29, 2026",
description: "Marketing internship opportunity.",
link: "#"
},

{
title: "Research Scholarship",
category: "Scholarship",
organization: "Global Research Fund",
location: "International",
deadline: "November 1, 2026",
description: "Research funding opportunity.",
link: "#"
},

{
title: "Innovation Fellowship",
category: "Fellowship",
organization: "Innovation Lab",
location: "Remote",
deadline: "September 18, 2026",
description: "Innovation and entrepreneurship fellowship.",
link: "#"
},

{
title: "Customer Success Associate",
category: "Entry-Level",
organization: "GrowthTech",
location: "Ibadan",
deadline: "August 5, 2026",
description: "Entry-level customer success role.",
link: "#"
},

{
title: "Remote Project Assistant",
category: "Remote",
organization: "Future Works",
location: "Remote",
deadline: "September 5, 2026",
description: "Remote support position.",
link: "#"
}

];

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

renderFeatured();
renderLatest(opportunities);

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
