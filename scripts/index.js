// Initial cards
const initialCards = [
  {
    name: "Golden Gate bridge",
    link: "https://practicum-content.s3.us-west-1.amazonaws.com/software-engineer/spots/7-photo-by-griffin-wooldridge-from-pexels.jpg",
  },

  {
    name: "Val Thorens",
    link: "https://practicum-content.s3.us-west-1.amazonaws.com/software-engineer/spots/1-photo-by-moritz-feldmann-from-pexels.jpg",
  },
  {
    name: "Restaurant terrace",
    link: "https://practicum-content.s3.us-west-1.amazonaws.com/software-engineer/spots/2-photo-by-ceiline-from-pexels.jpg",
  },
  {
    name: "An outdoor cafe",
    link: "https://practicum-content.s3.us-west-1.amazonaws.com/software-engineer/spots/3-photo-by-tubanur-dogan-from-pexels.jpg",
  },
  {
    name: "A very long bridge, over the forest and through the trees",
    link: "https://practicum-content.s3.us-west-1.amazonaws.com/software-engineer/spots/4-photo-by-maurice-laschet-from-pexels.jpg",
  },
  {
    name: "Tunnel with morning light",
    link: "https://practicum-content.s3.us-west-1.amazonaws.com/software-engineer/spots/5-photo-by-van-anh-nguyen-from-pexels.jpg",
  },
  {
    name: "Mountain house",
    link: "https://practicum-content.s3.us-west-1.amazonaws.com/software-engineer/spots/6-photo-by-moritz-feldmann-from-pexels.jpg",
  },
];

// Edit form elements
const editProfileBtn = document.querySelector(".profile__edit-btn");
const editProfileModal = document.querySelector("#edit-profile-modal");
const editProfileForm = editProfileModal.querySelector(".modal__form");
const editProfileNameInput =
  editProfileModal.querySelector("#modal-name-input");
const editProfileDescriptionInput = editProfileModal.querySelector(
  "#modal-description-input"
);
const profileNameEl = document.querySelector(".profile__name");
const profileDescriptionEl = document.querySelector(".profile__description");

// New post elements
const newPostBtn = document.querySelector(".profile__add-btn");
const newPostModal = document.querySelector("#new-post-modal");

const newPostForm = newPostModal.querySelector(".modal__form");
const newPostImgLinkInput = newPostModal.querySelector("#card-image-input");
const newPostCaptionInput = newPostModal.querySelector("#card-caption-input");
const newPostSubmitBtn = newPostModal.querySelector(".modal__submit-btn");

// Card related elements
const cardTemplate = document
  .querySelector("#card-template")
  .content.querySelector(".card");
const cardsList = document.querySelector(".cards__list");

// Preview modal elements
const previewModal = document.querySelector("#preview-modal");
const previewImgEl = previewModal.querySelector(".modal__image");
const previewCaptionEl = previewModal.querySelector(".modal__caption");
const previewCloseBtn = previewModal.querySelector(
  ".modal__close_type_preview"
);

document.querySelectorAll(".modal__close-btn").forEach((btn) => {
  const modal = btn.closest(".modal");
  btn.addEventListener("click", () => closeModal(modal));
});

// Modal functions
function openModal(modal) {
  modal.classList.add("modal_is-opened");
  document.addEventListener("keydown", handleEscClose);
}

function closeModal(modal) {
  modal.classList.remove("modal_is-opened");
  document.removeEventListener("keydown", handleEscClose);
}

function handleEscClose(event) {
  if (event.key === "Escape") {
    const openedModal = document.querySelector(".modal.modal_is-opened");
    if (openedModal) {
      closeModal(openedModal);
    }
  }
}

document.querySelectorAll(".modal").forEach((modal) => {
  modal.addEventListener("mousedown", (event) => {
    if (event.target.classList.contains("modal")) {
      closeModal(modal);
    }
  });
});

// Card functions
function getCardElement(data) {
  const card = cardTemplate.cloneNode(true);
  const image = card.querySelector(".card__image");
  const caption = card.querySelector(".card__caption");
  const likeBtn = card.querySelector(".card__like-btn");
  const deleteBtn = card.querySelector(".card__delete-btn");

  image.src = data.link;
  image.alt = data.name;
  caption.textContent = data.name;

  likeBtn.addEventListener("click", () =>
    likeBtn.classList.toggle("card__like-btn_active")
  );
  deleteBtn.addEventListener("click", () => card.remove());
  image.addEventListener("click", () => {
    previewImgEl.src = data.link;
    previewImgEl.alt = data.name;
    previewCaptionEl.textContent = data.name;
    openModal(previewModal);
  });

  return card;
}

function renderCard(data, method = "prepend") {
  const card = getCardElement(data);
  if (typeof cardsList[method] === "function") {
    cardsList[method](card);
  } else {
    console.warn(`Invalid method "${method}". Falling back to prepend.`);
    cardsList.prepend(card);
  }
}

// Edit profile function
editProfileBtn.addEventListener("click", () => {
  editProfileNameInput.value = profileNameEl.textContent;
  editProfileDescriptionInput.value = profileDescriptionEl.textContent;

  const inputList = [editProfileNameInput, editProfileDescriptionInput];
  const buttonElement = editProfileForm.querySelector(
    settings.submitButtonSelector
  );
  resetValidation(
    editProfileForm,
    [editProfileNameInput, editProfileDescriptionInput],
    settings
  );
  toggleButtonState(inputList, buttonElement, settings);
  openModal(editProfileModal);
});

editProfileForm.addEventListener("submit", (evt) => {
  evt.preventDefault();
  profileNameEl.textContent = editProfileNameInput.value;
  profileDescriptionEl.textContent = editProfileDescriptionInput.value;
  closeModal(editProfileModal);
});

// New post function
newPostBtn.addEventListener("click", () => {
  resetValidation(
    newPostForm,
    [newPostCaptionInput, newPostImgLinkInput],
    settings
  );
  openModal(newPostModal);
});

newPostForm.addEventListener("submit", (evt) => {
  evt.preventDefault();
  const inputValues = {
    name: newPostCaptionInput.value,
    link: newPostImgLinkInput.value,
  };
  renderCard(inputValues, "prepend");
  closeModal(newPostModal);
  evt.target.reset();
  disableButton(cardSubmitBtn, settings);
});

// Init
enableValidation(settings);
initialCards.forEach((item) => renderCard(item, "append"));
