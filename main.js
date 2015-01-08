window.app = window.app || {};

$(function() {
  $(".restart").click(restart);
  initialize();
});

function initialize(){
  app.BodyNum = 0;
  setBody(app.BodyNum);
  createLetters();
  RandomWord();
};

function setBody(imageNumber){
  $(".hang-body").css("background-image", "url(images/" + imageNumber + ".png)");
};

function createLetters(){
  $(".letters").html("<table class=\"full\"> \
              <tr class=\"letterrow\"> \
                <td class=\"letter unselected\">a</td> \
                <td class=\"letter unselected\">b</td> \
                <td class=\"letter unselected\">c</td> \
                <td class=\"letter unselected\">d</td> \
                <td class=\"letter unselected\">e</td> \
                <td class=\"letter unselected\">f</td> \
                <td class=\"letter unselected\">g</td> \
                <td class=\"letter unselected\">h</td> \
                <td class=\"letter unselected\">i</td> \
              </tr> \
              <tr class=\"letterrow\"> \
                <td class=\"letter unselected\">j</td> \
                <td class=\"letter unselected\">k</td> \
                <td class=\"letter unselected\">l</td> \
                <td class=\"letter unselected\">m</td> \
                <td class=\"letter unselected\">n</td> \
                <td class=\"letter unselected\">o</td> \
                <td class=\"letter unselected\">p</td> \
                <td class=\"letter unselected\">q</td> \
                <td class=\"letter unselected\">r</td> \
              </tr> \
              <tr class=\"letterrow\"> \
                <td class=\"letter unselected\">s</td> \
                <td class=\"letter unselected\">t</td> \
                <td class=\"letter unselected\">u</td> \
                <td class=\"letter unselected\">v</td> \
                <td class=\"letter unselected\">w</td> \
                <td class=\"letter unselected\">x</td> \
                <td class=\"letter unselected\">y</td> \
                <td class=\"letter unselected\">z</td> \
              </tr> \
            </table>");
  $(".letter").click(letterClick);
};

function restart(event){
  initialize();
};

function letterClick(event){
  if($(event.target).hasClass("unselected")){
    if(!guessLetter(event.target.innerText))
      wrongGuess();
  }
  $(event.target).removeClass("unselected");
  $(event.target).addClass("selected");
  if(app.lettersRemaining == 0)
    playerWins();
};

function guessLetter(letter){
  var startIndex = 0;
  var occcurences = [];
  while((index = app.generatedWord.indexOf(letter, startIndex)) > -1){
    occcurences.push(index);
    startIndex = index + 1;
  }
  if(occcurences.length){
    revealLetters(occcurences, letter);
    app.lettersRemaining = app.lettersRemaining - occcurences.length;
    return true;
  }
  else
    return false
};

function wrongGuess(){
  app.BodyNum++;
  if(app.BodyNum < 6)
    setBody(app.BodyNum);
  else{
    setBody(6);
    endGame();
  }
};

function revealLetters(indicies, letter){
  for(var i = 0; i < indicies.length; i++){
    $($(".full")[0].rows[0].cells[indicies[i]]).html(letter);
  }
};

function RandomWord() {
  var requestStr = "http://randomword.setgetgo.com/get.php";
  $.ajax({
      type: "GET",
      url: requestStr,
      dataType: "jsonp",
      jsonpCallback: 'RandomWordComplete'
  });
};

function RandomWordComplete(data) {
  app.generatedWord = data.Word.trim().toLowerCase();
  app.lettersRemaining = app.generatedWord.length;
  SetupGame();
};

function SetupGame(){
  console.log("\""+app.generatedWord+"\"");
  var inside = "";
  var width = 100 / app.generatedWord.length;
  for(var i = 0; i < app.generatedWord.length; i++){
    inside = inside.concat("<td width=\""+width+"%\">_</td>");
  }
  $(".characters").html(
    "<table class=\"full\"><tr>" +
    inside +
    "</tr></table>"
  );
};

function playerWins(){
  $(".letters").html("You Win!");
};

function endGame(){
  $(".characters").html(app.generatedWord);
  $(".letters").html("You Lose!");
};
