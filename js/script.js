window.addEventListener ('load', () => {

// Set name field to focus on page load
    const name = document.querySelector('#name');
    name.focus();

// Hide input for other job role until its selected
    const otherJobRole = document.querySelector('#other-job-role');
    otherJobRole.style.display = 'none';

    const jobRole = document.querySelector('#title')
    jobRole.addEventListener('change', (e) => {
        if (e.target.value == 'other') {
            otherJobRole.style.display = '';
        } else {
            otherJobRole.style.display = 'none';
        }
    });

// T-Shirt design selection controls options that appear for color selection
    const shirtColor = document.querySelector('#color');
    shirtColor.disabled = true;
    
    const shirtDesign = document.querySelector('#design');
    shirtDesign.addEventListener('change', () => {
        shirtColor.disabled = false;
        const colors = shirtColor.children;
        /**
         * This function updates the option elements in the "Color" select menu based on design choice
         * @param {string} design - the chosen option from the "Design" dropdown
         */
        function colorOptions(design) {
            let firstLoop = true;
            for (let i=0; i<colors.length; i++) {
                const theme = colors[i].dataset.theme;
                if (theme && theme == design) {
                    colors[i].removeAttribute('hidden');
                    if (firstLoop) {
                        colors[i].setAttribute('selected', '');
                        firstLoop = false;
                    }
                } else {
                    colors[i].setAttribute('hidden', '');
                    colors[i].removeAttribute('selected');
                }
            }
        }
        if (shirtDesign.value == 'heart js') {
            colorOptions('heart js')
        }
        if (shirtDesign.value == 'js puns') {
            colorOptions('js puns');
        }
    });

// Accessibility - make focus states of "Activities" more obvious
    const activities = document.querySelector('#activities');
    const checkboxes = activities.querySelectorAll('[type="checkbox"]');
    for (let i=0; i<checkboxes.length; i++) {
        checkboxes[i].addEventListener('focus', (e) => {
            checkboxes[i].parentElement.className = 'focus';
        })
        checkboxes[i].addEventListener('blur', (e) => {
            checkboxes[i].parentElement.removeAttribute('class', 'focus')
        })
    }

// Update price in "Register for Activities" section
    let totalDisplay = document.querySelector('#activities-cost');
    let cost = 0;

    activities.addEventListener('change', (e) => {
        if (e.target.tagName == 'INPUT') {
            if (e.target.checked) {
                cost += parseInt(e.target.dataset.cost);
            } else {
                cost -= parseInt(e.target.dataset.cost);
            }
            totalDisplay.textContent = `Total: $${cost}`;
        }
    });

// Payment info section display based on selection
    const payMethod = document.querySelector('#payment');
    const creditSection = document.querySelector('#credit-card');
    const paypalSection = document.querySelector('#paypal');
    const bitcoinSection = document.querySelector('#bitcoin');

    paypalSection.style.display = 'none';
    bitcoinSection.style.display = 'none';

    payMethod.addEventListener('change', () => {
        if (payMethod.value == 'credit-card' ) {
            creditSection.style.display = '';
            paypalSection.style.display = 'none';
            bitcoinSection.style.display = 'none'
        }if (payMethod.value == 'paypal') {
            creditSection.style.display = 'none';
            paypalSection.style.display = '';
            bitcoinSection.style.display = 'none';
        }
        if (payMethod.value == 'bitcoin' ) {
            creditSection.style.display = 'none';
            paypalSection.style.display = 'none';
            bitcoinSection.style.display = ''
        }
    });

// Elements for form validation
    const form = document.getElementsByTagName('form')[0];
    const email = document.querySelector('#email');
    const cardNumber = document.querySelector('#cc-num');
    const zipCode = document.querySelector('#zip');
    const cvv = document.querySelector('#cvv');
    
    /**
     *  Helper functions for checking each field validity
     *  @return {boolean} whether or not name field is blank
     */
    function nameIsValid() {
        return /[a-z]+/i.test(name.value);
    }
    function emailIsValid() {
        return /^[^@]+@[^@.]+\.[a-z]+$/i.test(email.value);
    }
    function activitiesIsValid() {
        let selectionMade = false;
        for (let i=0; i<checkboxes.length; i++) {
            if (checkboxes[i].checked) {
                selectionMade = true;
            }
        }
        return selectionMade;
    }
    function cardIsValid() {
        return /^\d{13,16}$/.test(cardNumber.value);
    }
    function zipIsValid() {
        return /^\d{5}$/.test(zipCode.value);
    }
    function cvvIsValid() {
        return /^\d{3}$/.test(cvv.value);
    }
    function payIsValid() {
        if (payMethod.value == 'select method') {
            return false;
        }
        if (payMethod.value == 'paypal' || payMethod.value == 'bitcoin') {
            return true;
        }
        if (payMethod.value == 'credit-card') {
            if (cardIsValid() && zipIsValid() && cvvIsValid()) {
                return true;
            } else {
                return false;
            }
        }
    }

// Error notifications for invalid form entries
    /**
     *  Helper function for notifying user of error in form element 
     *  @param {string} element - the form element that has invalid input
     */
    function testForError(validityCheck, element) {
        if (!validityCheck) {
            element.classList.add('not-valid');
            element.classList.remove('valid');
            element.lastElementChild.style.display = 'inherit';
        } else {
            element.classList.remove('not-valid');
            element.classList.add('valid');
            element.lastElementChild.style.display = 'none';
        }
    }

// Submit event handler with form validation AND error notifications
    form.addEventListener('submit', (e) => {
        if (nameIsValid() && emailIsValid() && activitiesIsValid() && payIsValid()) {
            // Submit form successfully
        } else {
            e.preventDefault();

            testForError(nameIsValid(), name.parentElement);
            testForError(emailIsValid(), email.parentElement);
            testForError(activitiesIsValid(), activities);

            if (!payIsValid()) {
                if (payMethod.value == 'select method') {
                    testForError(payIsValid(), payMethod.parentElement);
                }
                if (payMethod.value == 'credit-card') {
                    testForError(payIsValid(), payMethod.parentElement.parentElement.parentElement);
                    testForError(cardIsValid(), cardNumber.parentElement);
                    testForError(zipIsValid(), zipCode.parentElement);
                    testForError(cvvIsValid(), cvv.parentElement);
                }
            }
        }
    });
});
