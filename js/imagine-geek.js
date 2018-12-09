$(function() {
    var $formErrorsOutput = $('#form-errors');

    function submitUserInput(
        input,
        endpoint = 'https://docs.google.com/forms/d/e/1FAIpQLScT5_-BPvZPn1G0IpQPticPFk8yoG8KTPqXwkDjmZlMkpsq2A/formResponse'
    ) {
        if (input) {
            $.post(endpoint, $.param(input));
        }
    }

    function mapInputToPayload({
        emailAddress,
        firstName,
        lastName,
        phoneNumber,
        companyName,
        projectType,
        projectDescription,
        startDate,
        endDate
    }) {
        if (startDate && endDate) {
            startDate = startDate.split('-');
            endDate = endDate.split('-');
        } else {
            // Prevent index out of bound exception if no date is provided for project start/end.
            startDate = '   ';
            endDate = '   ';
        }

        var payload = {
            emailAddress,
            'entry.1858616976': firstName,
            'entry.537528185': lastName,
            'entry.1019551973': phoneNumber,
            'entry.939478713': companyName,
            'entry.1440709051': projectType,
            'entry.1779516715': projectDescription,
            'entry.864357190_year': startDate[0],
            'entry.864357190_month': startDate[1],
            'entry.864357190_day': startDate[2],
            'entry.1047530191_year': endDate[0],
            'entry.1047530191_month': endDate[1],
            'entry.1047530191_day': endDate[2],
            ffv: 1,
            draftResponse: [],
            pageHistory: 0,
            fbzx: -7361900706858704269
        };

        return payload;
    };

    function fieldValidate(fieldname, value) {
        var regExp;
        var errorMessage;
        var valid;
        var required;
        var descriptor;

        function formatErrorMessage(descriptor, errorDetail) {
            return 'Your ' + descriptor + ' ' + errorDetail + ' ';
        }

        switch (fieldname) {
            case 'firstName':
                regExp = /^[a-z ,.'-]+$/i;
                errorMessage = 'is an invalid first name.';
                required = true;
                descriptor = 'first name';
                break;
            case 'lastName':
                regExp = /^[a-z ,.'-]+$/i;
                errorMessage = 'is an invalid last name.';
                required = true;
                descriptor = 'last name';
                break;
            case 'emailAddress':
                regExp = /(?:[a-z0-9!#$%&'*+/=?^_`{|}~-]+(?:\.[a-z0-9!#$%&'*+/=?^_`{|}~-]+)*|"(?:[\x01-\x08\x0b\x0c\x0e-\x1f\x21\x23-\x5b\x5d-\x7f]|\\[\x01-\x09\x0b\x0c\x0e-\x7f])*")@(?:(?:[a-z0-9](?:[a-z0-9-]*[a-z0-9])?\.)+[a-z0-9](?:[a-z0-9-]*[a-z0-9])?|\[(?:(?:25[0-5]|2[0-4][0-9]|[01]?[0-9][0-9]?)\.){3}(?:25[0-5]|2[0-4][0-9]|[01]?[0-9][0-9]?|[a-z0-9-]*[a-z0-9]:(?:[\x01-\x08\x0b\x0c\x0e-\x1f\x21-\x5a\x53-\x7f]|\\[\x01-\x09\x0b\x0c\x0e-\x7f])+)\])/;
                errorMessage = 'is an invalid email address.';
                required = true;
                descriptor = 'email address';
                break;
        }

        if (!value && required) {
            return formatErrorMessage(descriptor, 'cannot be blank.');
        } else if (typeof regExp === 'object') {
            valid = regExp.test(value);
        }

        // Allow non-required fields through and send any required field errors back to UI as formatted error.
        return (valid === true || valid === undefined) || formatErrorMessage(descriptor, errorMessage);
    }

    function getControlValueWithNameAndType($control) {
        var type = $control.attr('type');
        var name = $control.attr('name');
        var value;

        switch (type) {
            case 'text':
            case 'password':
            case 'email':
            case 'radio':
            case 'checkbox':
            case 'date':
                value = $control.val();
                break;
            default:
                switch ($control.get(0).tagName.toLowerCase()) {
                    case 'select':
                    case 'textarea':
                        value = $control.val();
                        break;
                    default:
                        value = $control.text();
                }
        }

        return {
            name: name,
            value: value,
            type: type
        };
    }

    function handleValidationErrorsEvent(errorsObj) {
        var errorMessageUi = '';
        for (var fieldname in errorsObj) {
            if (!errorsObj.hasOwnProperty(fieldname)) {
                return;
            }

            if (errorsObj[fieldname]) {
                errorMessageUi += errorsObj[fieldname];
            }
        }

        return errorMessageUi;
    }

    function sendMappedUserInputFromUi() {
        var payload = {};
        var errors = {};
        var controlValueWithNameAndType;
        var type;
        var errorsEncountered;
        var $control;
        var name;
        var value;

        $('#quote-form').find('input, textarea, select').each(function() {
            var errorMessage;
            $control = $(this);
            controlValueWithNameAndType = getControlValueWithNameAndType($control);
            name = controlValueWithNameAndType.name;
            type = controlValueWithNameAndType.type;
            value = controlValueWithNameAndType.value;

            // Either true for no validation errors, or a string of errors found if invalid.
            valid = fieldValidate(name, value);

            if (valid === true) {
                payload[name] = value;
            } else {
                errorMessage = valid;
                errors[name] = errorMessage;
                errorsEncountered = true;
            }
        });

        if (errorsEncountered) {
            togglePageSection('form-errors', -100, 350);
            $formErrorsOutput.text(handleValidationErrorsEvent(errors));
        } else {
            $formErrorsOutput.text('');
            submitUserInput(mapInputToPayload(payload));
        }

        return !errorsEncountered;
    }

    $('[name="firstName"], [name="lastName"], [name="emailAddress"]').on('keyup', function() {
        if (window.submitAttempted) {
            sendMappedUserInputFromUi();
        }
    });

    function displayConfirmation() {
        var $quoteSubmitButton = $('[name="quoteSubmit"]');
        var originalMessage = $quoteSubmitButton.text();
        var newMessage = 'Your message has been sent!';
        var successCssClass = 'btn-success';

        $quoteSubmitButton.addClass(successCssClass).text(newMessage);
        hideConfirmation($quoteSubmitButton, originalMessage, successCssClass);
    }

    function hideConfirmation($quoteSubmitButton, originalMessage, successCssClass) {
        setTimeout(function() {
            $quoteSubmitButton.removeClass(successCssClass).text(originalMessage);
        }, 1750);
    }

    function togglePageSection(sectionName, offset, timing) {
        var $section = $(`#${sectionName}`);

        $('html, body').animate({
            scrollTop: $section.offset().top
        }, timing);
    }

    function toggleNavSelectionFromClick(navLinkSelectors) {
        var navLinksSelector = navLinkSelectors.join(', ');
        var $navLinks = $(navLinksSelector);

        function handleLinkSelection(event) {
            var $selectedNavLink = $(this);

            event.preventDefault();

            setTimeout(function() {
                $navLinks.each(function() {
                    $(this).removeClass('selected');
                });
                $selectedNavLink.addClass('selected');
            }, 2000);
        }

        $navLinks.click(handleLinkSelection);
    }

    toggleNavSelectionFromClick(['#GoToHome', '#GoToWorks', '#GoToFeatures', '#GoToGallery']);

    // Bind quote request submission.
    $('#quote-form').submit(function(event) {
        event.stopPropagation();
        event.preventDefault();
        if (!window.submittedAttempted) {
            window.submitAttempted = true;
        }
        if (sendMappedUserInputFromUi()) {
            displayConfirmation();
        }
    });

    // Bind getQuotes section display
    $('#quote').click(function(event) {
        var $getQuoteRevealTrigger = $(this);

        $getQuoteRevealTrigger.css({
            transition: 'all ease 500ms',
        });

        event.stopPropagation();
        togglePageSection('quote-section', -100, 2000);
    });
});