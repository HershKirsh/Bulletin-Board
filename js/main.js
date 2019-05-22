noteElems = {
    notesDiv: document.getElementById("notes"),
    toAppend: "",
    notes: []
};
function Note(_text, _date, _time, _top, _left) {
    this.text = _text,
        this.date = _date,
        this.time = _time,
        this.top = _top,
        this.left = _left
};
function create() {
    var formText = document.getElementById("text");
    var textValue = formText.value;
    var formDate = document.getElementById("date");
    var dateValue = formDate.value;
    var formTime = document.getElementById("time");
    var timeValue = formTime.value;
    var topRandom = parseInt(Math.random() * 575 + "px");
    var leftRandom = parseInt(Math.random() * 1225 + "px");
    var newNote = new Note(textValue, dateValue, timeValue, topRandom, leftRandom);
    noteElems.notes.push(newNote);
    noteElems.notes.forEach(appendHtml);
    noteElems.notes.forEach(setStyle);
    jsonify();
    formText.value = "";
    formDate.value = "";
    formTime.value = "";
};
function appendHtml(note, i) {
    noteElems.toAppend += `<div id="note${i}" class="eachnote" draggable="true" onmousedown="dragElems.dragStart(event, ${i})">
        <span> ${note.text} </span>
        <span> ${note.date} </span>
        <span> ${note.time} </span>
        <button class="btn" onclick="deleteNote(this, ${i}, { capture: false })">X</button>
        </div>`
    if (i == noteElems.notes.length - 1) {
        noteElems.notesDiv.innerHTML = noteElems.toAppend;
        noteElems.toAppend = "";
    }
};
function setStyle(note, i) {
    var thisNote = document.getElementById(`note${i}`);
    thisNote.style.position = "absolute";
    thisNote.style.top = note.top + "px";
    thisNote.style.left = note.left + "px";
};
function deleteNote(note, i) {
    var div = note.parentElement;
    noteElems.notes.splice(i, 1);
    div.remove();
    noteElems.notes.forEach(appendHtml);
    noteElems.notes.forEach(setStyle);
    jsonify();
};
function jsonify() {
    var notesJson = JSON.stringify(noteElems.notes);
    localStorage.setItem("allNotes", notesJson);
};
const dragElems = {
    noteDiv: "",
    position: [0, 0, 0, 0],
    noteId: 0,
    currentNote: "",
    dragStart: function (e, num) {
        this.currentNote = num;
        noteDiv = e.currentTarget;
        this.position[2] = e.clientX;
        this.position[3] = e.clientY;
        document.addEventListener("mousemove", this.onMouseMove);
    },
    onMouseMove: function (e) {
        e.preventDefault();
        dragElems.position[0] = dragElems.position[2] - e.clientX;
        dragElems.position[1] = dragElems.position[3] - e.clientY;
        dragElems.position[2] = e.clientX;
        dragElems.position[3] = e.clientY;
        noteDiv.style.top = (noteDiv.offsetTop - dragElems.position[1]) + "px";
        noteDiv.style.left = (noteDiv.offsetLeft - dragElems.position[0]) + "px";
        document.addEventListener("mouseup", dragElems.dragEnd);
    },
    dragEnd: function () {
        document.removeEventListener("mouseup", dragElems.dragEnd);
        document.removeEventListener("mousemove", dragElems.onMouseMove);
        noteElems.notes[dragElems.currentNote].top = noteDiv.offsetTop;
        noteElems.notes[dragElems.currentNote].left = noteDiv.offsetLeft;
        jsonify();
    }
};
(function getNotes() {
    var notesJSON = localStorage.getItem("allNotes");
    if (notesJSON != null) {
        noteElems.notes = JSON.parse(notesJSON);
    };
    noteElems.notes.forEach(appendHtml);
    noteElems.notes.forEach(setStyle);
})();