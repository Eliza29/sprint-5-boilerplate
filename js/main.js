$(document).ready(() => {
  // selecionando elementos del DOM
  let btnNewTopic = $('#btn-new-topic');
  let formNewTopic = $('#form-new-topic');
  let btnCreateTopic = $('#btn-create-topic');

  // funcionalidad para mostrar formulario
  let showFormNewTopic = (event) => {
    event.preventDefault();
    formNewTopic.addClass('d-block');
    formNewTopic.removeClass('d-none');
  };

  // Funcionalidad para filtrar
  let search = $('#search');
  let btnSearch = $('#btn-search');

  let searchTopic = () => {
    let inputSearchValue = search.val().trim();
    let parentsDivs = $('.parent');
    if (inputSearchValue.length !== 0) {
      [parentsDivs].forEach(element => {
        element.addClass('d-none');
        element.removeClass('d-block');
      });

      let allTopics = $('.topic-class');
      [...allTopics].forEach(element => {
        let textTopic = element.textContent.trim(); 
        let parentDiv = element.parentElement.parentElement.parentElement.parentElement;
        if (textTopic.indexOf(inputSearchValue) !== -1) {
          parentDiv.classList.add('d-block');
          parentDiv.classList.remove('d-none');          
        } else {
          parentDiv.classList.add('d-none');
          parentDiv.classList.remove('d-block');
        };
      }); 
    } else {
      console.log('input vacio');
      [parentsDivs].forEach(element => {
        element.addClass('d-block');
        element.removeClass('d-none');
      });
    }
  }; 
  search.on('input', searchTopic);
  btnSearch.on('click', searchTopic);

  // funcionalidad para crear topic y ocultar formulario
  let createNewTopic = (event) => {
    event.preventDefault();
    formNewTopic.addClass('d-none');
    formNewTopic.removeClass('d-block');
    let authors = $('#nombre').val();
    let messages = $('#message').val();
    console.log(authors);
    console.log(messages);

    // Publicando usando Post
    $.ajax({
      type: 'POST',
      url: 'http://examen-laboratoria-sprint-5.herokuapp.com/topics',
      data: JSON.stringify({
        'author_name': authors,
        'content': messages
      }),
      // or JSON.stringify ({name: 'jonas'}),
      success: function(data) {
        getTopicsHtml();
      },
      contentType: 'application/json',
      dataType: 'json'
    });
  };

  // Ajax mostrar topics
  let getTopicsHtml = () => {
    let $addTopic = $('.add-topic');
    $addTopic.html('');
    $addTopic.append('<div class="row justify-content-center box"/>');

    function addResponse(data) {
      $.each(data, function(i, obj) {
        let aTopic = data[i].content;
        let anAuthor = data[i].author_name;
        let numberAnswers = data[i].responses_count;
        let ids = data[i].id;
        $addTopic.find('.box').append(`<div class="col-8 p-3 my-3 border rounded d-block parent" data-id="${ids}">
          <div class="row justify-content-center"><div class="col-4"><p class="text-center my-0">Tema:
          <span id="topic" class="topic-class">${aTopic}</span></p></div><div class="col-4"><p class="text-center my-0">Por:
          <span id="author">${anAuthor}</span></p></div><div class="col-4"><p class="text-center my-0">Respuestas:
          <span id="responses-number">${numberAnswers}</span></p></div></div></div></div>`);
      });
    }

    $.ajax({
      url: 'http://examen-laboratoria-sprint-5.herokuapp.com/topics'
    }).done(addResponse)
      .fail(function() {
        console.log('error');
      });
  };

  // asociando funciones a elementos del DOM
  btnNewTopic.on('click', showFormNewTopic);
  btnCreateTopic.on('click', createNewTopic);

  getTopicsHtml();
});