'use strict'

const maskSpinner = document.createElement('div');
const spinner = document.createElement('div');
const tableClients = document.querySelector('.table-clients__wrapper');

function loadSpinner() {

  maskSpinner.classList.add('wrapper-loader');
  tableClients.append(maskSpinner);


  spinner.classList.add('loader');
  maskSpinner.append(spinner);

  document.querySelector('.clients__btn-add').style.display = 'none';
}

function loaderSpinnerSmall (button) {
  spinner.classList.add('loader-mob');
  button.append(spinner);
}


function createClientItem(client) {


  const ulClients = document.createElement('ul');
  ulClients.classList.add('clients__list', 'list', 'list-reset');
  tableClients.append(ulClients)

  const liId = document.createElement('li');
  liId.classList.add('list__item', 'item', 'item-color', 'item-id');
  liId.innerHTML = `${client.id.slice(4, 10)}`;
  ulClients.append(liId);

  const liFio = document.createElement('li');
  liFio.classList.add('list__item', 'item', 'clients-info');
  liFio.innerHTML = `${client.surname} ${client.name}  ${client.lastName}`;
  ulClients.append(liFio);

  const liUpdatedAt = document.createElement('li');
  const spanTimeUpdate = document.createElement('span');
  spanTimeUpdate.classList.add('item-color');
  liUpdatedAt.classList.add('list__item', 'item', 'item-date');
  liUpdatedAt.innerHTML = `${new Date(client.createdAt).toLocaleDateString()}`;
  spanTimeUpdate.innerHTML = `${new Date(client.createdAt).toLocaleTimeString().slice(0, 5)}`;
  liUpdatedAt.append(spanTimeUpdate)
  ulClients.append(liUpdatedAt);

  const liCreatedAt = document.createElement('li');
  liCreatedAt.classList.add('list__item', 'item', 'item-date');
  const spanTimeCreate = document.createElement('span');
  spanTimeCreate.classList.add('item-color');
  liCreatedAt.innerHTML = `${new Date(client.updatedAt).toLocaleDateString()}`;
  spanTimeCreate.innerHTML = `${new Date(client.updatedAt).toLocaleTimeString().slice(0, 5)}`;
  liCreatedAt.append(spanTimeCreate)
  ulClients.append(liCreatedAt);

  const liSocial = document.createElement('li');
  liSocial.classList.add('list__item', 'item', 'item-social');

  client.contacts.forEach(item => {

    const linkSocial = document.createElement('a');
    linkSocial.setAttribute('href', '#!')
    linkSocial.classList.add('link-social-svg')

    if (item.value === 'Vk') {
      linkSocial.innerHTML = ` 
      <svg class="item__svg">
      <use xlink:href="#vk"></use>
      </svg>`
    }
    else if (item.value === 'Facebook') {
      linkSocial.innerHTML = ` 
      <svg class="item__svg">
      <use xlink:href="#fb"></use>
      </svg>`
    }
    else if (item.value === 'Телефон') {
      linkSocial.innerHTML = ` 
      <svg class="item__svg">
      <use xlink:href="#phone"></use>
      </svg>`
    }
    else if (item.value === 'Email') {
      linkSocial.innerHTML = ` 
      <svg class="item__svg">
      <use xlink:href="#email"></use>
      </svg>`
    }
    else if (item.value === 'Другое') {
      linkSocial.innerHTML = ` 
      <svg class="item__svg">
      <use xlink:href="#person"></use>
      </svg>`
    }
    liSocial.append(linkSocial);

    linkSocial.addEventListener('mouseenter', (e) => {
      e.preventDefault();

      const linkBoxType = document.createElement('div');
      linkBoxType.classList.add('link__svg--active');

      const linkBoxText = document.createElement('div');
      linkBoxText.classList.add('link__box-text')
      linkBoxText.innerHTML = ` 
       <a href="${item.type}" class="link__item-social">${item.type}</a>`
      linkBoxType.append(linkBoxText)
      linkSocial.append(linkBoxType)

    })

    linkSocial.addEventListener('mouseleave', function () {
      document.querySelector('.link__svg--active').remove();
    })

  })

  ulClients.append(liSocial)

  const wrapperBtn = document.createElement('div');
  wrapperBtn.classList.add('item__btn-group');
  wrapperBtn.style.display = 'flex';
  ulClients.append(wrapperBtn);

  const btnChange = document.createElement('button');
  btnChange.classList.add('item__btn', 'btn-change', 'btn-reset')
  btnChange.innerHTML =
    ` <svg class="item__btn-svg svg-change item__svg">
       <use xlink:href="#change"></use>
     </svg> 
     Изменить`;

  wrapperBtn.append(btnChange);

  const btnDelete = document.createElement('button');
  btnDelete.classList.add('item__btn', 'btn-delete', 'btn-reset');
  btnDelete.innerHTML =
    ` <svg class="item__btn-svg svg-delete item__svg">
       <use xlink:href="#delete"></use>
     </svg>
     Удалить`;
  wrapperBtn.append(btnDelete);

  btnDelete.addEventListener('click', (e) => {
    
    e.target.firstChild.nextSibling.style.display = 'none';
   
    loaderSpinnerSmall(btnDelete);

    document.body.prepend(createModalWithFormDelete(client, ulClients));
  })

  btnChange.addEventListener('click', (e) => {

    e.target.firstChild.nextSibling.style.display = 'none';
    loaderSpinnerSmall(btnChange);
    
    document.body.prepend(
      createModalWithForm(
        `Изменить данные <span class="id--color">id:${client.id.slice(4, 10)}</span>`,
        'get', { onSave, onClose, onChange }, client, ulClients));
  })

}

