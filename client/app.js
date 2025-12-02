/*************************/
/*        NAV BAR        */
/*************************/

/*
 * Theme Button / Background
 */

const themeBtn = document.getElementById("themeBtn");
const bgImg = document.getElementById("bg-layer");
const nav = document.querySelector("nav");
let themeDark = false;

themeBtn.addEventListener("click", () => {
    if (!themeDark) {
        bgImg.style.backgroundImage = 'url("img/night.jpg")';
        nav.style.backgroundColor = "black";
        nav.style.color = "white";
        themeDark = true;
    } else {
        bgImg.style.backgroundImage = 'url("img/day.jpg")';
        nav.style.backgroundColor = "rgb(200, 230, 255)";
        nav.style.color = "rgb(0, 100, 200)";
        themeDark = false;
    }
});

window.addEventListener("scroll", () => {
    const offset = window.scrollY * -0.3;
    bgImg.style.transform = `translateY(${offset}px)`;
})

/*
 * Upload Button
 */

const WIDTH = 500;
const HEIGHT = 500;

const fileInput = document.getElementById("fileInput");
const gallery = document.getElementById("gallery");

let selectedFile = null;
const preview = document.createElement("img");
preview.style.maxWidth = "200px";
preview.style.borderRadius = "8px";

const uploadPreview = document.getElementById("uploadPreview");
const uploadDescription = document.getElementById("uploadDescription");
const uploadTags = document.getElementById("uploadTags");

uploadBtn.addEventListener("click", () => { fileInput.click(); });

fileInput.addEventListener("change", (event) => {
    const file = event.target.files[0];
    if (file && file.type.startsWith("image/gif")) {
        const reader = new FileReader();
        reader.onload = (e) => {
            preview.src = e.target.result;
            preview.alt = "Preview";
            uploadPreview.innerHTML = "";
            uploadPreview.appendChild(preview);
            selectedFile = file;
        };
        reader.readAsDataURL(file);
        fileInput.value = "";
    }
});

const submitBtn = document.getElementById("submitBtn");
submitBtn.addEventListener("click", async () => {
    if (!selectedFile) {
        alert("Please select a GIF image to upload");
        return;
    }

    const desc = uploadDescription.value.trim();
    const tags = uploadTags.value.trim().split(",").map(t => t.trim());

    const reader = new FileReader();
    reader.onload = async (e) => {
        const base64Image = e.target.result;

        // Confirm image is 500x500px
        const img = new Image();
        img.onload = async () => {
            if (img.width != WIDTH || img.height != HEIGHT) {
                alert(`Image dimensions must be ${WIDTH}x${HEIGHT} pixels.`);
                setTimeout(clearUploadUtility, 0);
                return;
            }

            // POST to backend
            try {
                const token = localStorage.getItem("authToken");
                const res = await fetch("http://localhost:3000/posts/create", {
                    method: "POST",
                    headers: {
                        "Content-Type": "application/json",
                        "Authorization": `Bearer ${token}`
                    },
                    body: JSON.stringify({
                        imageUrl: base64Image,
                        description: desc,
                        tags: tags
                    })
                });

                const postData = await res.json();
                console.log("Post created:", postData);

                // Update the gallery
                const galleryImg = document.createElement("img");
                galleryImg.src = base64Image;
                galleryImg.alt = "Gallery image";
                galleryImg.dataset.desc = desc;
                galleryImg.dataset.tags = tags.join(", ");
                galleryImg.dataset.author = JSON.parse(localStorage.getItem("user"))?.name || "@username";
                gallery.prepend(galleryImg);

                alert("GIF uploaded successfully!");
                clearUploadUtility();
            } catch (err) {
                console.error("Error uploading GIF:", err);
                alert("Upload failed. See console for details.");
            }
        };
        img.src = base64Image;
    };
    reader.readAsDataURL(selectedFile);
});

/*
 * JWT Credential
 */

async function handleCredentialResponse(response) {
    console.log("Google raw response:", response);

    // Only send credential to backend for authentication once
    const serverResponse = await fetch("http://localhost:3000/auth/google", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ credential: response.credential })
    });

    const data = await serverResponse.json();
    console.log("Auth response from backend:", data);

    if (data && data.token) {
        // Save JWT in localStorage
        localStorage.setItem("authToken", data.token);
        localStorage.setItem("user", JSON.stringify(data.user));
        gSignInButton.style.display = "none";
        profileImg.style.display = "block";

        alert(`Welcome ${data.user.name}! You are now logged in.`);
    }
}

