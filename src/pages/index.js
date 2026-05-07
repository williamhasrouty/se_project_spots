import "./index.css";

import {
  enableValidation,
  resetValidation,
  validationConfig,
  toggleButtonState,
  disableButton,
} from "../scripts/validation.js";

import { setButtonText } from "../utils/helpers.js";

import Api from "../utils/Api.js";

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

// API
const api = new Api({
  baseUrl: "https://around-api.en.tripleten-services.com/v1",
  headers: {
    authorization: "6d147b2c-5d35-4eb6-a093-89a11257eb3a",
    "Content-Type": "application/json",
  },
});

let currentUserId;

api
  .getAppInfo()
  .then(([cards, userData]) => {
    currentUserId = userData._id;

    // Remove loading message from cards
    const loadingMessage = document.querySelector(".cards__loading");
    if (loadingMessage) {
      loadingMessage.remove();
    }

    cards.forEach((item) => renderCard(item, "append"));

    // Handle users info
    // set the src of the avatar image
    // set the textConent of both text elements
    avatarElement.src = userData.avatar;
    profileNameEl.textContent = userData.name;
    profileDescriptionEl.textContent = userData.about;

    // Remove loading states
    avatarElement.classList.remove("profile__avatar_loading");
    profileNameEl.classList.remove("profile__name_loading");
    profileDescriptionEl.classList.remove("profile__description_loading");
  })

  .catch(console.error);

// Edit form elements
const editProfileBtn = document.querySelector(".profile__edit-btn");
const editProfileModal = document.querySelector("#edit-profile-modal");
const editProfileForm = editProfileModal.querySelector(".modal__form");
const editProfileNameInput =
  editProfileModal.querySelector("#modal-name-input");
const editProfileDescriptionInput = editProfileModal.querySelector(
  "#modal-description-input",
);

// Avatar elements
const avatarElement = document.querySelector(".profile__avatar");
const avatarModalBtn = document.querySelector(".profile__avatar-btn");
const avatarModal = document.querySelector("#avatar-modal");
const avatarInput = avatarModal.querySelector("#profile-avatar-input");
const avatarForm = avatarModal.querySelector(".modal__form");

//Profile name and description elements

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

let selectedCard, selectedCardId;

// Delete form elements
const deleteModal = document.querySelector("#delete-modal");
const deleteForm = deleteModal.querySelector(".modal__form");
const deleteCancelBtn = deleteModal.querySelector(".modal__cancel-btn");

// Edit caption elements
const editCaptionModal = document.querySelector("#edit-caption-modal");
const editCaptionForm = editCaptionModal.querySelector(".modal__form");
const editCaptionInput = editCaptionModal.querySelector("#edit-caption-input");
let selectedCaptionElement;

