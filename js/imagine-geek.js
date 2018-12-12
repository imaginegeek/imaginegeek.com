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
        }

        var payload = {
            emailAddress,
            'entry.1858616976': firstName,
            'entry.537528185': lastName,
            'entry.1019551973': phoneNumber,
            'entry.939478713': companyName,
            'entry.1440709051': projectType,
            'entry.1779516715': projectDescription,
            'entry.864357190_year': startDate ? startDate[0] : null,
            'entry.864357190_month': startDate ? startDate[1] : null,
            'entry.864357190_day': startDate ? startDate[2] : null,
            'entry.1047530191_year': endDate ? endDate[0] : null,
            'entry.1047530191_month': endDate ? endDate[1] : null,
            'entry.1047530191_day': endDate ? endDate[2] : null,
            ffv: 1,
            draftResponse: [],
            pageHistory: 0,
            fbzx: -7361900706858704269
        };

        return payload;
    };

    function fieldValidate(fieldname, value) {
        var errorMessage = 'contains invalid characters.';
        var regExp;
        var valid;
        var required;
        var descriptor;

        function formatErrorMessage(descriptor, errorDetail) {
            return 'Your ' + descriptor + ' ' + errorDetail + ' ';
        }

        switch (fieldname) {
            case 'firstName':
                regExp = /^[a-z ,.'-]+$/i;
                required = true;
                descriptor = 'first name';
                break;
            case 'lastName':
                regExp = /^[a-z ,.'-]+$/i;
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

        // Skip validation on not-required fields.
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
                errorMessageUi += (
                    '<li><i class="fas fa-exclamation-circle icon-small"></i>&nbsp;&nbsp;' + errorsObj[fieldname] + '</li>'
                );
            }
        }

        return '<ul class="list">' + errorMessageUi + '</ul>';
    }

    function sendMappedUserInputFromUi(validationOnly) {
        var payload = {};
        var errors = {};
        var $controls = $('#quote-form').find('input, textarea, select');
        var controlValueWithNameAndType;
        var type;
        var errorsEncountered;
        var $control;
        var name;
        var value;

        $controls.each(function() {
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
            $formErrorsOutput.html(handleValidationErrorsEvent(errors));
        } else {
            $formErrorsOutput.text('');

            if (!validationOnly) {
                // Clear form UI when model has been validated and a submission is requested.
                typeof $controls.val === 'function' ? $controls.val('') : $controls.text('');
                submitUserInput(mapInputToPayload(payload))
            }
        }

        return !errorsEncountered;
    }

    $('[name="firstName"], [name="lastName"], [name="emailAddress"]').on('keyup', function() {
        // Allows validation to be run on keyup after a submit happens and the form model has been rejected.
        if (window.submitAttempted) {
            sendMappedUserInputFromUi(true);
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
        var $section = $('#' + sectionName);

        $('html, body').animate({
            scrollTop: $section.offset().top + (offset)
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
        var validFormModel = sendMappedUserInputFromUi();

        event.stopPropagation();
        event.preventDefault();

        if (!window.submittedAttempted) {
            window.submitAttempted = true;
        }

        validFormModel ? displayConfirmation() : togglePageSection('form-errors', -100, 350);
    });

    // Bind getQuotes section display
    $('#quote').click(function(event) {
        var $getQuoteRevealTrigger = $(this);

        event.stopPropagation();

        $getQuoteRevealTrigger.css({
            transition: 'all ease 500ms',
        });

        togglePageSection('quote-section', -100, 2000);
    });
});