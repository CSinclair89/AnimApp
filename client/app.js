/*
 *  "New post" Button
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
submitBtn.addEventListener("click", () => {
    if (!selectedFile) {
        alert("Please select a GIF image to upload");
        return;
    }

    // Get input values from upload fields
    const desc = uploadDescription.value.trim();
    const tags = uploadTags.value.trim();

    const reader = new FileReader();
    reader.onload = (e) => {
        const img = document.createElement("img");
        img.onload = () => {
            if (img.width != WIDTH || img.height != HEIGHT) {
                alert("Image dimensions must be 200x200 pixels.");

                // Wait for alert to be pressed before clearing selected file/preview
                setTimeout(() => {
                    selectedFile = null;
                    fileInput.value = "";
                    uploadPreview.innerHTML = "";
                }, 0);
                return;
            }
            img.alt = "Gallery image";
            img.dataset.desc = desc || "";
            img.dataset.tags = tags || "";
            img.dataset.author = "@username";

            gallery.prepend(img);
            uploadOverlay.style.display = "none";

            clearUploadUtility();
        };
        img.src = e.target.result;
    };
    reader.readAsDataURL(selectedFile);
});

/*
 * Upload Overlay
 */

const uploadOverlay = document.getElementById("uploadOverlay");
const uploadCloseBtn = document.getElementById("uploadCloseBtn");

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