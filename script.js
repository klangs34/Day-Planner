//make sure the document is ready
$(document).ready(function () {
    //set the 9-5 hour slot display
    var hourDisplay = ["9AM", "10AM", "11AM", "12PM", "1PM", "2PM", "3PM", "4PM", "5PM"];
    var currentHour = moment().format('h');
    var amPm = moment().format('a');
    //declare empty array for local storage
    var savedNote = JSON.parse(localStorage.getItem('savedNote')) || [];
    //declare input element variable
    var inputEl;

    //get the local storage values 
    var savedCalendarNotes = JSON.parse(localStorage.getItem('savedNote'));

     //now that the elements have been appended...add the notes from local storage, if any
    //check to see if the iterated time has notes. if so pull from the local storage
    function addNotes() {
        $.each(hourDisplay, function(i, time){
            $.each(savedCalendarNotes, function (j, val) {
                if (time === val.time) {
                    //get appropriate input field
                    var noteEl = $(`[data-time=${time}]`);
                    //set the note field
                    noteEl.val(val.note);
                }
            })
        
        })
    }
    //declare index vars
    var getIndex
    var currentTimeIndex

    //run loop to display hourly time from 9-5 along with note field and save button
    $.each(hourDisplay, function (i, time) {
 
        //format current time to look like hourDisplay
        var currentTime = currentHour + amPm.toUpperCase();
        //first get the index of the iterated time that is not equal to the current
        getIndex = hourDisplay.indexOf(currentTime);
        currentTimeIndex = hourDisplay.indexOf(time);

        if (currentTime === time) {
            //define the input field to add style during loop based on current time
            inputEl = `<input type='text' class='bg-danger col border p-3 note text-light' value='' data-time=${time} />`;
            //capture index
        } else {
            //for times other than the current time, turn them blue or gray
        
            //if in the work day time period but not the curren time and after the current iteration
            if (getIndex !== -1 && (getIndex < currentTimeIndex)) {
                //make the elements green to indicate availibility
                inputEl = `<input type='text' class='bg-info col border p-3 note text-light' value='' data-time=${time} />`;
            } else {
                //set all other timeslots to gray
                inputEl = `<input type='text' class='bg-secondary col border p-3 note text-dark' value='' data-time=${time} />`
            }

        }

        //create a row with 3 columns
        var row = $(`<div class='row'>
        <div class="col-2 text-right border-top border-bottom p-3 time">
            ${time}
        </div>
        ${inputEl}
        <button class="btn-sm btn-success col-2 border-top border-bottom p-3 save">
            Save <i class="far fa-save"></i>
        </button>`);
        $('.calendar').append(row);

    })
  

    //console.log(moment().format('MMMM Do YYYY'))

    //show current date in header
    $('.date').text(moment().format('MMMM Do YYYY'))

    //get current time
    //var currentTime = moment().format('h:mm:ss a');

    //get selected input value
    $('.save').on('click', function () {
        //save selected timeslot (hour) and note to array
        savedNote.push({
            time: $(this).prev().prev().text().trim(),
            note: $(this).prev().val()
        })

        //console.log($(this).prev().val())
        localStorage.setItem('savedNote', JSON.stringify(savedNote));
    })

    addNotes()

})