function renderTableClients(objListClients) {
  objListClients.forEach(item => {
    createClientItem(item)
  })
}

async function getObjClients() {
  const response = await fetch('http://localhost:3000/api/clients');
  const dataClients = await response.json();

  let result = [...dataClients].sort(function (a, b) {
    if (a.id > b.id) return -1;
  })

  renderTableClients(result);
  maskSpinner.remove();
  document.querySelector('.clients__btn-add').style.display = 'flex';
}

getObjClients();
loadSpinner();



function createModalWithForm(title, method, { onSave, onClose, onChange }, client, clientElement) {

  const modalElement = document.createElement('div');
  modalElement.classList.add('modal');
  const modalBox = document.createElement('div');
  modalBox.classList.add('modal__box-add');
  modalElement.append(modalBox);

  const modalBoxTop = document.createElement('div');
  modalBoxTop.classList.add('modal__box-top');

  modalBox.append(modalBoxTop);
  const modalTitle = document.createElement('h2');
  modalTitle.classList.add('modal__box-title');
  modalTitle.innerHTML = title;
  modalBoxTop.append(modalTitle);

  const btnCloseModal = document.createElement('button');
  btnCloseModal.classList.add('modal__btn-close', 'btn-reset');
  btnCloseModal.innerHTML =
    `<svg class="item__btn-svg svg-delete item__svg-modal">
            <use xlink:href="#modal-close"></use>
      </svg>`;
  modalBoxTop.append(btnCloseModal);


  const form = document.createElement('form');
  form.setAttribute('method', method);
  form.classList.add('modal__form', 'form');
  modalBox.append(form);

  const wrapperInput = document.createElement('div');
  wrapperInput.classList.add('form__wrapper-input');
  form.append(wrapperInput);

  const inputSurname = document.createElement('input');
  inputSurname.classList.add('form__input');
  inputSurname.placeholder = `Фамилия`;
  inputSurname.required = true;

  const inputName = document.createElement('input');
  inputName.classList.add('form__input');
  inputName.placeholder = `Имя`;
  inputName.required = true;

  const inputLastName = document.createElement('input');
  inputLastName.classList.add('form__input');
  inputLastName.placeholder = `Отчество`;
  inputSurname.required = true;

  if (client !== undefined) {
    inputSurname.value = `${client.surname}`;
    inputName.value = `${client.name}`;
    inputLastName.value = `${client.lastName}`;
  } else {
    inputSurname.value = ``;
    inputName.value = ``;
    inputLastName.value = ``;
  }

  wrapperInput.append(inputSurname);
  wrapperInput.append(inputName);
  wrapperInput.append(inputLastName);


  const wrapperContacts = document.createElement('div');
  wrapperContacts.classList.add('form__contacts', 'contacts');
  form.append(wrapperContacts);


  const buttonAddContact = document.createElement('button');
  buttonAddContact.classList.add('contacts__btn-add', 'btn-reset')
  buttonAddContact.setAttribute('type', 'button');
  buttonAddContact.innerHTML = ` 
  <svg class="item__btn-svg svg-delete item__svg">
      <use xlink:href="#contacts-add"></use>
  </svg>
  Добавить контакт`;
  wrapperContacts.append(buttonAddContact);

  const listContact = document.createElement('ul');
  listContact.classList.add('contacts__list', 'list-reset');
  wrapperContacts.prepend(listContact);

  const massContact = [];
  const addedContact = [];

  if (client !== undefined && client.contacts.length !== 0) {
    client.contacts.forEach(item => {
      addedContact.push(item);
    })
  }

  if (addedContact.length !== 0) {
    addedContact.forEach(item => {
      createModalFormContacts(wrapperContacts, listContact, item.type, item.value, addedContact);
    })
  }

  buttonAddContact.addEventListener('click', (e) => {

    const item = createModalFormContacts(wrapperContacts, listContact);
    massContact.push(item);

    if ((massContact.length + addedContact.length) === 10) {
      e.target.style.display = 'none';
    }
  });

  const wrapperGroupBtn = document.createElement('div');
  wrapperGroupBtn.classList.add('form__btn-group');
  form.append(wrapperGroupBtn);

  const btnSave = document.createElement('button');
  btnSave.classList.add('form__btn-save', 'btn-reset', 'modal__btn');
  btnSave.innerHTML = 'Сохранить';
  btnSave.setAttribute('type', 'submit');

  const btnCancel = document.createElement('button');
  btnCancel.classList.add('form__btn-cancel', 'btn-reset');
  btnCancel.innerHTML = 'Отмена';
  btnCancel.setAttribute('type', 'button');

  wrapperGroupBtn.append(btnSave);
  wrapperGroupBtn.append(btnCancel);


  form.addEventListener('submit', (e) => {
    e.preventDefault();

    const data = {
      name: inputName.value.trim()[0].toUpperCase() + inputName.value.trim().substr(1).toLowerCase(),
      surname: inputSurname.value.trim()[0].toUpperCase() + inputSurname.value.trim().substr(1).toLowerCase(),
      lastName: inputLastName.value.trim()[0].toUpperCase() + inputLastName.value.trim().substr(1).toLowerCase(),
      contacts: [],
    }

    addedContact.forEach(item => {
      let contactElement = {
        value: item.value,
        type: item.type
      }
      data.contacts.push(contactElement);
    });

    massContact.forEach(item => {
      let contactElement = {
        value: item.firstChild.value,
        type: item.lastChild.value
      }
      data.contacts.push(contactElement);
    });

    if (client !== undefined) {
      onChange(data, modalElement, client, clientElement)
    } else {
      onSave(data, modalElement);
    }

  })

  btnCloseModal.addEventListener('click', () => {
    spinner.remove();
    document.querySelectorAll('.item__svg').forEach(item => {
      item.style.display = 'flex';
    })
    onClose(modalElement);
  })

  btnCancel.addEventListener('click', () => {
    spinner.remove();
    document.querySelectorAll('.item__svg').forEach(item => {
      item.style.display = 'flex';
    })
    onClose(modalElement);
  })

  return modalElement;

}