// Preview modal elements
const previewModal = document.querySelector("#preview-modal");
const previewImgEl = previewModal.querySelector(".modal__image");
const previewCaptionEl = previewModal.querySelector(".modal__caption");
const previewCloseBtn = previewModal.querySelector(
  ".modal__close_type_preview",
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

function handleImagePreview(data) {
  previewImgEl.src = data.link;
  previewImgEl.alt = data.name;
  previewCaptionEl.textContent = data.name;
  openModal(previewModal);
}

function handleLike(evt, cardId) {
  evt.preventDefault();
  const likeButton = evt.target;
  const isLiked = likeButton.classList.contains("card__like-btn_active");

  api
    .changeLikeStatus(cardId, isLiked)
    .then((updatedCard) => {
      if (updatedCard.isLiked) {
        likeButton.classList.add("card__like-btn_active");
      } else {
        likeButton.classList.remove("card__like-btn_active");
      }
    })
    .catch(console.error);
}

function handleDeleteSubmit(evt) {
  evt.preventDefault();
  const submitBtn = evt.submitter;
  setButtonText(submitBtn, true, "Delete", "Deleting...");
  api
    .deleteCard(selectedCardId)
    .then(() => {
      selectedCard.remove();
      closeModal(deleteModal);
    })
    .catch(console.error)
    .finally(() => {
      setButtonText(submitBtn, false, "Delete", "Deleting...");
    });
}

function handleDeleteCard(card, cardId) {
  selectedCard = card;
  selectedCardId = cardId;
  openModal(deleteModal);
}

function handleEditCaption(captionElement, cardId) {
  selectedCaptionElement = captionElement;
  selectedCardId = cardId;
  editCaptionInput.value = captionElement.textContent;

  resetValidation(editCaptionForm, [editCaptionInput], validationConfig);
  const buttonElement = editCaptionForm.querySelector(
    validationConfig.submitButtonSelector,
  );
  toggleButtonState([editCaptionInput], buttonElement, validationConfig);

  openModal(editCaptionModal);
}

function handleAvatarSubmit(evt) {
  evt.preventDefault();
  const avatarUrl = avatarInput.value;
  const submitBtn = evt.submitter;
  setButtonText(submitBtn, true, "Save", "Saving...");
  api
    .editUserAvatar({ avatar: avatarUrl })
    .then((data) => {
      avatarElement.src = data.avatar;
      closeModal(avatarModal);
      avatarForm.reset();
    })
    .catch(console.error)
    .finally(() => {
      setButtonText(submitBtn, false, "Save", "Saving...");
    });
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
  const editBtn = card.querySelector(".card__edit-btn");

  // If card is liked, set active class
  const isLiked = data.isLiked;
  if (isLiked) {
    likeBtn.classList.add("card__like-btn_active");
  }

  image.src = data.link;
  image.alt = data.name;
  caption.textContent = data.name;

  // Only add API-dependent functionality if card has an ID
  if (data._id) {
    likeBtn.addEventListener("click", (evt) => handleLike(evt, data._id));
    deleteBtn.addEventListener("click", () => handleDeleteCard(card, data._id));
    editBtn.addEventListener("click", () =>
      handleEditCaption(caption, data._id),
    );
  } else {
    // For cards without IDs (initial cards), add simple toggle
    likeBtn.addEventListener("click", () => {
      likeBtn.classList.toggle("card__like-btn_active");
    });
    // Hide delete and edit buttons for initial cards
    deleteBtn.style.display = "none";
    editBtn.style.display = "none";
  }

  image.addEventListener("click", () => handleImagePreview(data));

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
    validationConfig.submitButtonSelector,
  );
  resetValidation(
    editProfileForm,
    [editProfileNameInput, editProfileDescriptionInput],
    validationConfig,
  );
  toggleButtonState(inputList, buttonElement, validationConfig);
  openModal(editProfileModal);
});

editProfileForm.addEventListener("submit", (evt) => {
  evt.preventDefault();
  const submitBtn = evt.submitter;
  setButtonText(submitBtn, true, "Save", "Saving...");

  api
    .editUserInfo({
      name: editProfileNameInput.value,
      about: editProfileDescriptionInput.value,
    })
    .then((data) => {
      profileNameEl.textContent = data.name;
      profileDescriptionEl.textContent = data.about;
      closeModal(editProfileModal);
    })
    .catch(console.error)
    .finally(() => {
      setButtonText(submitBtn, false, "Save", "Saving...");
    });
});

// TODO - implement loading text for all over form submissions

// Edit caption function
editCaptionForm.addEventListener("submit", (evt) => {
  evt.preventDefault();
  const submitBtn = evt.submitter;
  setButtonText(submitBtn, true, "Save", "Saving...");

  api
    .editCard(selectedCardId, {
      name: editCaptionInput.value,
    })
    .then((data) => {
      selectedCaptionElement.textContent = data.name;
      closeModal(editCaptionModal);
    })
    .catch(console.error)
    .finally(() => {
      setButtonText(submitBtn, false, "Save", "Saving...");
    });
});

// New post function
newPostBtn.addEventListener("click", () => {
  openModal(newPostModal);
});

newPostForm.addEventListener("submit", (evt) => {
  evt.preventDefault();
  const submitBtn = evt.submitter;
  setButtonText(submitBtn, true, "Save", "Saving...");

  api
    .addCard({
      name: newPostCaptionInput.value,
      link: newPostImgLinkInput.value,
    })
    .then((cardData) => {
      renderCard(cardData, "prepend");
      closeModal(newPostModal);
      newPostForm.reset();
      disableButton(newPostSubmitBtn, validationConfig);
    })
    .catch(console.error)
    .finally(() => {
      setButtonText(submitBtn, false, "Save", "Saving...");
    });
});

enableValidation(validationConfig);

// Edit avatar function
avatarModalBtn.addEventListener("click", () => {
  openModal(avatarModal);
});
avatarForm.addEventListener("submit", handleAvatarSubmit);

deleteForm.addEventListener("submit", handleDeleteSubmit);

deleteCancelBtn.addEventListener("click", () => {
  closeModal(deleteModal);
});
