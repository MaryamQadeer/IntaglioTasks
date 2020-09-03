const states = {
    "AL": "Alabama",
    "AK": "Alaska",
    "AS": "American Samoa",
    "AZ": "Arizona",
    "AR": "Arkansas",
    "CA": "California",
    "CO": "Colorado",
    "CT": "Connecticut",
    "DE": "Delaware",
    "DC": "District Of Columbia",
    "FM": "Federated States Of Micronesia",
    "FL": "Florida",
    "GA": "Georgia",
    "GU": "Guam",
    "HI": "Hawaii",
    "ID": "Idaho",
    "IL": "Illinois",
    "IN": "Indiana",
    "IA": "Iowa",
    "KS": "Kansas",
    "KY": "Kentucky",
    "LA": "Louisiana",
    "ME": "Maine",
    "MH": "Marshall Islands",
    "MD": "Maryland",
    "MA": "Massachusetts",
    "MI": "Michigan",
    "MN": "Minnesota",
    "MS": "Mississippi",
    "MO": "Missouri",
    "MT": "Montana",
    "NE": "Nebraska",
    "NV": "Nevada",
    "NH": "New Hampshire",
    "NJ": "New Jersey",
    "NM": "New Mexico",
    "NY": "New York",
    "NC": "North Carolina",
    "ND": "North Dakota",
    "MP": "Northern Mariana Islands",
    "OH": "Ohio",
    "OK": "Oklahoma",
    "OR": "Oregon",
    "PW": "Palau",
    "PA": "Pennsylvania",
    "PR": "Puerto Rico",
    "RI": "Rhode Island",
    "SC": "South Carolina",
    "SD": "South Dakota",
    "TN": "Tennessee",
    "TX": "Texas",
    "UT": "Utah",
    "VT": "Vermont",
    "VI": "Virgin Islands",
    "VA": "Virginia",
    "WA": "Washington",
    "WV": "West Virginia",
    "WI": "Wisconsin",
    "WY": "Wyoming"
};

const timeCount = document.querySelector('[name="timeCount"]');

// start: states dropdown options
const stateElem = document.querySelector('[name="state"]');
const statesOptions = Object.entries(states).map(([code, stateName]) => {
    return `<option value="${code}">${stateName}</option>`;
}).join('');
stateElem.innerHTML = statesOptions;
// end: states dropdown options

// start: show / hide states dropdown on the basis of value in Customer Groupby dropdown
const customerGrpBy = document.querySelector('[name="customerGroupBy"]');
const cusGrpByState = document.querySelector('#customerGroupByState');
function handleCustomerGroupBy(e){
    if(e.target.value === 'all'){
        customerGroupByState.hidden = true;
        return;
    }
    customerGroupByState.hidden = false;
}
customerGrpBy.addEventListener('change', handleCustomerGroupBy);
// end: show / hide states dropdown on the basis of value in Customer Groupby dropdown

// start: show / hide fields and sub fields of Date
const dateField = document.querySelector('#date');
const flatpickr = $(dateField).flatpickr({
    enableTime: true,
    dateFormat: "Y-m-d H:i",
});
const daysArray = [0,1,2,3,4,5,6,7,8,9,10,11,12,13,14,15,16,17,18,19,20,21,22,23,24,25,26,27,28,29,30,31];
const weekArray = [0,1,2,3,4,5,6];
const daysDropdown = document.querySelector('[name="specificDtDayValue"]');

