$(function() {
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

    function filterFormControlsParseValues(valuesMap) {
        var $control = $(this);
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
                {
                    switch ($control.get(0).tagName.toLowerCase()) {
                        case 'select':
                        case 'textarea':
                            value = $control.val();
                            break;
                        default:
                            value = $control.html();
                    }
                }
        }

        valuesMap[name] = value;

        return valuesMap;
    }

    function sendMappedUserInputFromUi() {
        var payload = {};

        $('#quote-form').find('input, textarea, select').each(function() {
            payload = filterFormControlsParseValues.call(this, payload);
        });

        submitUserInput(mapInputToPayload(payload));
    }

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

    function togglePageSection(sectionName, offset) {
        var $section = $(`#${sectionName}`);

        $('html, body').animate({
            scrollTop: $section.offset().top - offset
        }, 2000);
    }

    // Bind quote request submission.
    $('#quote-form').submit(function(event) {
        event.stopPropagation();
        event.preventDefault();
        sendMappedUserInputFromUi();
        displayConfirmation();
    });

    // Bind getQuotes section display
    $('#quote').click(function(event) {
        var $getQuoteRevealTrigger = $(this);

        $getQuoteRevealTrigger.css({
            transition: 'all ease 500ms',
        });

        event.stopPropagation();
        togglePageSection('quote-section', 100);
    });
});