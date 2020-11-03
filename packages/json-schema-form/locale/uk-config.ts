export const UK_INTL = {
    required: 'Це поле є обов`язковим для заповнення.',
    minLength: 'Повинно бути не менше {{minimumLength}} символів (поточна довжина: {{currentLength}}).',
    maxLength: 'Повинно бути не більше {{maximumLength}} символів (поточна довжина: {{currentLength}}).',
    pattern: 'Повинен відповідати шаблоном: {{requiredPattern}}.',
    format: (error: { requiredFormat: string }) => {
        switch (error.requiredFormat) {
            case 'date':
                return 'Повинна бути дата, наприклад "2000-12-31".';
            case 'time':
                return 'Повинен бути час, наприклад "16:20" або "03:14:15.9265".';
            case 'date-time':
                return 'Вкажіть дату і час, наприклад "2000-03-14T01:59" або "2000-03-14T01:59:26.535Z".';
            case 'email':
                return 'Повинен бути адреса електронної пошти, наприклад "name@example.com".';
            case 'hostname':
                return 'Повинно бути ім\'я хоста, наприклад "example.com".';
            case 'ipv4':
                return 'Повинен бути IPv4-адрес, наприклад "127.0.0.1".';
            case 'ipv6':
                return 'Повинен бути IPv6-адреса, наприклад "1234:5678:9ABC:DEF0:1234:5678:9ABC:DEF0".';
            case 'url':
                return 'Це повинен бути URL, наприклад "http://www.example.com/page.html".';
            case 'uuid':
                return 'Повинен бути uuid, наприклад "12345678-9ABC-DEF0-1234-56789ABCDEF0".';
            case 'color':
                return 'Повинен бути колір, наприклад "#FFFFFF" або "rgb(255,255,255)".';
            case 'json-pointer':
                return 'Повинен бути покажчик JSON, наприклад "/pointer/to/something".';
            case 'relative-json-pointer':
                return 'Повинен бути відносним показником JSON, наприклад "2/pointer/to/something".';
            case 'regex':
                return 'Повинно бути регулярний вираз, наприклад "(1-)?\\d{3}-\\d{3}-\\d{4}".';
            default:
                return `Повинен бути правильно відформатований${error.requiredFormat}.`;
        }
    },
    minimum: 'Повинно бути {{minimumValue}} або більше.',
    exclusiveMinimum: 'Повинно бути більше {{exclusiveMinimumValue}}.',
    maximum: 'Повинно бути {{maximumValue}} або менше.',
    exclusiveMaximum: 'Повинно бути менше ніж {{exclusiveMaximumValue}}.',
    multipleOf: (error: { multipleOfValue: number }) => {
        if ((1 / error.multipleOfValue) % 10 === 0) {
            const decimals = Math.log10(1 / error.multipleOfValue);
            return `Повинно бути ${decimals} або менше десяткових знаков.`;
        } else {
            return `Повинно бути кратно ${error.multipleOfValue}.`;
        }
    },
    minProperties: 'Повинно бути {{minimumProperties}} або більше елементів (поточні елементи: {{currentProperties}}).',
    maxProperties: 'Повинно бути {{maximumProperties}} або менше елементів (поточні елементи: {{currentProperties}}).',
    minItems: 'Повинно бути {{minimumItems}} або більше елементів (поточні елементи: {{currentItems}}).',
    maxItems: 'Повинно бути {{maximumItems}} або менше елементів (поточні елементи: {{currentItems}}).',
    uniqueItems: 'Всі предмети повинні бути унікальними.',
};