// daysDropdown.innerHTML += daysOptions;
const specificDt = document.querySelector('#relSpecificDate');
// console.log(specificDt);
function constructHTML(array){
    daysDropdown.innerHTML = array.map(day => {
        return `<option value="${day}">${day}</option>`
    }).join('');
}
function updateOptions(array){
    array[0] = "First";
    array[1] = "Last";
    constructHTML(array);
}
// if ever once the options in days array and week array are updated, restore them back
function restoreDefault(array){
    array[0] = 0;
    array[1] = 1;
    constructHTML(array);
}
specificDt.addEventListener('change', (e)=>{
    if (e.target.checked){
        //grab the selected option from time count i.e. weeks or months so the options can be updated accordingly
        // if months is selected
        if(timeCount.value === 'months'){
            updateOptions(daysArray);
            return;
        }
        // if weeks is selected
        updateOptions(weekArray);
        return;
    }
    else{
        restoreDefault(daysArray);
        restoreDefault(weekArray);
    }
});
const dateType = document.querySelectorAll('[name="dateOptions"]');
const relDate = document.querySelectorAll('.relativeDate');
function handleDateChange(e){
    // removing active class css from all types
    dateType.forEach(dType => {
        dType.parentElement.classList.remove('active');
    });
    const dateTypeElem = e.target;
    dateTypeElem.parentElement.classList.add('active');
    // for specific date
    if(dateTypeElem.value === 'specificDt'){
        dateField.hidden = false;
        relDate.forEach(relDtOption => {
            relDtOption.hidden =true;
        })
        return;
    }
    // for relative date
    // if it is relative date, then hide the date selection field
    dateField.hidden = true;
    // display Relative date field options
    relDate.forEach(relDtOption => {
        relDtOption.hidden =false;
    });
    handleTimeCountChange();
    hideWeeknMonths();
}
dateType.forEach(item => {
    item.addEventListener('change', handleDateChange);
});
//  On selection of weeks and Months, display specific date checkbox and days dropdown
const weekNmonths = document.querySelectorAll('.relativeDateWM');
const monInQtr = document.querySelector('.quarters');// Quarters options i.e. months dropdown
const radiosBAS = document.querySelectorAll('[name="relativeTo"]');  // before, after, same radios
const relToCount = document.querySelector('#countOfTime'); // counter after radioBAS
const sameOptions = document.querySelector('[name="sameOptions"]'); // dropdown when same is selected
function toggleFieldsDisplay(display){
    timeCount.hidden = display;
    relToCount.hidden = display;
    sameOptions.hidden = !display;
}
function toggleSameOptionFields(){
    // if month or quarter is selected, show days dropdown
    if (sameOptions.value === 'month' || sameOptions.value === 'quarter' ){
        restoreDefault(daysArray);
        specificDt.closest('.row').hidden = false;
        if (sameOptions.value === 'quarter'){
            monInQtr.hidden = false;
            monInQtr.closest('.row').hidden = false;
            return;
        }
        monInQtr.hidden = true;
        monInQtr.closest('.row').hidden = true;
        showWeekNMonths();
        return;
    }
    hideWeeknMonths();
    specificDt.closest('.row').hidden = true;
}
sameOptions.addEventListener('change',toggleSameOptionFields);
radiosBAS.forEach(option => {
    option.addEventListener('change', (e)=>{
        const elem = e.target;
        hideWeeknMonths();
        if(elem.value === 'before' || elem.value === 'after'){
            toggleFieldsDisplay(false);
            return;
        }
        // else elem.value will be equal to 'same', hide timeCount and relToCount then
        toggleFieldsDisplay(true);
        toggleSameOptionFields();
    });
});
function hideWeeknMonths(){
    weekNmonths.forEach(item => {
        item.hidden = true;
    });
}
function showWeekNMonths(){
    weekNmonths.forEach(item => {
        item.hidden = false;
    });
}
function handleTimeCountChange(){
    // load options in months and weeks dropdown's relevant sub dropdown
    if(timeCount.value === 'months'){
        restoreDefault(daysArray);
    }
    if(timeCount.value === 'weeks'){
        restoreDefault(weekArray);
    }
    if(!(timeCount.value === 'months' || timeCount.value === 'weeks')){
        hideWeeknMonths();
        // if quarter is selected then show months dropdown else not
        if(timeCount.value === 'quarters'){
            monInQtr.hidden = false;
            showWeekNMonths();
        }
        return;
    }
    // if quarter is not selected then hide months dropdown
    monInQtr.hidden = true;
    showWeekNMonths();
}
timeCount.addEventListener('change', handleTimeCountChange);

// end: show / hide fields and sub fields of Date

// start: show / hide frequency field on the basis of value in Recurrence field
const myElem = document.querySelector('#date');
const frequencySubElements = document.querySelector('#frequencySub');
const recurrence = document.querySelectorAll('[name="recurrence"]');
function handleChange(e){
    if(e.target.value === 'once'){
        frequencySubElements.hidden = true;
        return;
    }
    frequencySubElements.hidden = false;
}
recurrence.forEach(item => {
    item.addEventListener('change', handleChange);
});
// end: show / hide frequency field on the basis of value in Recurrence field

// start: Add reminder button Event
const addReminder = document.querySelector("#addReminder"); // add reminder button
const myContainer = document.querySelector("#myReminders"); // div that will contain all reminders
let reminder = {};
let reminderCount=0;
function constructReminders(){
    return `
        <div class="row m-2 justify-content-between" id="myReminder${reminderCount++}">
            <div class="col-sm-3">
                <select id="remindWhen" class="form-control">
                    <option>Before</option>
                    <option>After</option>
                </select>
            </div>
            <div class="col-sm-3">
                <input class="form-control" type="number" min="1" max="100"
                name="remindCounter" id="remindCounter">
            </div>
            <div class="col-sm-3">
                <select class="form-control" name="remindTimeCount">
                    <option value="hours" selected>Hours</option>
                    <option value="days">Days</option>
                    <option value="weeks">Weeks</option>
                    <option value="months">Months</option>
                    <option value="quarters">Quarters</option>
                    <option value="years">Years</option>
                </select>
            </div>
            <div class="col-sm-3"> 
                <button type="button" class="btn btn-outline-danger" onclick="deleteReminder(this)" name="deleteReminder">X</button>
            </div>
        </div>`;
}
function deleteReminder(delButton){
    delButton.closest('.row').remove();
}
function addReminderElem(){
    myReminders.insertAdjacentHTML('beforeend', constructReminders());
}
addReminder.addEventListener('click', addReminderElem);
// end: Add reminder button Event
