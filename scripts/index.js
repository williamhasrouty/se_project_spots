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

const newPostBtn = document.querySelector(".profile__add-btn");
const newPostModal = document.querySelector("#new-post-modal");

const newPostForm = newPostModal.querySelector(".modal__form");
const newPostImgLinkInput = newPostModal.querySelector("#card-image-input");
const newPostCaptionInput = newPostModal.querySelector("#card-caption-input");

const cardImageEl = document.querySelector(".card__image");
const cardCaptionEl = document.querySelector(".card__caption");

const previewModal = document.querySelector("#preview-modal");
const previewImgEl = previewModal.querySelector(".modal__image");
const previewCaptionEl = previewModal.querySelector(".modal__caption");
const previewCloseBtn = previewModal.querySelector(
  ".modal__close_type_preview"
);

const cardTemplate = document
  .querySelector("#card-template")
  .content.querySelector(".card");

const cardsList = document.querySelector(".cards__list");

const closeBtn = document.querySelectorAll(".modal__close-btn");

closeBtn.forEach((button) => {
  const modal = button.closest(".modal");
  button.addEventListener("click", () => closeModal(modal));
});

function getCardElement(data) {
  let cardElement = cardTemplate.cloneNode(true);
  const cardCaptionEl = cardElement.querySelector(".card__caption");
  const cardImageEl = cardElement.querySelector(".card__image");
  const cardLikeBtn = cardElement.querySelector(".card__like-btn");

  cardLikeBtn.addEventListener("click", () => {
    cardLikeBtn.classList.toggle("card__like-btn_active");
  });
  cardImageEl.src = data.link;
  cardImageEl.alt = data.name;
  cardCaptionEl.textContent = data.name;

  const cardDeleteBtn = cardElement.querySelector(".card__delete-btn");

  cardDeleteBtn.addEventListener("click", () => {
    cardElement.remove();
    cardElement = null;
  });

  cardImageEl.addEventListener("click", () => {
    previewImgEl.src = data.link;
    previewImgEl.alt = data.name;
    previewCaptionEl.textContent = data.name;
    openModal(previewModal);
  });

  return cardElement;
}

function openModal(modal) {
  modal.classList.add("modal_is-opened");
}

function closeModal(modal) {
  modal.classList.remove("modal_is-opened");
}

editProfileBtn.addEventListener("click", function () {
  editProfileNameInput.value = profileNameEl.textContent;
  editProfileDescriptionInput.value = profileDescriptionEl.textContent;
  openModal(editProfileModal);
});

newPostBtn.addEventListener("click", function () {
  openModal(newPostModal);
});

function handleEditProfileSubmit(evt) {
  evt.preventDefault();
  profileNameEl.textContent = editProfileNameInput.value;
  profileDescriptionEl.textContent = editProfileDescriptionInput.value;
  closeModal(editProfileModal);
}

editProfileForm.addEventListener("submit", handleEditProfileSubmit);

function handleNewPostSubmit(evt) {
  evt.preventDefault();

  const inputValues = {
    name: newPostCaptionInput.value,
    link: newPostImgLinkInput.value,
  };

  renderCard(inputValues, "prepend");
  closeModal(newPostModal);
  evt.target.reset();
}

function renderCard(item, method = "prepend") {
  const cardElement = getCardElement(item);

  if (typeof cardsList[method] === "function") {
    cardsList[method](cardElement);
  } else {
    console.warn(`Invalid method "${method}", defaulting to prepend.`);
    cardsList.prepend(cardElement);
  }
}

newPostForm.addEventListener("submit", handleNewPostSubmit);

initialCards.forEach((item) => renderCard(item, "append"));
