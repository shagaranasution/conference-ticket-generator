const avatarInputEl = document.querySelector('#file-upload');
const fullNameInputEl = document.querySelector('#full-name');
const emailInputEl = document.querySelector('#email-address');
const githubUsernameInputEl = document.querySelector('#github-username');

const avatarPreviewEl = document.querySelector('#avatar-preview');
const fileStateEmptyEl = document.querySelector('#file-state-empty');
const fileStateFilledEl = document.querySelector('#file-state-filled');

const changeImageButton = document.querySelector('#btn-change-image');
const removeImageButton = document.querySelector('#btn-remove-image');

const avatarPreviewPlaceholderImageUrl = avatarPreviewEl.src;

const avatarHintEl = document.querySelector('#avatar-hint');
const avatarErrorEl = document.querySelector('#avatar-error');
const fullNameErrorEl = document.querySelector('#full-name-error');
const emailErrorEl = document.querySelector('#email-error');
const githubUsernameErrorEl = document.querySelector('#github-username-error');

const generateButtonEl = document.querySelector('#btn-generate');

const fillTicketContainerEl = document.querySelector('#fill-ticket-container');
const generatedTicketContainerEl = document.querySelector(
  '#generated-ticket-container'
);

const resultDateLocationEl = document.querySelector(
  '[data-id="result-avatar-preview"]'
);
const resultAvatarEl = document.querySelector('[data-id="result-avatar"]');
const resultUserFullNameHeadingEl = document.querySelector(
  '[data-id="result-fullname-heading"]'
);
const resultUserFullNameEl = document.querySelector(
  '[data-id="result-fullname"]'
);
const resultEmailEl = document.querySelector('[data-id="result-email"]');
const resultGithubUsernameEl = document.querySelector(
  '[data-id="result-github-username"'
);

const formData = {
  avatar: '',
  fullName: '',
  email: '',
  githubUsername: '',
};

const appState = new Proxy(formData, {
  set(target, key, value) {
    target[key] = value;

    const elements = document.querySelectorAll(`[data-bind="${key}"]`);

    for (const element of elements) {
      if (
        element.tagName === 'INPUT' &&
        element.getAttribute('type') !== 'file'
      ) {
        element.value = value;
      } else {
        element.textContent = value;
      }
    }

    return true;
  },
});

function showFileEmptyState() {
  fileStateEmptyEl.removeAttribute('hidden');
  fileStateFilledEl.setAttribute('hidden', '');
}

function showFileFilledState() {
  fileStateFilledEl.removeAttribute('hidden');
  fileStateEmptyEl.setAttribute('hidden', '');
}

function handleAvatarChange(event) {
  const file = event.target?.files?.[0];

  if (!!file) {
    const { name, size, type } = file;
    const objectURL = URL.createObjectURL(file);

    avatarPreviewEl.src = objectURL;
    avatarPreviewEl.style.padding = '0px';

    showFileFilledState();
  }
}

function getAvatarObjectURL(file) {
  if (!!file) {
    return URL.createObjectURL(file);
  }
}

function handleChangeImageButtonClick() {
  avatarInputEl.click();
}

function handleRemoveImageButtonClick() {
  avatarPreviewEl.src = avatarPreviewPlaceholderImageUrl;
  showFileEmptyState();
  URL.revokeObjectURL(appState.avatar);
  appState.avatar = '';
}

function isValidEmail(value) {
  if (typeof value !== 'string') return false;

  const email = value.trim();

  if (!email) return false;
  if (email.includes(' ')) return false;

  const atIndex = email.indexOf('@');

  if (atIndex <= 0 || atIndex !== email.lastIndexOf('@')) {
    return false;
  }

  const local = email.slice(0, atIndex);
  const domain = email.slice(atIndex + 1);

  if (!local || !domain) return false;

  const dotIndex = domain.lastIndexOf('.');

  if (dotIndex <= 0 || dotIndex === domain.length - 1) {
    return false;
  }

  return true;
}

function validateInputs(values) {
  let results = {};

  for (const [key, value] of Object.entries(values)) {
    if (key === 'avatar') {
      if (!values[key]?.trim()) {
        avatarInputEl.setAttribute('area-invalid', 'true');
        avatarHintEl.setAttribute('hidden', '');
        avatarErrorEl.removeAttribute('hidden');
        results[key] = false;
      } else {
        avatarInputEl.setAttribute('area-invalid', 'false');
        avatarErrorEl.setAttribute('hidden', '');
        avatarHintEl.removeAttribute('hidden');
        results[key] = true;
      }
    } else if (key === 'fullName') {
      if (!values[key].trim()) {
        fullNameInputEl.setAttribute('aria-invalid', 'true');
        fullNameErrorEl.removeAttribute('hidden');
        results[key] = false;
      } else {
        fullNameInputEl.setAttribute('aria-invalid', 'false');
        fullNameErrorEl.setAttribute('hidden', '');
        results[key] = true;
      }
    } else if (key === 'email') {
      if (!isValidEmail(values[key])) {
        emailInputEl.setAttribute('aria-invalid', 'true');
        emailErrorEl.removeAttribute('hidden');
        results[key] = false;
      } else {
        emailInputEl.setAttribute('aria-invalid', 'false');
        emailErrorEl.setAttribute('hidden', '');
        results[key] = true;
      }
    } else if (key === 'githubUsername') {
      if (!values[key].trim()) {
        githubUsernameInputEl.setAttribute('aria-invalid', 'true');
        githubUsernameErrorEl.removeAttribute('hidden');
        results[key] = false;
      } else {
        githubUsernameInputEl.setAttribute('aria-invalid', 'false');
        githubUsernameErrorEl.setAttribute('hidden', '');
        results[key] = true;
      }
    }
  }

  return !Object.values(results).includes(false);
}

// avatarInputEl.addEventListener('change', handleAvatarChange);

changeImageButton.addEventListener('click', handleChangeImageButtonClick);

removeImageButton.addEventListener('click', handleRemoveImageButtonClick);

document.querySelectorAll('[data-bind]').forEach((element) => {
  if (element.tagName === 'INPUT') {
    element.addEventListener('change', (e) => {
      const type = element.getAttribute('type');
      const key = element.getAttribute('data-bind');
      if (type === 'file') {
        const file = e.target?.files?.[0];

        if (!!file) {
          URL.revokeObjectURL(appState.avatar);
          appState[key] = '';
          const objectURL = URL.createObjectURL(file);
          appState[key] = objectURL;
          avatarPreviewEl.src = objectURL;
          avatarPreviewEl.style.padding = '0px';
          showFileFilledState();
        }
      } else {
        appState[key] = e.target.value;
      }
    });
  }
});

generateButtonEl.addEventListener('click', (e) => {
  e.preventDefault();

  if (!validateInputs(JSON.parse(JSON.stringify(appState)))) {
    return;
  }

  fillTicketContainerEl.setAttribute('hidden', '');
  generatedTicketContainerEl.removeAttribute('hidden');

  resultAvatarEl.src = appState.avatar;
  resultUserFullNameHeadingEl.textContent = appState.fullName + '!';
  resultUserFullNameEl.textContent = appState.fullName;
  resultEmailEl.textContent = appState.email;
  resultGithubUsernameEl.textContent = appState.githubUsername;
});