function createModalFormContacts(wrapperContacts, listContact, itemType, itemValue, addedContact) {

  listContact.style.display = 'flex';
  wrapperContacts.style.padding = 25 + 'px' + ' ' + 30 + 'px';

  const itemContact = document.createElement('li');
  itemContact.classList.add('contacts__item');
  listContact.append(itemContact);

  const formSelect = document.createElement('select');
  formSelect.classList.add('form__select');
  itemContact.append(formSelect);

  if (itemValue !== undefined && itemType !== undefined) {

    const defaultOption = document.createElement('option');
    defaultOption.value = "";
    defaultOption.innerHTML = itemValue;
    formSelect.append(defaultOption);

    const inputSelect = document.createElement('input');
    inputSelect.classList.add('input-select');
    inputSelect.placeholder = 'Введите данные контакта';
    inputSelect.value = itemType;
    itemContact.append(inputSelect);

    const btnDelContact = document.createElement('button');
    btnDelContact.classList.add('input__btn-clear', 'btn-reset');
    btnDelContact.innerHTML = `
    <svg class="item__btn-svg item__svg">
          <use xlink:href="#contacts-clear"></use>
    </svg>`;
    btnDelContact.setAttribute('type', 'button');
    itemContact.append(btnDelContact);

    btnDelContact.addEventListener('click', () => {

      for (let i = 0; i < addedContact.length; i++) {
        if (addedContact[i].type === itemType) {
          addedContact.splice(i, 1);
        }
      }
      itemContact.remove();
    })

  } else {
    const phoneOption = document.createElement('option');
    phoneOption.value = "Телефон";
    phoneOption.innerHTML = 'Телефон';
    formSelect.append(phoneOption);

    const emailOption = document.createElement('option');
    emailOption.value = "Email";
    emailOption.innerHTML = 'Email';
    formSelect.append(emailOption);

    const facebookOption = document.createElement('option');
    facebookOption.value = "Facebook";
    facebookOption.innerHTML = 'Facebook';
    formSelect.append(facebookOption);

    const vkOption = document.createElement('option');
    vkOption.value = "Vk";
    vkOption.innerHTML = 'Vk';
    formSelect.append(vkOption);

    const otherOption = document.createElement('option');
    otherOption.value = "Другое";
    otherOption.innerHTML = 'Другое';
    formSelect.append(otherOption);

    const inputSelect = document.createElement('input');
    inputSelect.classList.add('input-select');
    inputSelect.placeholder = 'Введите данные контакта';
    itemContact.append(inputSelect);
  }
  return itemContact;
}


