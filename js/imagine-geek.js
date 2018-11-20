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
        const payload = {
            emailAddress,
            'entry.1858616976': firstName,
            'entry.537528185': lastName,
            'entry.1019551973': phoneNumber,
            'entry.939478713': companyName,
            'entry.1440709051': projectType,
            'entry.1779516715': projectDescription,
            ffv: 1,
            draftResponse: [],
            pageHistory: 0,
            fbzx: -7361900706858704269
        };

        return payload;
    };

    function sendMappedUserInputFromUi() {
        const payload = {};
        $('#quote-form').find('input, textarea, select').each(function() {
            const $control = $(this);
            const type = $control.attr('type');
            const name = $control.attr('name');
            let value;

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

            payload[name] = value;
        });

        submitUserInput(mapInputToPayload(payload));
    }

    $('#quote-form').submit(function(event) {
        event.stopPropagation();
        event.preventDefault();
        sendMappedUserInputFromUi(event);
    });
});