const gSignInButton = document.querySelector(".g_id_signin");
const profileImg = document.getElementById("profile");

// Check if user is already logged in
window.addEventListener("DOMContentLoaded", () => {
    const user = JSON.parse(localStorage.getItem("user"));
    if (user) {
        alert(`Welcome back, ${user.name}!`);
        // Optionally hide the sign-in button
        gSignInButton.style.display = "none";
        profileImg.style.display = "block";
    }
});

/*
 * Search Bar
 */

const searchInput = document.getElementById("searchInput");

searchInput.addEventListener("input", () => {
    const query = searchInput.value.trim().toLowerCase();

    // Loop through all post wrappers
    const postItems = document.querySelectorAll(".gallery .post-item");
    postItems.forEach(wrapper => {

        const img = wrapper.querySelector("img");
        const tags = img.dataset.tags ? img.dataset.tags.toLowerCase() : "";

        // If any tag matches the query, show it; otherwise, hide it
        if (!query || tags.split(",").some(tag => tag.includes(query))) wrapper.style.display = "";
        else wrapper.style.display = "none";
    });
});

/**************************/
/*          BODY          */
/**************************/

/*
 * Main Gallery
 */

async function loadGallery() {
    try {
        const response = await fetch("http://localhost:3000/posts/feed");
        const posts = await response.json();

        // Clear gallery
        gallery.innerHTML = "";

        // Get current user from localStorage
        const currentUser = JSON.parse(localStorage.getItem("user"));

        posts.reverse().forEach(post => {

            const wrapper = document.createElement("div");
            wrapper.className = "post-item";

            const img = document.createElement("img");
            img.src = post.imageUrl;
            img.alt = "Gallery image";
            img.dataset.id = post._id;
            img.dataset.author = post.author?.name || "@username";
            img.dataset.desc = post.description || "";
            img.dataset.tags = post.tags?.join(",") || "";

            // Heart Button
            const heart = document.createElement("div");
            heart.className = "heart-btn";
            heart.innerHTML = "♡";

            if (currentUser && post.likes.includes(currentUser._id)) {
                heart.classList.add("liked");
                heart.innerHTML = "❤️";
            }

            const likesCount = document.createElement("span");
            likesCount.className = "likes-count";
            likesCount.textContent = post.likes.length;

            // Heart click handler
            heart.addEventListener("click", async (e) => {
                e.stopPropagation();
                const token = localStorage.getItem("authToken");
                if (!token) return alert("You must be logged in to like posts.");

                const liked = heart.classList.contains("liked");
                const endpoint = liked ? "unlike" : "like";

                const res = await fetch(`http://localhost:3000/posts/${post._id}/${endpoint}`, {
                    method: "POST",
                    headers: { "Authorization": `Bearer ${token}` }
                });
                const data = await res.json();

                likesCount.textContent = data.likes;

                if (liked) {
                    heart.classList.remove("liked");
                    heart.innerHTML = "♡";
                } else {
                    heart.classList.add("liked");
                    heart.innerHTML = "❤️";
                }
            });

            // DELETE button (only show if current user is the author)
            if (currentUser && post.author && currentUser._id == post.author._id) {
                const deleteBtn = document.createElement("div");
                deleteBtn.className = "delete-btn";
                deleteBtn.textContent = "X";
                deleteBtn.title = "Delete this post";

                deleteBtn.addEventListener("click", async (e) => {
                    e.stopPropagation();
                    if (!confirm("Are you sure you want to delete this post?")) return;

                    const token = localStorage.getItem("authToken");
                    if (!token) return alert("You must be logged in to delete posts.");

                    try {
                        const res = await fetch(`http://localhost:3000/posts/${post._id}`, {
                            method: "DELETE",
                            headers: { "Authorization": `Bearer ${token}` }
                        });
                        const data = await res.json();

                        if (res.ok) {
                            wrapper.remove();
                            alert("Post deleted");
                        } else {
                            alert(data.message || "Failed to delete post.");
                        }
                    } catch (err) {
                        console.error("Delete failed: ", err);
                        alert("Error deleting post.");
                    }
                });

                wrapper.appendChild(deleteBtn);
            }

            wrapper.appendChild(img);
            wrapper.appendChild(heart);
            wrapper.appendChild(likesCount);
            gallery.appendChild(wrapper);
        });

    } catch (err) {
        console.error("Error loading gallery:", err);
    }
}