async function onSave(formData, modalElement) {

  const response = await fetch('http://localhost:3000/api/clients', {
    method: 'POST',
    body: JSON.stringify(formData),
    headers: { 'Content-Type': 'application/json' }
  })

  const client = await response.json();
  createClientItem(client);
  modalElement.remove();
}

async function onClose(modalElement) {
  modalElement.remove();
}


async function onChange(formData, modalElement, objClient, clientElement) {

  const response = await fetch(`http://localhost:3000/api/clients/${objClient.id}`, {
    method: 'PATCH',
    body: JSON.stringify(formData),
    headers: { 'Content-Type': 'application/json' }
  })

  await clientElement.remove();

  const client = await response.json();
  createClientItem(client);
  modalElement.remove();
}

document.querySelector('.clients__btn-add').addEventListener('click', (e) => {
  e.preventDefault();

  document.body.prepend(createModalWithForm('Новый Клиент', 'post', { onSave, onClose }));

});




function createModalWithFormDelete(client, clientElement) {

  const modalElement = document.createElement('div');
  modalElement.classList.add('modal');
  const modalBox = document.createElement('div');
  modalBox.classList.add('modal__box-del');
  modalElement.append(modalBox);

  const modalBoxTop = document.createElement('div');
  modalBoxTop.classList.add('modal__box-top');

  modalBox.append(modalBoxTop);
  const modalTitle = document.createElement('h2');
  modalTitle.classList.add('modal__box-title');
  modalTitle.innerHTML = 'Удалить клиента';
  modalBoxTop.append(modalTitle);

  const btnCloseModal = document.createElement('button');
  btnCloseModal.classList.add('modal__btn-close', 'btn-reset');
  btnCloseModal.innerHTML =
    `<svg class="item__btn-svg svg-delete item__svg-modal">
            <use xlink:href="#modal-close"></use>
      </svg>`;
  modalBoxTop.append(btnCloseModal);

  const descModal = document.createElement('p');
  descModal.classList.add('modal__text');
  descModal.innerHTML = 'Вы действительно хотите удалить данного клиента?'
  modalBox.append(descModal);

  const wrapperGroupBtn = document.createElement('div');
  wrapperGroupBtn.classList.add('form__btn-group');
  modalBox.append(wrapperGroupBtn);

  const btnDelete = document.createElement('button');
  btnDelete.classList.add('btn-reset', 'modal__btn');
  btnDelete.innerHTML = 'Удалить';

  const btnCancel = document.createElement('button');
  btnCancel.classList.add('form__btn-cancel', 'btn-reset');
  btnCancel.innerHTML = 'Отмена';

  wrapperGroupBtn.append(btnDelete);
  wrapperGroupBtn.append(btnCancel);

  btnDelete.addEventListener('click', () => {

    clientElement.remove()
    fetch(`http://localhost:3000/api/clients/${client.id}`, {
      method: 'DELETE'
    })
    onClose(modalElement);
  })

  btnCloseModal.addEventListener('click', () => {
    spinner.remove();
    document.querySelectorAll('.item__svg').forEach(item => {
      item.style.display = 'flex';
    })
    onClose(modalElement);
  })

  btnCancel.addEventListener('click', () => {
    spinner.remove();
    document.querySelectorAll('.item__svg').forEach(item => {
      item.style.display = 'flex';
    })
    onClose(modalElement);
  })

  return modalElement;

  

}


document.querySelectorAll('.sort-btn').forEach(item => {
  item.addEventListener('click', async (e) => {
    const done = e.target.classList.toggle('sort-active');
    sortComplite(item, done);
  })
})


function sortClientsDown(item, data) {

  if (item.classList.contains('sort-id')) {
    let result = [...data].sort(function (a, b) { //fio
      if (a.id > b.id) return -1;
    })
    renderTableClients(result);
  }

  if (item.classList.contains('sort-fio')) {
    let result = [...data].sort(function (a, b) { //fio
      if (a.name > b.name) return -1;
    })
    renderTableClients(result);
  }

  if (item.classList.contains('sort-date')) {
    let result = [...data].sort(function (a, b) { //fio
      if (a.createdAt > b.createdAt) return -1;
    })
    renderTableClients(result);
  }

  if (item.classList.contains('sort-changes')) {
    let result = [...data].sort(function (a, b) { //fio
      if (a.updatedAt > b.updatedAt) return -1;
    })
    renderTableClients(result);
  }
}

function sortClientsUp(item, data) {

  if (item.classList.contains('sort-id')) {
    let result = [...data].sort(function (a, b) { //fio
      if (a.id < b.id) return -1;
    })
    renderTableClients(result);
  }

  if (item.classList.contains('sort-fio')) {
    let result = [...data].sort(function (a, b) { //fio
      if (a.name < b.name) return -1;
    })
    renderTableClients(result);
  }

  if (item.classList.contains('sort-date')) {
    let result = [...data].sort(function (a, b) { //fio
      if (a.createdAt < b.createdAt) return -1;
    })
    renderTableClients(result);
  }

  if (item.classList.contains('sort-changes')) {
    let result = [...data].sort(function (a, b) { //fio
      if (a.updatedAt < b.updatedAt) return -1;
    })
    renderTableClients(result);
  }
}


async function sortComplite(item, done) {

  const response = await fetch('http://localhost:3000/api/clients');
  const dataClients = await response.json();

  rotateRowSort();

  if (done) {
    document.querySelectorAll('.clients__list').forEach((item) => item.remove())
    sortClientsUp(item, dataClients);
  } else if (!done) {
    document.querySelectorAll('.clients__list').forEach((item) => item.remove()) // при повторном нажатии на кнопку возращает неотсортированынй список
    sortClientsDown(item, dataClients)
  }
}

function rotateRowSort() {

  const idRow = document.querySelector('.sort-id-svg');
  (idRow.closest('.sort-active')) ? idRow.style.transform = 'rotate(180deg)' : idRow.style.transform = 'rotate(0deg)';

  document.querySelectorAll('.sort__svg').forEach(item => {
    if (item.closest('.sort-active')) {
      item.style.transform = 'rotate(180deg)';
    } else {
      item.style.transform = 'rotate(0deg)';
    }
  })
}


document.querySelector('.header__input').addEventListener('input', async (e) => {

  const response = await fetch('http://localhost:3000/api/clients');
  const dataClients = await response.json();

  setTimeout(() => {

    if (e.target.value !== '') {
      let filterFio = [...dataClients].filter(function (item) { // фильтр по фио
        let fioStudents = (item.surname + ' ' + item.name + ' ' + item.lastName).toLowerCase();
        return fioStudents.includes((e.target.value).toLowerCase())
      })
      document.querySelectorAll('.clients__list').forEach((item) => item.remove())
      renderTableClients(filterFio);
    }

  }, 300)

  if (e.target.value === '') {
    document.querySelectorAll('.clients__list').forEach((item) => item.remove())
    renderTableClients(dataClients);
  }

})