// Initial page load logic for gallery/auth

window.addEventListener("load", () => {

    // 1.) Load the gallery
    try {
        loadGallery();
    } catch (err) {
        console.error("loadGallery() failed on startup:", err);
    }

    // 2.) Some Google Auth stuff to check if user is signed in. If so, hide the sign-in button.
    let user = null;
    try {
        user = JSON.parse(localStorage.getItem("user"));
    } catch (e) {
        console.warn("Could not parse user from localStorage:", e);
    }

    if (user && gSignInButton) {

        // Hide GIS sign-in and replace with profile img
        gSignInButton.style.display = "none";
        profileImg.style.display = "block";
    }
});

/*
 * Upload Overlay
 */

const uploadOverlay = document.getElementById("uploadOverlay");
const uploadCloseBtn = document.getElementById("uploadCloseBtn");
const newPost = document.getElementById("newPost");

// Open Upload Utility
let newpost_mouseDownOverlay = false;

newPost.addEventListener("mousedown", () => { newpost_mouseDownOverlay = true; });

newPost.addEventListener("mouseup", () => {
    if (newpost_mouseDownOverlay) uploadOverlay.style.display = "flex";
    newpost_mouseDownOverlay = false;
});

// Clear All Upload Utility Fields
function clearUploadUtility() {
    uploadPreview.innerHTML = "";
    uploadOverlay.style.display = "none";
    uploadDescription.value = "";
    uploadTags.value = "";
    selectedFile = null;
}

// A.) Exit when user clicks close button
uploadCloseBtn.addEventListener("click", () => { clearUploadUtility(); });

// B.) Exit when user clicks background
let upload_mouseDownOverlay = false;

uploadOverlay.addEventListener("mousedown", (e) => {
    if (e.target === uploadOverlay) upload_mouseDownOverlay = true;
});

uploadOverlay.addEventListener("mouseup", (e) => {
    if (upload_mouseDownOverlay && e.target === uploadOverlay) clearUploadUtility();
    upload_mouseDownOverlay = false;
});

// C.) Exit when user presses esc
document.addEventListener("keydown", (e) => {
    if (e.key === "Escape") clearUploadUtility();
});

/*
 *  Gallery Overlay
 */

const galleryImages = document.querySelectorAll(".gallery img");
const galleryOverlay = document.getElementById("galleryOverlay");
const galleryOverlayImg = document.getElementById("galleryOverlayImg");
const galleryCloseBtn = document.getElementById("galleryCloseBtn");

function openOverlay(img) {
    galleryOverlay.style.display = "flex";
    galleryOverlayImg.src = img.src;

    document.getElementById("imgAuthor").textContent = img.dataset.author || "@username";
    document.getElementById("imgDesc").textContent = img.dataset.desc || "";

    const imgTags = document.getElementById("imgTags");
    imgTags.innerHTML = "";
    if (img.dataset.tags) {
        img.dataset.tags.split(",").forEach(tag => {
            const span = document.createElement("span");
            span.className = "tag";
            span.textContent = tag.trim();
            imgTags.appendChild(span);
        });
    }
}

gallery.addEventListener("click", (e) => {
    if (e.target.tagName === "IMG") openOverlay(e.target);
});

// A.) Exit when user clicks close button
galleryCloseBtn.addEventListener("click", () => {
    galleryOverlay.style.display = "none";
});

// B.) Exit when user clicks background
let gallery_mouseDownOverlay = false;

galleryOverlay.addEventListener("mousedown", (e) => {
    if (e.target === galleryOverlay) gallery_mouseDownOverlay = true;
});

galleryOverlay.addEventListener("mouseup", (e) => {
    if (gallery_mouseDownOverlay && e.target === galleryOverlay) galleryOverlay.style.display = "none";
    gallery_mouseDownOverlay = false;
});

// C.) Exit when user presses esc
document.addEventListener("keydown", (e) => {
    if (e.key === "Escape") galleryOverlay.style.display = "none";
});